import { Player } from '../socket/Classes/Player';

export abstract class TurnBasedGame {
  isCompleted: boolean;

  abstract cleanUp(): void;

  abstract addPlayer(player: Player): void;
  abstract canStart(): boolean;
  abstract move(player: Player, step: any): void;
  // abstract isWin(): boolean;
  abstract printBoard(): void;

  constructor() {
    this.isCompleted = false;
  }

  getIsCompleted: () => boolean = () => {
    return this.isCompleted;
  };
}
