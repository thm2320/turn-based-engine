import { Player } from "../socket/Player";

export abstract class TurnBasedGame {
  public status: "waiting" | "playing" = "waiting";

  abstract addPlayer(player: Player): void;
  abstract canStart(): boolean;
  abstract play(player: Player, step: any): void;
  abstract isWin(): boolean;
  abstract printBoard(): void;
  abstract setUpListeners(): void;
}
