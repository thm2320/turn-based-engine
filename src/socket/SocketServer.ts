import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Room } from './Room';
import { FourChainChess } from '../games/FourChainChess';
import { Player } from './Player';

export class SocketServer {
  private io: Server;
  private rooms: Map<string, Room> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer,{
      cors: {
        origin: "http://localhost:3001",
        credentials: true
      }
    });
  }

  init(): void {
    this.io.on('connection', (socket) => {
      console.log(`${socket.id} connected`);
      
      const newPlayer = new Player(socket);
      const room = this.getAvailableRoom();
      room.addPlayer(newPlayer);
      room.sendMessage(`${socket.id} joined`);
      console.log(this.io.of('/').adapter.rooms)

      socket.on('disconnecting', () => {
        console.log(`${socket.id} disconnecting ======`)
        const socketRoom = this.io.of('/').adapter.rooms.get(room.name);
        console.log(`socketRoom ${socketRoom}`)
        console.log(`Rooms size: ${this.rooms.size}`)
      })
      socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected ======`)

        const socketRoom = this.io.of('/').adapter.rooms.get(room.name);
        if (!socketRoom) {
          console.log('socketRoom not found')
          room.cleanUp();
          this.rooms.delete(room.name)
        }
        console.log(`Rooms size: ${this.rooms.size}`)
        console.log(socket.rooms)
      })
    });
  }

  getAvailableRoom = () => {
    for (const [, room] of this.rooms) {
      if (!room.isFull()) {
        return room;
      }
    }
    const roomName = `FourChainChessRoom-${new Date().valueOf()}`;
    const newRoom = new Room(
      this.io,
      roomName,
      2,
      new FourChainChess()
    );
    this.rooms.set(roomName, newRoom)
    return newRoom;
  };
}
