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
			socket.on('create-game', (msg: string) => {
				var id = crypto.randomBytes(20).toString('hex').substring(0, 7);
				socket.emit(`game-created-${msg}`, id);
			});

			socket.on('send-message-to-game', (msg: string, gameId: string) => {
				socket.emit(`message-${gameId}`, msg);
			});
	  });
	}
	// res.send({status: 'OK'});
	res.end();
};

export default SocketHandler;

// @todo make message redirects work