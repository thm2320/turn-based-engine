import { Server, Socket } from 'socket.io';
import { Room } from './Room';
import { Player } from './Player';
import {
  SocketEvents,
  CustomRoomEvent,
  CustomPlayerEvent,
} from './SocketEvent';
import { roomEventHandler } from './ioHandler/roomEventHandler';
import { playerEventHandler } from './ioHandler/playerEventHandler';

export class SocketManager {
  private io: Server;
  private rooms: Map<string, Room> = new Map();
  private players: Map<string, Player> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  init(): void {
    this.io.on(SocketEvents.Connection, (socket) => {
      console.log(`${socket.id} connected`);

      const newPlayer = new Player(socket);
      this.players.set(socket.id, newPlayer);
      console.log(this.io.of('/').adapter.rooms);

      socket.on(SocketEvents.Disconnecting, () => {
        socket.rooms.forEach((roomName) => {
          if (socket.id !== roomName) {
            this.leaveRoom(socket, roomName);
          }
        });
        this.players.delete(socket.id);
      });

      playerEventHandler(this, this.io, socket);
      roomEventHandler(this, this.io, socket);
    });
  }

  getPlayers = () => {
    return this.players;
  };

  getRooms = () => {
    return this.rooms;
  };

  leaveRoom = (socket: Socket, roomName: string) => {
    const room = this.rooms.get(roomName);
    const player = this.players.get(socket.id);
    if (player && room) {
      player.socket.leave(roomName);
      room.removePlayer(player);
      if (room.players.length === 0) {
        this.rooms.delete(roomName);
      }
    }
    return room;
  };
}
