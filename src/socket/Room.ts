export class Room {
  name: string;
  players: string[];
  limit: number;

  constructor(name: string, limit: number) {
    this.name = name;
    this.limit = limit;
    this.players = [];
  }

  addPlayer = (player: string): void => {
    if (this.isFull()){
      throw new Error('Room is full');
    }
    this.players.push(player);
    return;
  }

  isFull = () => {
    return this.players.length >= this.limit
  }
}