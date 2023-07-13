import { TurnBasedGame } from '../games/TurnBasedGame';
import { Server } from 'socket.io';
import { Player } from './Player';
import { CustomGameEvent } from './SocketEvent';

export class Room {
  io: Server;
  name: string;
  players: Player[];
  limit: number;
  game: TurnBasedGame;
  status: 'waiting' | 'playing' | 'finished' = 'waiting';

  constructor(io: Server, name: string, limit: number, game: TurnBasedGame) {
    this.io = io;
    this.name = name;
    this.limit = limit;
    this.players = [];
    this.game = game;
    this.status = 'waiting';
  }

  cleanUp = (): void => {
    this.game.cleanUp();
    this.players = [];
  };

  addPlayer = (player: Player): void => {
    if (this.isFull()) {
      throw new Error('Room is full');
    }
    if (this.status !== 'waiting') {
      throw new Error('Game is started');
    }
    this.players.push(player);
    this.game.addPlayer(player);
    if (this.game.canStart()) {
      this.setUpListeners();
      this.status = 'playing';
    }
    return;
  };

  removePlayer = (player: Player): void => {
    const removeIndex = this.players.indexOf(player);
    if (removeIndex > -1) {
      this.players.splice(this.players.indexOf(player), 1);
    }
  };

  isFull = () => {
    return this.players.length >= this.limit;
  };

  sendMessage = (msg: string) => {
    console.log(`room sends msg ${msg}`);
    this.io.in(this.name).emit('message', msg);
  };

  setUpListeners = () => {
    this.players.forEach((player) => {
      player.socket.on(CustomGameEvent.Move, (steps) => {
        if (this.status === 'playing') {
          try {
            console.log(`${player.socket.id} move step ${steps}`);
            this.game.move(player, steps);
            if (this.game.getIsCompleted()) {
              console.log(`${player.socket.id} won!`);
              this.status = 'finished';
            }
            this.io.in(this.name).emit('update_move', {
              player: player.socket.id,
              step: steps,
              isFinished: this.status === 'finished',
            });
          } catch (e: any) {
            console.log(e);
          }
        }
      });
    });
  };
}
