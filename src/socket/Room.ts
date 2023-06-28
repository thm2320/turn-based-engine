import { TurnBasedGame } from "../games/TurnBasedGame";
import { Server } from 'socket.io';
import { Player } from "./Player";

export class Room {
  io: Server;
  name: string;
  players: Player[];
  limit: number;
  game: TurnBasedGame;

  constructor(io: Server, name: string, limit: number, game: TurnBasedGame) {
    this.io = io;
    this.name = name;
    this.limit = limit;
    this.players = [];
    this.game = game;
  }

  cleanUp = () : void => {
    this.game.cleanUp();
    this.players = [];
  }

  addPlayer = (player: Player): void => {
    if (this.isFull()) {
      throw new Error('Room is full');
    }
    player.socket.join(this.name);
    this.players.push(player);
    this.game.addPlayer(player);
    if (this.game.canStart()) {
      this.setUpListeners();
      this.game.status = 'playing';
    }
    return;
  };

  isFull = () => {
    return this.players.length >= this.limit;
  };

  sendMessage = (msg: string) => {
    console.log(`room sends msg ${msg}`)
    this.io.in(this.name).emit('message', msg);
  }

  setUpListeners = () => {
    this.players.forEach((player) => {
      player.socket.on('move', (steps) => {
        console.log(`${player.socket.id} move step ${steps}`);
        try {
          this.game.move(player, steps);
          if (this.game.status === 'finished') {
            console.log(`${player.socket.id} won!`);
          }
          this.io.in(this.name).emit('update_move', {player: player.socket.id, step: steps, isFinished: this.game.status === 'finished'})
        } catch (e: any) {
          console.log(e);
        }
      });
    });
  };
}