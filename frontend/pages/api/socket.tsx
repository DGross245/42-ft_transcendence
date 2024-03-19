import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import crypto from 'crypto';
import { ethers } from 'ethers';
import tournamentAbi from '@/public/tournamentManager_abi.json';
import { matchmaking, tournamentHandler } from "./matchmaking";
import { contract_address } from "@/components/hooks/useContract";
import { LogstashTransport } from "winston-logstash-ts";

const logger = LogstashTransport.createLogger("transcendence", {
	port: 5001,
	protocol: 'tcp',
	host: 'localhost'
});
/* -------------------------------------------------------------------------- */
/*                                Interface(s)                                */
/* -------------------------------------------------------------------------- */
interface SocketApiResponse extends NextApiResponse {
	socket: ServerResponse<IncomingMessage>['socket'] & {
		server?: {
			io?: Server | undefined;
		};
	};
}

const provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
export const contract = new ethers.Contract(contract_address, tournamentAbi, provider);

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */
const SocketHandler = async (req: NextApiRequest, res: SocketApiResponse): Promise<void> => {

	const started: any = [];
	const containBot: any = [];

	const getElo = async (address: string) => {
		if (address) {
			const eloScore = Number(await contract.getPlayerRankedElo(address));
			return (eloScore);
		}
	}

	logger.info('SocketHandler Called');

	if (!res.socket.server?.io) {
		const io = new Server(res.socket.server as any);
		res.socket.server!.io = io;
		
		io.on('connection', (socket) => {

			socket.on('WalletAdress', async (address: `0x${string}` | undefined) => {
				socket.data = {
					walletAddress: address,
					get elo() {
						return getElo(String(address));
					},
					isInGame: false
				}
			});

			socket.on('tournament', async (tournamentID: number, gameType: string) => {
				const sockets = await io.in(`tournament-${tournamentID}`).fetchSockets();
				tournamentHandler(sockets, tournamentID, gameType, io);
			});

			socket.on('join-tournament', (tournamentID: number) => {
				socket.join(`tournament-${tournamentID}`);
				socket.emit(`tournament-${tournamentID}-joined`, tournamentID);
			});

			socket.on('join-queue', async (gameType: string) => {
				socket.join(gameType);
				const sockets = await io.in(gameType).fetchSockets();
				matchmaking({sockets, gameType});
			});
			
			socket.on('Update-Status', (isInGame: boolean, gameId: string) => {
				socket.data.isInGame = isInGame;
				socket.emit('Status-Changed', true);
			});

			socket.on('get-number-of-player-in-tournament', (tournamentID: number) => {
				const room = io.sockets.adapter.rooms.get(`tournament-${tournamentID}`);
				const numberOfPlayer = room ? room.size : 0;
				socket.emit(`number-of-players-${tournamentID}`, numberOfPlayer);
			});

			socket.on('get-custom-games', (gameType: string) => {
				const gameRooms = [];
				let _status = undefined;

				const CustomRooms = Array.from(io.sockets.adapter.rooms.keys()).filter((value) => value.includes(`Custom-Game-${gameType}`));

				for (let i = 0; i < CustomRooms.length; i++) {
					const room = io.sockets.adapter.rooms.get(CustomRooms[i]);

					const status = started.includes(room);
					if (status) {
						_status = "Running"
					} else {
						_status = "Waiting..."
					}
					gameRooms.push({
						id: CustomRooms[i],
						state: _status,
					})
				}

				socket.emit('custome-rooms', gameRooms);
			});

			socket.on('join-game', ( gameId: string, gameType: string, isBotActive: boolean) => {
				const room = io.sockets.adapter.rooms.get(gameId);
				const numClients = room ? room.size : 0;

				let offset = isBotActive ? 1 : 0;
			
				const isBotPresent = containBot.includes(gameId);
				if (isBotPresent) {
					offset = 1;
				}

				let maxClients = 2 - offset;

				if (gameType === "OneForAll")
					maxClients = 4 - offset;
				else if (gameType === "Qubic")
					maxClients = 3 - offset;

				if (numClients < maxClients) {
					if (numClients === 0 && offset === 1) {
						containBot.push(gameId);
					}
					socket.join(gameId);
					socket.emit(`room-joined-${gameId}`, numClients);
					if (numClients === maxClients - 1) {
						const topic = `Players-${gameId}`;
						started.push(gameId);
						io.to(gameId).emit(`message-${gameId}-${topic}`, "FULL");
					}
				}

				const disconnectFunction = () => {
					const topic = `player-left-${gameId}`;
					io.to(gameId).emit(`message-${gameId}-${topic}`, "disconnect");
				}

				socket.on('disconnect', disconnectFunction);

				socket.on('leave', () => {
					const topic = `player-left-${gameId}`;
					socket.leave(gameId);
					io.to(gameId).emit(`message-${gameId}-${topic}`, "leave");
					socket.removeListener('disconnect', disconnectFunction);
				});
			});

			socket.on('create-game', (gameMode: string) => {
				logger.info('create-game', {gameMode: gameMode});
				var id = crypto.randomBytes(20).toString('hex').substring(0, 7);
				const customGame = `Custom-Game-${gameMode}-${id}`;
				console.log("custom game: ", customGame);
				socket.emit('match-found', customGame, -1, -1);
			});

			socket.on('send-message-to-game', (msg: string, topic: string, gameId: string) => {
				socket.to(gameId).emit(`message-${gameId}-${topic}`, msg);
			});
	  });
	}

	res.end();
};

export default SocketHandler;