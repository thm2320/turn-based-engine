import { Server, Socket } from 'socket.io';
import { Room } from './Room';
import { FourChainChess } from '../games/FourChainChess';
import { Player } from './Player';
import { SocketEvents } from './SocketEvents';

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
      // const room = this.getAvailableRoom();
      // room.addPlayer(newPlayer);
      // room.sendMessage(`${socket.id} joined`);
      console.log(this.io.of('/').adapter.rooms);

      socket.on(SocketEvents.ListRooms, (evtMsg, callback) => {
        const roomMap = this.getRooms();
        if (callback){
          callback({
            rooms: Array.from(roomMap.keys()),
          });
        }
      });

      socket.on(SocketEvents.OpenRoom, (evtMsg, callback) => {
        const { roomName } = evtMsg;
        this.openRoom(socket, roomName);
        console.log('After Open', this.io.of('/').adapter.rooms)
        if (callback) {
          callback({
            roomName,
          });
        }
      });

      socket.on(SocketEvents.JoinRoom, (evtMsg, callback) => {
        const { roomName } = evtMsg;
        this.joinRoom(socket, roomName);
        console.log('After Join', this.io.of('/').adapter.rooms)
        if (callback) {
          callback({
            roomName,
          });
        }
      });

      socket.on(SocketEvents.LeaveRoom, (evtMsg, callback) => {
        const { roomName } = evtMsg;
        this.leaveRoom(socket, roomName);
        console.log('After Leave',this.io.of('/').adapter.rooms)
        callback({
          roomName,
        });
      });
    });
  }

  getPlayers = () => {
    return this.players;
  };

  getRooms = () => {
    // console.log(this.io.of('/').adapter.rooms);
    return this.rooms;
  };

  openRoom = (socket: Socket, roomName: string) => {
    let room = this.rooms.get(roomName);
    if (!room) {
      room = new Room(this.io, roomName, 2, new FourChainChess());
      this.rooms.set(roomName, room);
    }
    const player = this.players.get(socket.id);
    if (player) {
      player.socket.join(roomName);
      room.addPlayer(player);
    }
    // console.log(this.io.of('/').adapter.rooms);
    return room;
  };

  joinRoom = (socket: Socket, roomName: string) => {
    const room = this.rooms.get(roomName);
    const player = this.players.get(socket.id);
    if (player && room) {
      player.socket.join(roomName);
      room.addPlayer(player);
    }
    // console.log(this.io.of('/').adapter.rooms);
    return room;
  };

  leaveRoom = (socket: Socket, roomName: string) => {
    const room = this.rooms.get(roomName);
    const player = this.players.get(socket.id);
    if (player && room) {
      player.socket.leave(roomName);
      room.removePlayer(player);
      if (room.players.length === 0){
        this.rooms.delete(roomName);
      }
    }
    // console.log(this.io.of('/').adapter.rooms);    
    return room;
  }
}
