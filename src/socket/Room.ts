import { TurnBasedGame } from "../games/TurnBasedGame";
import { Player } from "./Player";

export class Room {
  name: string;
  players: Player[];
  limit: number;
  game: TurnBasedGame;

  constructor(name: string, limit: number, game: TurnBasedGame) {
    this.name = name;
    this.limit = limit;
    this.players = [];
    this.game = game;
  }

  addPlayer = (player: Player): void => {
    if (this.isFull()){
      throw new Error('Room is full');
    }
    this.players.push(player);
    this.game.addPlayer(player)
    if (this.game.canStart()){
      this.setUpListeners();
      this.game.status = 'playing';
    }
    return;
  }

  isFull = () => {
    return this.players.length >= this.limit
  }

  setUpListeners = () => {
    this.players.forEach( (player ) => {
      player.socket.on('play', (steps) => {
        console.log(`${player.socket.id} run ${steps}`);
        try{
          this.game.play(player, steps)
          if (this.game.isWin()){
            console.log(`${player.socket.id} won!`)
          }
        }
        catch(e: any) {
          console.log(e);
        }
      });
    })
  }
}