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

// TODO: Add rematch request system for 4 and 3 players
// TODO: Maybe replacing the Rematch button with a continue button in tournaments / div modal
// TODO: Refactor code 
// TODO: Implement and test pause in games when tab is not in focus (or ESC)
// FIXME: Paddle movement based on player number (need to be inverted or adjusted to player rotation)
// TODO: Add paddle socket data transfer in OneForAll
// TODO: Add useKey hook (or fix it, so that its useable)
// TODO: Limit cam movment in Pong
// FIXME: Ball collision problem
// TODO: Add music
// TODO: ((Add more cam position on key press))
// TODO: Change 🔳 winning picture/image 
// FIXME: (Fix scene positioning)
// FIXME: (Fix documentation)
// FIXME: Try to find the next.js error that is causing ⚠ when compiling r3f code

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
					if (numClients === maxClients - 1) {
						const topic = `Players-${gameId}`;
						io.to(gameId).emit(`message-${gameId}-${topic}`, "FULL");
					}
				}

				socket.on('disconnect', () => {
					const topic = `player-disconnected-${gameId}`;
					io.to(gameId).emit(`message-${gameId}-${topic}`, gameId);
					socket.disconnect();
					io.to(gameId).disconnectSockets(true);
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