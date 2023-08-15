import { Socket } from 'socket.io';

export class Player {
  socket: Socket;
  username: string;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  setUserName(username: string) {
    this.username = username;
  }
}
