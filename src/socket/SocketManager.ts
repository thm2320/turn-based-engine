import { Server, Socket } from 'socket.io';
import { Room } from './Classes/Room';
import { Player } from './Classes/Player';
import { SocketEvent } from './SocketEvent';
import registerBasicEventHandlers from './SocketHandler/basicEventHandler';
import registerPlayerEventHandlers from './SocketHandler/playerEventHandler';
import registerRoomEventHandlers from './SocketHandler/roomEventHandler';
import { ConnectFourChess } from '@src/games/ConnectFourChess';

export class SocketManager {
  private io: Server;
  private rooms: Map<string, Room> = new Map();
  private players: Map<string, Player> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  getIoServer(): Server {
    return this.io;
  }

  registerEventHandlers(): void {
    this.io.on(SocketEvent.Connection, (socket) => {
      console.log(`${socket.id} connected`);

      this.addPlayer(socket);

      console.log(this.io.of('/').adapter.rooms);

      registerBasicEventHandlers(this, socket);
      registerPlayerEventHandlers(this, socket);
      registerRoomEventHandlers(this, socket);
    });
  }

  getPlayers = () => {
    return this.players;
  };

  addPlayer = (socket: Socket) => {
    const newPlayer = new Player(socket);
    this.players.set(socket.id, newPlayer);
  };

  updatePlayer = (socket: Socket, { username }: { username: string }) => {
    const player = this.getPlayers().get(socket.id);
    player?.setUserName(username);
    return player;
  };

  removePlayer = (socket: Socket) => {
    this.players.delete(socket.id);
  };

  getRooms = () => {
    return this.rooms;
  };

  openRoom = (socket: Socket, roomName: string) => {
    let room = this.getRooms().get(roomName);
    if (!room) {
      room = new Room(this.getIoServer(), roomName, 2, new ConnectFourChess());
      this.getRooms().set(roomName, room);
    }
    const player = this.getPlayers().get(socket.id);
    if (player) {
      player.socket.join(roomName);
      room.addPlayer(player);
    }
    console.log('After OpenRoom', this.io.of('/').adapter.rooms);
  };

  joinRoom = (socket: Socket, roomName: string) => {
    const room = this.getRooms().get(roomName);
    const player = this.getPlayers().get(socket.id);
    if (player && room) {
      room.addPlayer(player);
    }
    console.log('After JoinRoom', this.io.of('/').adapter.rooms);
  };

  leaveRoom = (socket: Socket, roomName: string) => {
    const room = this.rooms.get(roomName);
    const player = this.players.get(socket.id);
    if (player && room) {
      room.removePlayer(player);
      if (room.players.length === 0) {
        this.rooms.delete(roomName);
      }
    }
    console.log('After LeaveRoom', this.io.of('/').adapter.rooms);
    return room;
  };
}
