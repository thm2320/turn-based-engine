import express from "express";
import { createServer, Server as HttpServer } from "http";
import { SocketServer } from "./socket/SocketServer";

const app = express();
const httpServer: HttpServer = createServer(app);
const socketServer = new SocketServer(httpServer);
socketServer.init();

httpServer.listen(3000, () => {
  console.log('listening on port 3000')
});