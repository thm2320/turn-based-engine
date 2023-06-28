import { Player } from "../socket/Player";

export abstract class TurnBasedGame {
  public status: "waiting" | "playing" | "finished" = "waiting";

  abstract cleanUp(): void;

  abstract addPlayer(player: Player): void;
  abstract canStart(): boolean;
  abstract move(player: Player, step: any): void;
  // abstract isWin(): boolean;
  abstract printBoard(): void;
}
