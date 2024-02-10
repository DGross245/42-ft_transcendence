import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "Socket.IO";
import cache from "memory-cache";
import crypto from 'crypto';

import tournamentAbi from '@/public/tournamentManager_abi.json';
import { ethers } from 'ethers';

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

interface Player {
	address: string
	name: string
	color: string
}
interface PlayerScore {
	player: string
	score: number
}
interface Game {
	player_scores: PlayerScore[]
	finished: boolean
}
interface Tournament {
	master: string
	duration_in_blocks: number
	start_block: number
	end_block: number
	players: Player[]
	games: Game[]
}

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */
const SocketHandler = async (req: NextApiRequest, res: SocketApiResponse): Promise<void> => {
	const provider = new ethers.providers.JsonRpcProvider("https://ethereum-goerli.publicnode.com");
	const contract = new ethers.Contract(contract_address, tournamentAbi, provider);
	const eloScore = await contract.getPlayerRankedElo("address") as number;		// get the ranked elo of the player
	const games = await contract.getTournamentTree(0) as Game[];					// get the tournament tree by id

	if (!res.socket.server?.io) {
		const io = new Server(res.socket.server as any);
		res.socket.server!.io = io;
  
		io.on('connection', (socket) => {
			// socket.on('init', (walletId: string) => {
			// 	cache.put(walletId, socket);
			// })

			socket.on('join-game', ( gameId: string ) => {
				const room = io.sockets.adapter.rooms.get(gameId);
				const numClients = room ? room.size : 0;

				if (numClients < 2) {
					console.log("JOINING THE GAME AS", numClients + 1);
					socket.join(gameId);
					socket.emit(`room-joined-${gameId}`, (numClients + 1));
					if (numClients === 1) {
						const string = JSON.stringify(numClients + 1);
						const topic = `Players-${gameId}`;
						io.to(gameId).emit(`message-${gameId}-${topic}`, string);
					}
				}

				socket.on('disconnect', () => {
					const topic = `player-disconnected-${gameId}`;
					io.to(gameId).emit(`message-${gameId}-${topic}`, gameId);
					socket.disconnect();
					io.to(gameId).disconnectSockets(true);
					console.log("GAME CLOSED");
				});
			});

			socket.on('create-game', (msg: string) => {
				var id = crypto.randomBytes(20).toString('hex').substring(0, 7);
				socket.emit(`game-created-${msg}`, id);
			});

			socket.on('send-message-to-game', (msg: string, topic: string, gameId: string) => {
				socket.to(gameId).emit(`message-${gameId}-${topic}`, msg);
				// cache.get(gameId);
				// cache.del(gameId);
			});
	  });
	}
	// res.send({status: 'OK'});
	res.end();
};

export default SocketHandler;