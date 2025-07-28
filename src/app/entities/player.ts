import { randomUUID } from 'node:crypto';
import { Replace } from '../../helpers/Replace';

export interface PlayerProps {
  name: string;
  createdAt: Date;
}

export class Player {
  private _id: string;
  private props: PlayerProps;

  constructor(props: Replace<PlayerProps, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
}
