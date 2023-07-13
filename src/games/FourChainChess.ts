import { Player } from '../socket/Player';
import { TurnBasedGame } from './TurnBasedGame';

enum Chess {
  O = 0,
  X,
}

type Coordinate = {
  x: number,
  y: number,
}
export class FourChainChess extends TurnBasedGame {
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

  cleanUp(): void {
    this.players = [];
    this.gameboard = [];
  }

  addPlayer(player: Player): void {
    if (this.players.length < this.MAX_PLAYER) {
      this.players.push(player);
    } else {
      throw new Error('Now allowed to join game');
    }
  }

  canStart(): boolean {
    return (
      this.players.length >= this.MIN_PLAYER &&
      this.players.length <= this.MAX_PLAYER
    );
  }

  move = (player: Player, column: number) => {
    if (player === this.players[this.playerTurn]) {
      this.gameboard[column].push(Chess[this.playerTurn]);
      this.printBoard();
      this.playerTurn = (this.playerTurn + 1) % this.players.length;
      let row = this.gameboard[column].length - 1;
      if (this.isWin(column, row)) {
        this.isCompleted = true;
      }
    } else {
      throw new Error(`It is not turn for player ${player.socket.id}`);
    }
  };

  isWin = (x: number, y: number) => {
    let lastStepChess = this.gameboard[x][y];
    console.log(`lastStepChess = ${lastStepChess}`);
    let getConnectedNum = (
      chess: string,
      prevLocation: Coordinate,
      direction: Coordinate
    ): number => {
      let x = prevLocation.x + direction.x;
      let y = prevLocation.y + direction.y;
      if (
        x < 0 ||
        x >= this.BOARD_WIDTH ||
        y < 0 ||
        y >= this.BOARD_HEIGHT ||
        !this.gameboard[x] ||
        this.gameboard[x][y] !== chess
      ) {
        return 0;
      }
      return 1 + getConnectedNum(chess, { x, y }, direction);
    };

    

    //honizontal check
    let horizontalNum = getConnectedNum(
      lastStepChess,
      { x, y },
      { x: -1, y: 0 }
    ) + 1 + getConnectedNum(
      lastStepChess,
      { x, y },
      { x: 1, y: 0 }
    ) ;
    if (horizontalNum >= 4) {
      return true;
    }

    //diagonal up check
    let diagonalUpNum = getConnectedNum(
      lastStepChess,
      { x, y },
      { x: -1, y: -1 }
    ) + 1 + getConnectedNum(
      lastStepChess,
      { x, y },
      { x: 1, y: 1 }
    ) ;
    if (diagonalUpNum >= 4) {
      return true;
    }

    
    //diagonal down check
    let diagonalDownNum = getConnectedNum(
      lastStepChess,
      { x, y },
      { x: -1, y: 1 }
    ) + 1 + getConnectedNum(
      lastStepChess,
      { x, y },
      { x: 1, y: -1 }
    ) ;
    if (diagonalDownNum >= 4) {
      return true;
    }

    //vertical check
    let verticalNum = getConnectedNum(
      lastStepChess,
      { x, y },
      { x: 0, y: -1 }
    ) + 1 ;
    if (verticalNum >= 4) {
      return true;
    }

    return false;
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
}
