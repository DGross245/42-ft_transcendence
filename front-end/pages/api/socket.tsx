import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "Socket.IO";
import cache from "memory-cache";
import crypto from 'crypto';

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

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */
const SocketHandler = async (req: NextApiRequest, res: SocketApiResponse): Promise<void> => {
	if (!res.socket.server?.io) {
		const io = new Server(res.socket.server as any);
		res.socket.server!.io = io;
  
		io.on('connection', (socket) => {
			// socket.on('init', (walletId: string) => {
			// 	cache.put(walletId, socket);
			// })

			socket.on('join-game', ( gameId: string, gameType: string ) => {
				const room = io.sockets.adapter.rooms.get(gameId);
				const numClients = room ? room.size : 0;
				let maxClients = 2;

				if (gameType === "OneForAll")
					maxClients = 4;
				else if (gameType === "Qubic")
					maxClients = 3;

				if (numClients < maxClients) {
					socket.join(gameId);
					socket.emit(`room-joined-${gameId}`, (numClients));
					console.log(numClients);
					if (numClients === maxClients - 1) {
						console.log("SEND")
						const string = JSON.stringify(numClients);
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