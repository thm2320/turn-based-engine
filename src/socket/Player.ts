import { Socket } from "socket.io";

export class Player {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }
}