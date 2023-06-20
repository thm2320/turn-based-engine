import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Room } from './Room';
import { FourChainChess } from '../games/FourChainChess';
import { Player } from './Player';

export class SocketServer {
  private io: Server;
  private rooms: Room[] = [];

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer);
  }

  init(): void {
    this.io.on('connection', (socket) => {
      const newPlayer = new Player(socket);

      console.log(`${socket.id} connected`);
      socket.emit('hi', `hi ${socket.id}`);
      const room = this.getAvailableRoom();
      room.addPlayer(newPlayer);
      socket.join(room.name); 
      this.io.in(room.name).emit('hi', `${socket.id} joined`);
    });
  }

  getAvailableRoom = () => {
    for (const room of this.rooms) {
      if (!room.isFull()) {
        return room;
      }
    }
    const newRoom = new Room(
      `FourChainChessRoom-${this.rooms.length}`,
      2,
      new FourChainChess()
    );
    this.rooms.push(newRoom);
    return newRoom;
  };
}
