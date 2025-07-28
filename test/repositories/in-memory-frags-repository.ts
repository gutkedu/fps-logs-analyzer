/* eslint-disable @typescript-eslint/require-await */
import { Frag } from '@/app/entities/frag';
import { FragsRepository } from '@/app/repositories/frags-repository';

export class InMemoryFragsRepository implements FragsRepository {
  public frags: Frag[] = [];

  async create(frag: Frag): Promise<void> {
    this.frags.push(frag);
  }

  async createMany(frags: Frag[]): Promise<void> {
    this.frags.push(...frags);
  }

  async findById(fragId: string): Promise<Frag | null> {
    const frag = this.frags.find((item) => item.id === fragId);

    if (!frag) {
      return null;
    }

    return frag;
  }

  findMany(): Promise<Frag[]> {
    return Promise.resolve(this.frags);
  }
}
