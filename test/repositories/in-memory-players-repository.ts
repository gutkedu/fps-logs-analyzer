/* eslint-disable @typescript-eslint/require-await */
import { Player } from '@/app/entities/player';
import { PlayersRepository } from '@/app/repositories/players-repository';

export class InMemoryPlayersRepository implements PlayersRepository {
  public players: Player[] = [];

  async create(player: Player): Promise<Player> {
    this.players.push(player);
    return player;
  }

  async createMany(players: Player[]): Promise<void> {
    this.players.push(...players);
  }

  async findById(playerId: string): Promise<Player | null> {
    const player = this.players.find((item) => item.id === playerId);

    if (!player) {
      return null;
    }

    return player;
  }

  async findByName(name: string): Promise<Player | null> {
    const player = this.players.find((item) => item.name === name);

    if (!player) {
      return null;
    }

    return player;
  }

  async findMany(): Promise<Player[]> {
    return this.players;
  }
}
