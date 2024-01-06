import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import cache from "memory-cache";

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	if (!(res.socket as any).server.io) {
	  const io = new Server((res.socket as any).server);
	  (res.socket as any).server.io = io;
  
	  io.on('connection', (socket) => {
		socket.on('input-change', (msg: any) => {
			cache.put('input', msg);
			socket.broadcast.emit('update-input', msg);
		});

		socket.on('read-input', () => {
			console.log('read-input');
			socket.emit('update-input', cache.get('input'));
		});
	  });
	}
	res.send({status: 'OK'});
	res.end();
};

export default SocketHandler;
