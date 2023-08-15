import { Socket } from 'socket.io';
import { SocketManager } from '../SocketManager';
import { CustomPlayerEvent } from '../SocketEvent';

const updatePlayer =
  (socketManager: SocketManager, socket: Socket) =>
  (evtMsg: any, callback: any) => {
    const player = socketManager.updatePlayer(socket, {
      username: evtMsg.username,
    });
    if (callback) {
      callback(player);
    }
  };

const registerPlayerEventHandlers = (
  socketManager: SocketManager,
  socket: Socket
) => {
  socket.on(
    CustomPlayerEvent.UpdatePlayer,
    updatePlayer(socketManager, socket)
  );
};

export default registerPlayerEventHandlers;
