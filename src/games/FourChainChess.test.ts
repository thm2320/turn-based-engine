import { beforeAll, describe, expect, test } from '@jest/globals';
import { FourChainChess } from './FourChainChess';
import { Player } from '../socket/Player';
import { Server } from 'socket.io';
import { io as clientIo } from 'socket.io-client';
import { createServer } from 'http';

describe('FourChainChess Class', () => {
  let playerA: Player;
  let playerB: Player;
  const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
  };

  beforeAll((done) => {
    const httpServer = createServer();
    let io = new Server(httpServer);
    httpServer.listen(() => {
      const address = httpServer.address();
      console.log(address);
      const port =
        typeof address === 'object' && address !== null ? address.port : '3000';

      let clientSocket = clientIo(`http://localhost:${port}`, ioOptions);
      io.on('connection', (socket) => {
        if (playerA === undefined) {
          playerA = new Player(socket);
        } else {
          playerB = new Player(socket);
        }
        console.log(playerA);
        console.log(playerB);
        if (playerA !== undefined && playerB !== undefined) {
          done();
        }
      });
      clientSocket.on('connect', () => {
        clientIo(`http://localhost:${port}`, ioOptions);
      });
    });
  });

  test('Check win for horizontal left only', () => {
    let game = new FourChainChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);

    expect(game.status).not.toBe('finished');
    game.move(playerA, 0);
    game.move(playerB, 0);
    game.move(playerA, 1);
    game.move(playerB, 1);
    game.move(playerA, 2);
    game.move(playerB, 2);
    game.move(playerA, 3);
    game.printBoard();
    expect(game.status).toBe('finished');
  });

  test('Check win for horizontal right only', () => {
    let game = new FourChainChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.status);

    expect(game.status).not.toBe('finished');
    game.move(playerA, 6);
    game.move(playerB, 6);
    game.move(playerA, 5);
    game.move(playerB, 5);
    game.move(playerA, 4);
    game.move(playerB, 4);
    game.move(playerA, 3);
    game.printBoard();
    expect(game.status).toBe('finished');
  });

  test('Check win for horizontal mixed', () => {
    let game = new FourChainChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.status);

    expect(game.status).not.toBe('finished');
    game.move(playerA, 2);
    game.move(playerB, 2);
    game.move(playerA, 5);
    game.move(playerB, 5);
    game.move(playerA, 4);
    game.move(playerB, 4);
    game.move(playerA, 3);
    game.printBoard();
    expect(game.status).toBe('finished');
  });

  /*
  ----O
  ---OX
  --OXO
  -OXOX-X
  */
  test('Check win for diagonal up in order', () => {
    let game = new FourChainChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.status);

    expect(game.status).not.toBe('finished');
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
    expect(game.status).toBe('finished');
  });

  test('Check win for diagonal up mixed order', () => {
    let game = new FourChainChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.status);

    expect(game.status).not.toBe('finished');
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
    expect(game.status).toBe('finished');
  });

  /*
  -O
  -XO
  -OXO
  -XOXO-X
  */
  test('Check win for diagonal down', () => {
    let game = new FourChainChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.status);

    expect(game.status).not.toBe('finished');
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
    expect(game.status).toBe('finished');
  });

  test('Check win for vertical', () => {
    let game = new FourChainChess();
    game.addPlayer(playerA);
    game.addPlayer(playerB);
    console.log(game.status);

    expect(game.status).not.toBe('finished');
    game.move(playerA, 0);
    game.move(playerB, 1);
    game.move(playerA, 0);
    game.move(playerB, 1);
    game.move(playerA, 0);
    game.move(playerB, 1);
    game.move(playerA, 0);
    game.printBoard();
    expect(game.status).toBe('finished');
  });
});
