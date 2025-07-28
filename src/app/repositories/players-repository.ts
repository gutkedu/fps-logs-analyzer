import { Player } from '../entities/player';

export interface PlayersRepository {
  create(player: Player): Promise<Player>;
  createMany(players: Player[]): Promise<void>;
  findById(playerId: string): Promise<Player | null>;
  findByName(name: string): Promise<Player | null>;
  findMany(): Promise<Player[]>;
}
