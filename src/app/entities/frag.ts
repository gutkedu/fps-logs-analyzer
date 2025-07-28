import { randomUUID } from 'node:crypto';
import { Replace } from '../../helpers/Replace';
import { WeaponType } from './enums/weapon-type';

export interface FragProps {
  matchId: string;
  killerId: string | null;
  victimId: string;
  weapon: WeaponType;
  killedAt: Date;
  isFriendlyFire: boolean;
}

export class Frag {
  private _id: string;
  private props: FragProps;

  constructor(
    props: Replace<FragProps, { isFriendlyFire?: boolean; killedAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      isFriendlyFire: props.isFriendlyFire ?? false,
      killedAt: props.killedAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get matchId(): string {
    return this.props.matchId;
  }

  public get killerId(): string | null {
    return this.props.killerId;
  }

  public get victimId(): string {
    return this.props.victimId;
  }

  public get weapon(): string {
    return this.props.weapon;
  }

  public get killedAt(): Date {
    return this.props.killedAt;
  }

  public get isFriendlyFire(): boolean {
    return this.props.isFriendlyFire;
  }

  public markAsFriendlyFire(): void {
    this.props.isFriendlyFire = true;
  }

  public get isWorldKill(): boolean {
    return this.props.killerId === null;
  }
}
