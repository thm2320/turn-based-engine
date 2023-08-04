import express, { Request, Response } from 'express';
import { createServer, Server as HttpServer } from 'http';
// import { roomRouter } from "./routes/rooms";
import { json } from 'body-parser';
import { SocketManager } from './socket/SocketManager';
import socketServer from './socket/socketServer';

const app = express();
app.use(json());
// app.use(roomRouter);

app.get('/', (_req: Request, res: Response) => {
  return res.send('Express Typescript on Vercel');
});

const httpServer: HttpServer = createServer(app);
const io = socketServer(httpServer);
export const socketManager = new SocketManager(io);
socketManager.init();

httpServer.listen(3000, () => {
  console.log('listening on port 3000');
});
