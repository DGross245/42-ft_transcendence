import { NextApiRequest, NextApiResponse } from "next";
import { Server } from 'Socket.IO';

// https://piehost.com/socketio-tester

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	console.log('SocketHandler');
	if ((res.socket as any).server.io) {
	  console.log('Socket is already running');
	} else {
	  console.log('Socket is initializing');
	  const io = new Server((res.socket as any).server);
	  (res.socket as any).server.io = io;
  
	  io.on('connection', (socket) => {
		socket.on('input-change', (msg: any) => {
		  socket.broadcast.emit('update-input', msg);
		});
	  });
	}

	res.end();
};

export default SocketHandler;
