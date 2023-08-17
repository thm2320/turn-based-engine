import { Socket } from 'socket.io';
import { SocketManager } from '../SocketManager';
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
    socketManager.openRoom(socket, roomName);
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
    socketManager.leaveRoom(socket, roomName);
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
