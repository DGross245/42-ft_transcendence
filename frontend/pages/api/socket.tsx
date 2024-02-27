import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "Socket.IO";
import crypto from 'crypto';
import { ethers } from 'ethers';
import tournamentAbi from '@/public/tournamentManager_abi.json';
import { matchmaking, tournamentHandler } from "./matchmaking";

const contract_address = '0xBC0657E28Ccac38597f6c417CA2996378935Db28'

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

	const getElo = async (address: string) => {
		if (address) {
			const eloScore = Number(await contract.getPlayerRankedElo(address));
			return (eloScore);
		}
	}

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
				tournamentHandler(sockets, tournamentID, gameType);
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

			socket.on('join-game', ( gameId: string, gameType: string, offset: number ) => {
				const room = io.sockets.adapter.rooms.get(gameId);
				const numClients = room ? room.size : 0;
				let maxClients = 2 - offset;

				if (gameType === "OneForAll")
					maxClients = 4 - offset;
				else if (gameType === "Qubic")
					maxClients = 3 - offset;

				if (numClients < maxClients) {
						socket.join(gameId);
						socket.emit(`room-joined-${gameId}`, numClients);
					if (numClients === maxClients - 1) {
						const topic = `Players-${gameId}`;
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

			// socket.on('create-game', (msg: string) => {
			// 	var id = crypto.randomBytes(20).toString('hex').substring(0, 7);
			// 	socket.emit(`game-created-${msg}`, id);
			// });

			socket.on('create-game', () => {
				var id = crypto.randomBytes(20).toString('hex').substring(0, 7);
				const customGame = `Custom-Game-${id}`;
				console.log(customGame)
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