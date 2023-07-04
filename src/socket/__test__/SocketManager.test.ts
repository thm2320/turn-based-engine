import { beforeAll, afterAll, describe, expect, test } from '@jest/globals';
import { Player } from '../../socket/Player';
import { Server as SocketServer } from 'socket.io';
import { io as clientIo, Socket as ClientSocket } from 'socket.io-client';
import { createServer } from 'http';
import { SocketManager } from '../../socket/SocketManager';
import socketServer from '../../socket/socketServer';
import { SocketEvents } from '../SocketEvents';

describe('SockerManager', () => {
  let io: SocketServer;
  let socketManager: SocketManager;
  let player1: Player;
  let player2: Player;
  let clientSocket1: ClientSocket;
  let clientSocket2: ClientSocket;
  const testRoomName = 'Test-Room';
  const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
  };

  beforeAll((done) => {
    const httpServer = createServer();
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
        const playerMap = socketManager.getPlayers();
        const mapIterator = playerMap.values();
        player1 = mapIterator.next().value;
        player2 = mapIterator.next().value;
        done();
      });
    });
  });

  afterAll((done) => {
    setTimeout(done, 500);
  });

  test('List 0 rooms', (done) => {
    clientSocket1.emit(SocketEvents.ListRooms, {}, (response: any) => {
      const { rooms } = response;
      expect(rooms.length).toBe(0);
      done();
    });
  });

  test('Player1 open room "Test-Room"', (done) => {
    clientSocket1.emit(
      SocketEvents.OpenRoom,
      { roomName: testRoomName },
      (response: any) => {
        // socketManager.openRoom(player1.socket.id, testRoomName);
        const roomMap = socketManager.getRooms();
        expect(roomMap.size).toBe(1);
        const roomName = roomMap.keys().next().value;
        expect(roomName).toBe(testRoomName);

        const ioRoomMap = io.of('/').adapter.rooms;
        done();
      }
    );
  });

  test('Player2 Join Room "Test-Room"', (done) => {
    clientSocket2.emit(
      SocketEvents.JoinRoom,
      { roomName: testRoomName },
      (response: any) => {
        // console.log(response);
        // socketManager.joinRoom(player2.socket.id, testRoomName);
        const roomMap = socketManager.getRooms();
        expect(roomMap.size).toBe(1);
        const roomName = roomMap.keys().next().value;
        expect(roomName).toBe(testRoomName);
        const socketRoom = io.of('/').adapter.rooms.get(testRoomName);
        // console.log(socketRoom);
        expect(socketRoom?.size).toBe(2);
        done();
      }
    );
  });

  test('List 1 room', (done) => {
    clientSocket1.emit(SocketEvents.ListRooms, {}, (response: any) => {
      const { rooms } = response;
      expect(rooms.length).toBe(1);
      expect(rooms[0]).toBe(testRoomName);
      done();
    });
  });

  test('Player1 leaves Room "Test-Room"', (done) => {
    clientSocket1.emit(
      SocketEvents.LeaveRoom,
      { roomName: testRoomName },
      (response: any) => {
        const ioRoomMap = io.of('/').adapter.rooms;
        const roomSockets = ioRoomMap.get(testRoomName);
        expect(roomSockets?.size).toBe(1);

        const roomMap = socketManager.getRooms();
        expect(roomMap.size).toBe(1);
        done();
      }
    );
  });

  test('Player2 leaves Room "Test-Room" 2', (done) => {
    clientSocket2.emit(
      SocketEvents.LeaveRoom,
      { roomName: testRoomName },
      (response: any) => {
        const ioRoomMap = io.of('/').adapter.rooms;
        const roomSockets = ioRoomMap.get(testRoomName);
        expect(roomSockets).toBe(undefined);

        const roomMap = socketManager.getRooms();
        expect(roomMap.size).toBe(0);
        done();
      }
    );
  });
});
