import { Server as HttpServer } from 'http';
import { Server as SocketServer} from 'socket.io';

const socketServer = (httpServer: HttpServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: 'http://localhost:3001',
      credentials: true,
    },
  });
  return io;
};

export default socketServer;