import { beforeAll, afterAll, describe, expect, test } from '@jest/globals';
import { ConnectFourChess } from './ConnectFourChess';
import { Player } from '../socket/Classes/Player';
import { Server } from 'socket.io';
import { io as clientIo } from 'socket.io-client';
import { createServer, Server as HttpServer } from 'http';

describe('ConnectFourChess Class', () => {
  let playerA: Player;
  let playerB: Player;
  let io: Server;
  let httpServer: HttpServer;
  const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
  };

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const address = httpServer.address();
      console.log(address);
      const port =
        typeof address === 'object' && address !== null ? address.port : '3000';

      clientIo(`http://localhost:${port}`, ioOptions);
      let clientSocket = clientIo(`http://localhost:${port}`, ioOptions);
      io.on('connection', (socket) => {
        if (playerA === undefined) {
          playerA = new Player(socket);
        } else {
          playerB = new Player(socket);
        }
      });
      clientSocket.on('connect', () => {
        if (playerA !== undefined && playerB !== undefined) {
          done();
        }
      });
    });
  });

  afterAll((done) => {
    io.close();
    httpServer.close(() => {
      done();
    });
  });

  test('Check win for horizontal left only', () => {
    let game = new ConnectFourChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);

    expect(game.isCompleted).not.toBe(true);
    game.move(playerA, 0);
    game.move(playerB, 0);
    game.move(playerA, 1);
    game.move(playerB, 1);
    game.move(playerA, 2);
    game.move(playerB, 2);
    game.move(playerA, 3);
    game.printBoard();
    expect(game.isCompleted).toBe(true);
  });

  test('Check win for horizontal right only', () => {
    let game = new ConnectFourChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.isCompleted);

    expect(game.isCompleted).not.toBe(true);
    game.move(playerA, 6);
    game.move(playerB, 6);
    game.move(playerA, 5);
    game.move(playerB, 5);
    game.move(playerA, 4);
    game.move(playerB, 4);
    game.move(playerA, 3);
    game.printBoard();
    expect(game.isCompleted).toBe(true);
  });

  test('Check win for horizontal mixed', () => {
    let game = new ConnectFourChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.isCompleted);

    expect(game.isCompleted).not.toBe(true);
    game.move(playerA, 2);
    game.move(playerB, 2);
    game.move(playerA, 5);
    game.move(playerB, 5);
    game.move(playerA, 4);
    game.move(playerB, 4);
    game.move(playerA, 3);
    game.printBoard();
    expect(game.isCompleted).toBe(true);
  });

  /*
  ----O
  ---OX
  --OXO
  -OXOX-X
  */
  test('Check win for diagonal up in order', () => {
    let game = new ConnectFourChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.isCompleted);

    expect(game.isCompleted).not.toBe(true);
    game.move(playerA, 1);
    game.move(playerB, 2);
    game.move(playerA, 2);
    game.move(playerB, 6);
    game.move(playerA, 3);
    game.move(playerB, 3);
    game.move(playerA, 3);
    game.move(playerB, 4);
    game.move(playerA, 4);
    game.move(playerB, 4);
    game.move(playerA, 4);
    game.printBoard();
    expect(game.isCompleted).toBe(true);
  });

  test('Check win for diagonal up mixed order', () => {
    let game = new ConnectFourChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.isCompleted);

    expect(game.isCompleted).not.toBe(true);
    game.move(playerA, 1);
    game.move(playerB, 4);
    game.move(playerA, 4);
    game.move(playerB, 4);
    game.move(playerA, 4);
    game.move(playerB, 6);
    game.move(playerA, 3);
    game.move(playerB, 3);
    game.move(playerA, 3);
    game.move(playerB, 2);
    game.move(playerA, 2);
    game.printBoard();
    expect(game.isCompleted).toBe(true);
  });

  /*
  -O
  -XO
  -OXO
  -XOXO-X
  */
  test('Check win for diagonal down', () => {
    let game = new ConnectFourChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.isCompleted);

    expect(game.isCompleted).not.toBe(true);
    game.move(playerA, 2);
    game.move(playerB, 1);
    game.move(playerA, 4);
    game.move(playerB, 3);
    game.move(playerA, 1);
    game.move(playerB, 2);
    game.move(playerA, 3);
    game.move(playerB, 1);
    game.move(playerA, 2);
    game.move(playerB, 6);
    game.move(playerA, 1);
    game.printBoard();
    expect(game.isCompleted).toBe(true);
  });

  test('Check win for vertical', () => {
    let game = new ConnectFourChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.isCompleted);

    expect(game.isCompleted).not.toBe(true);
    game.move(playerA, 0);
    game.move(playerB, 1);
    game.move(playerA, 0);
    game.move(playerB, 1);
    game.move(playerA, 0);
    game.move(playerB, 1);
    game.move(playerA, 0);
    game.printBoard();
    expect(game.isCompleted).toBe(true);
  });
});
