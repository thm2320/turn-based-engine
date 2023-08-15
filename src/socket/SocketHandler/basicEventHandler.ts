import { Socket } from 'socket.io';
import { SocketManager } from '../SocketManager';
import { SocketEvent } from '../SocketEvent';

const playerDisconnecting =
  (socketManager: SocketManager, socket: Socket) => () => {
    socket.rooms.forEach((roomName) => {
      if (socket.id !== roomName) {
        socketManager.leaveRoom(socket, roomName);
      }
    });
    socketManager.removePlayer(socket);
  };

const registerBasicEventHandlers = (
  socketManager: SocketManager,
  socket: Socket
) => {
  socket.on(
    SocketEvent.Disconnecting,
    playerDisconnecting(socketManager, socket)
  );
};

export default registerBasicEventHandlers;
