import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Room } from './Room';

export class SocketServer {
  private io: Server;
  private rooms: Room[] = [];

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer);
  }

  init(): void {
    this.io.on('connection', (socket) => {
      console.log(`${socket.id} connected`);
      socket.emit('hi', `hi ${socket.id}`);
      const room = this.getAvailableRoom()
      room.addPlayer(socket.id)
      socket.join(room.name); // TODO: Player class to store player info and socket

      socket.on('play', (steps) => {
        console.log(`${socket.id} run ${steps}`);
      });
      this.io.in(room.name).emit('hi', `${socket.id} joined`);
    });
  }

  getAvailableRoom = () => {
    if (this.rooms.length === 0) {
      const newRoom = new Room(`FourChainRoom-${this.rooms.length}`, 2);
      return newRoom;
    }
    for (const room of this.rooms){
      if (!room.isFull()){
        return room;
      }
    }
    const newRoom = new Room(`FourChainRoom-${this.rooms.length}`, 2);
    return newRoom;
  }
}
