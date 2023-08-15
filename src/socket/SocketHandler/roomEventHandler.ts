import { Server, Socket } from 'socket.io';
import { SocketManager } from '../SocketManager';
import { ConnectFourChess } from '../../games/ConnectFourChess';
import { Room } from '../Classes/Room';
import { CustomRoomEvent } from '../SocketEvent';

const listRoom =
  (socketManager: SocketManager, socket: Socket) =>
  (evtMsg: any, callback: any) => {
    const roomMap = socketManager.getRooms();
    if (callback) {
      callback({
        rooms: Array.from(roomMap.keys()),
      });
    }
  };

const openRoom =
  (socketManager: SocketManager, socket: Socket) =>
  (evtMsg: any, callback: any) => {
    const { roomName } = evtMsg;
    let room = socketManager.getRooms().get(roomName);
    if (!room) {
      room = new Room(roomName, 2, new ConnectFourChess());
      socketManager.getRooms().set(roomName, room);
    }
    const player = socketManager.getPlayers().get(socket.id);
    if (player) {
      player.socket.join(roomName);
      room.addPlayer(player);
    }

    // console.log('After Open', io.of('/').adapter.rooms);
    if (callback) {
      callback({
        roomName,
      });
    }
  };

const joinRoom =
  (socketManager: SocketManager, socket: Socket) =>
  (evtMsg: any, callback: any) => {
    const { roomName } = evtMsg;
    socketManager.joinRoom(socket, roomName);

    // console.log('After Join', io.of('/').adapter.rooms);
    if (callback) {
      callback({
        roomName,
      });
    }
  };

const leaveRoom =
  (socketManager: SocketManager, socket: Socket) =>
  (evtMsg: any, callback: any) => {
    const { roomName } = evtMsg;
    const room = socketManager.getRooms().get(roomName);
    const player = socketManager.getPlayers().get(socket.id);
    if (player && room) {
      player.socket.leave(roomName);
      room.removePlayer(player);
      if (room.players.length === 0) {
        socketManager.getRooms().delete(roomName);
      }
    }
    // console.log('After Leave', io.of('/').adapter.rooms);
    callback({
      roomName,
    });
  };

const registerRoomEventHandlers = (
  socketManager: SocketManager,
  socket: Socket
) => {
  socket.on(CustomRoomEvent.ListRooms, listRoom(socketManager, socket));
  socket.on(CustomRoomEvent.OpenRoom, openRoom(socketManager, socket));
  socket.on(CustomRoomEvent.JoinRoom, joinRoom(socketManager, socket));
  socket.on(CustomRoomEvent.LeaveRoom, leaveRoom(socketManager, socket));
};

export default registerRoomEventHandlers;
