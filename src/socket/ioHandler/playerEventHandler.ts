import { Server, Socket } from 'socket.io';
import { SocketManager } from '../SocketManager';
import { CustomPlayerEvent } from '../SocketEvent';

const updatePlayer =
  (socketManager: SocketManager, io: Server, socket: Socket) =>
  (evtMsg: any, callback: any) => {
    const player = socketManager.getPlayers().get(socket.id);
    player.setUserName(evtMsg.username);
    console.log(socketManager.getPlayers());
    if (callback) {
      callback(player);
    }
  };

export const playerEventHandler = (
  socketManager: SocketManager,
  io: Server,
  socket: Socket
) => {
  socket.on(
    CustomPlayerEvent.UpdatePlayer,
    updatePlayer(socketManager, io, socket)
  );
};
