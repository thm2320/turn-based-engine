import { beforeEach, afterEach, describe, expect, test } from '@jest/globals';
import { Server as SocketServer } from 'socket.io';
import { io as clientIo, Socket as ClientSocket } from 'socket.io-client';
import { createServer, Server } from 'http';
import { SocketManager } from '../../socket/SocketManager';
import socketServer from '../../socket/socketServer';
import { SocketEvents } from '../SocketEvents';

describe('SockerManager', () => {
  let httpServer: Server;
  let io: SocketServer;
  let socketManager: SocketManager;
  let clientSocket1: ClientSocket;
  let clientSocket2: ClientSocket;
  const testRoomName = 'Test-Room';
  const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
  };

  const operateRoom = (clientSocket: ClientSocket, event: SocketEvents, evtMsg: any) => {
    return new Promise((resolve, reject) => {
      clientSocket.emit(
        event,
        evtMsg,
        (response: any) => {
          resolve(response);
        }
      );
    });
  }

  const listRoom = (clientSocket: ClientSocket) => {
    return operateRoom(clientSocket, SocketEvents.ListRooms, {
      roomName: testRoomName,
    });
  };

  const openRoom = (clientSocket: ClientSocket) => {
    return operateRoom(clientSocket, SocketEvents.OpenRoom, {
      roomName: testRoomName,
    });
  };

  const joinRoom = (clientSocket: ClientSocket) => {
    return operateRoom(clientSocket, SocketEvents.JoinRoom, {
      roomName: testRoomName,
    });
  };

  const leaveRoom = (clientSocket: ClientSocket) => {
    return operateRoom(clientSocket, SocketEvents.LeaveRoom, {
      roomName: testRoomName,
    });
  }

  beforeEach((done) => {
    httpServer = createServer();
    io = socketServer(httpServer);
    socketManager = new SocketManager(io);
    socketManager.init();
    httpServer.listen(() => {
      const address = httpServer.address();
      console.log(address);
      const port =
        typeof address === 'object' && address !== null ? address.port : '3000';

      clientSocket1 = clientIo(`http://localhost:${port}`, ioOptions);
      clientSocket2 = clientIo(`http://localhost:${port}`, ioOptions);
      clientSocket2.on('connect', () => {
        done();
      });
    });
  });

  afterEach((done) => {
    io.close()
    httpServer.close(()=>{
      done()
    })
  });

  test('List 0 rooms', async() => {
    const response: any = await listRoom(clientSocket1);
    const { rooms } = response;
    expect(rooms.length).toBe(0);
  });

  test('Player1 open room "Test-Room"', async () => {
    await openRoom(clientSocket1)
    const roomMap = socketManager.getRooms();
    expect(roomMap.size).toBe(1);
    const roomName = roomMap.keys().next().value;
    expect(roomName).toBe(testRoomName);
  });

  test('Player2 Join Room "Test-Room"', async () => {
    await openRoom(clientSocket1);
    await joinRoom(clientSocket2);
    const roomMap = socketManager.getRooms();
    expect(roomMap.size).toBe(1);
    const roomName = roomMap.keys().next().value;
    expect(roomName).toBe(testRoomName);
    const socketRoom = io.of('/').adapter.rooms.get(testRoomName);
    expect(socketRoom?.size).toBe(2);
  });

  test('List room after room is opened by player 1', async () => {
    await openRoom(clientSocket1);
    const response: any = await listRoom(clientSocket1);

    const { rooms } = response;
    expect(rooms.length).toBe(1);
    expect(rooms[0]).toBe(testRoomName);
  });

  test('List room after both players in the same room', async () => {
    await openRoom(clientSocket1);
    await joinRoom(clientSocket2);
    const response: any = await listRoom(clientSocket1);
    const { rooms } = response;
    expect(rooms.length).toBe(1);
    expect(rooms[0]).toBe(testRoomName);
  });

  test('Both Players leave Room "Test-Room" 1 by 1', async () => {
    await openRoom(clientSocket1);
    await joinRoom(clientSocket2);
    await leaveRoom(clientSocket1);
    const ioRoomMap = io.of('/').adapter.rooms;
    const roomSockets = ioRoomMap.get(testRoomName);
    expect(roomSockets?.size).toBe(1);
    const roomMap = socketManager.getRooms();
    expect(roomMap.size).toBe(1);

    await leaveRoom(clientSocket2);
    expect(roomSockets?.size).toBe(0);
    expect(roomMap.size).toBe(0);
    
  });

});
