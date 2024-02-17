import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "Socket.IO";
import crypto from 'crypto';
import { Game, contract_address } from "@/app/useContract";
import { ethers } from 'ethers';
import tournamentAbi from '@/public/tournamentManager_abi.json';
import { matchmaking, tournamentHandler } from "./matchmaking";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface SocketApiResponse extends NextApiResponse {
	socket: ServerResponse<IncomingMessage>['socket'] & {
	  server?: {
		io?: Server | undefined;
	  };
	};
}

// FIXME: (Fix documentation)

const provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
export const contract = new ethers.Contract(contract_address, tournamentAbi, provider);

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */
const SocketHandler = async (req: NextApiRequest, res: SocketApiResponse): Promise<void> => {
	// const eloScore = await contract.getPlayerRankedElo("address") as number;
	// const games = await contract.getTournamentTree(0) as Game[];

	const getElo = async (address: string) => {
		if (address) {
			const eloScore = (await contract.getPlayerRankedElo(address)) as number;
			return (eloScore);
		}
	}

	if (!res.socket.server?.io) {
		const io = new Server(res.socket.server as any);
		res.socket.server!.io = io;
		
		io.on('connection', (socket) => {

			socket.on('WalletAdress', (addressObj: { walletAddress: string } | undefined) => {
				if (addressObj) {
					const { walletAddress } = addressObj;
					socket.data = {
						walletAddress: walletAddress,
						elo: async () => {
							return await getElo(walletAddress);
						},
						isInGame: false
					}
				}
			});

			socket.on('tournament', async (tournamentID: number, gameType: string) => {
				const sockets = await io.in(`tournament-${tournamentID}`).fetchSockets();
				tournamentHandler(sockets, tournamentID, gameType);
			});

			socket.on('join-tournament', async (tournamentID: number) => {
				socket.join(`tournament-${tournamentID}`);
				socket.emit(`tournament-${tournamentID}-joined`, tournamentID);
			});

			socket.on('join-queue', async (gameType: string) => {
				socket.join(gameType);
				const sockets = await io.in(gameType).fetchSockets();
				matchmaking({sockets, gameType});
			});
			
			socket.on('Update-Status', (isInGame: boolean, gameId: string) => {
				// if (!isInGame)
				// 	socket.leave(gameId);
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

				socket.on('disconnect', () => {
					const topic = `player-disconnected-${gameId}`;
					io.to(gameId).emit(`message-${gameId}-${topic}`, gameId);
					socket.disconnect();
					io.in(gameId).disconnectSockets();
				});
			});

			// socket.on('create-game', (msg: string) => {
			// 	var id = crypto.randomBytes(20).toString('hex').substring(0, 7);
			// 	socket.emit(`game-created-${msg}`, id);
			// });

			socket.on('create-game', () => {
				var id = crypto.randomBytes(20).toString('hex').substring(0, 7);
				const customeGame = `Costume-Game-${id}`;
				socket.emit('match-found', customeGame, -1, -1);
			});

			socket.on('send-message-to-game', (msg: string, topic: string, gameId: string) => {
				socket.to(gameId).emit(`message-${gameId}-${topic}`, msg);
			});
	  });
	}

	res.end();
};

export default SocketHandler;