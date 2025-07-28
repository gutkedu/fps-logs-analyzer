import { randomUUID } from 'crypto';
import { Replace } from '../../helpers/Replace';

export interface MatchProps {
  externalId: string;
  startedAt: Date;
  endedAt?: Date | null;
  createdAt: Date;
}

export class Match {
  private _id: string;
  private props: MatchProps;

  constructor(
    props: Replace<MatchProps, { endedAt?: Date | null; createdAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      endedAt: props.endedAt ?? null,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get externalId(): string {
    return this.props.externalId;
  }

  public get startedAt(): Date {
    return this.props.startedAt;
  }

  public get endedAt(): Date | null | undefined {
    return this.props.endedAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public end() {
    this.props.endedAt = new Date();
  }

  public get isActive(): boolean {
    return this.props.endedAt === null;
  }

  public get duration(): number | null {
    if (!this.props.endedAt) {
      return null;
    }

    return this.props.endedAt.getTime() - this.props.startedAt.getTime();
  }

  public setEndedAt(date: Date) {
    this.props.endedAt = date;
  }
}
