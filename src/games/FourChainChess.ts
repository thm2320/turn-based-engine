import { Player } from "../socket/Player";
import { TurnBasedGame } from "./TurnBasedGame";

enum Chess {
  X = 0,
  O,
}

export class FourChainChess extends TurnBasedGame{
  readonly MIN_PLAYER = 2;
  readonly MAX_PLAYER = 2;
  readonly BOARD_WIDTH = 7;
  readonly BOARD_HEIGHT = 6;

  private players: Player[];
  private gameboard: string[][];
  private playerTurn: number = 0;

  constructor() {
    super();
    this.players = [];

    this.gameboard = new Array<Array<string>>(7).fill([]);
    this.gameboard.forEach((col, idx) => {
      this.gameboard[idx] = [];
    });

    this.printBoard();
  }

  addPlayer(player: Player): void {
    if (this.status === 'waiting') {
      this.players.push(player);
    } else {
      throw new Error('Now allowed to join game')
    }
  }

  canStart(): boolean {
    return (
      this.players.length >= this.MIN_PLAYER &&
      this.players.length <= this.MAX_PLAYER
    );
  }

  play = (player:Player, column: number) => {
    if (player === this.players[this.playerTurn]) {
      this.gameboard[column].push(Chess[this.playerTurn]);
      this.printBoard();
      this.playerTurn = (this.playerTurn + 1) % this.players.length
    } else {
      throw new Error(`It is not turn for player ${player.socket.id}`)
    }

  };

  isWin = () => {
    return false
  };

  printBoard = () => {
    for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
      let line = '';
      for (let x = 0; x < this.BOARD_WIDTH; x++) {
        line += `${this.gameboard[x][y] ? this.gameboard[x][y] : ' '} `;
      }
      console.log(line);
    }
  };

  setUpListeners = () => {
    this.players.forEach( (player ) => {
      player.socket.on('play', (steps) => {
        console.log(`${player.socket.id} run ${steps}`);
        this.play(player, steps)
      });
    })
  }
}
