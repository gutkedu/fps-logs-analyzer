import { Frag } from '../entities/frag';

export interface FragsRepository {
  create(frag: Frag): Promise<void>;
  createMany(frags: Frag[]): Promise<void>;
  findById(fragId: string): Promise<Frag | null>;
  findMany(): Promise<Frag[]>;
}
