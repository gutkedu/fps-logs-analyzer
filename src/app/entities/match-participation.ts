import { randomUUID } from 'node:crypto';
import { Replace } from '../../helpers/Replace';
import { AwardType } from './enums/award-type';

export interface Award {
  type: AwardType;
  value: number;
}

export interface MatchParticipationProps {
  matchId: string;
  playerId: string;
  team: string;
  frags: number;
  deaths: number;
  score: number;
  longestStreak: number;
  currentStreak: number;
  awards: Award[];
  joinedAt: Date;
  leftAt?: Date | null;
}

export class MatchParticipation {
  private _id: string;
  private props: MatchParticipationProps;

  constructor(
    props: Replace<
      MatchParticipationProps,
      {
        frags?: number;
        deaths?: number;
        score?: number;
        longestStreak?: number;
        currentStreak?: number;
        awards?: Award[];
        leftAt?: Date | null;
        joinedAt?: Date;
      }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      frags: props.frags ?? 0,
      deaths: props.deaths ?? 0,
      score: props.score ?? 0,
      longestStreak: props.longestStreak ?? 0,
      currentStreak: props.currentStreak ?? 0,
      awards: props.awards ?? [],
      leftAt: props.leftAt ?? null,
      joinedAt: props.joinedAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get matchId(): string {
    return this.props.matchId;
  }

  public get playerId(): string {
    return this.props.playerId;
  }

  public get team(): string {
    return this.props.team;
  }

  public get frags(): number {
    return this.props.frags;
  }

  public get deaths(): number {
    return this.props.deaths;
  }

  public get score(): number {
    return this.props.score;
  }

  public get longestStreak(): number {
    return this.props.longestStreak;
  }

  public get currentStreak(): number {
    return this.props.currentStreak;
  }

  public get awards(): Award[] {
    return this.props.awards;
  }

  public get joinedAt(): Date {
    return this.props.joinedAt;
  }

  public get leftAt(): Date | null | undefined {
    return this.props.leftAt;
  }

  // Business methods
  public addFrag(): void {
    this.props.frags += 1;
    this.props.currentStreak += 1;
    this.props.score += 1;

    if (this.props.currentStreak > this.props.longestStreak) {
      this.props.longestStreak = this.props.currentStreak;
    }
  }

  public addDeath(): void {
    this.props.deaths += 1;
    this.props.currentStreak = 0;
  }

  public addScore(points: number): void {
    this.props.score += points;
  }

  public addAward(award: Award): void {
    this.props.awards.push(award);
    this.addScore(award.value);
  }

  public leaveMatch(): void {
    if (!this.props.leftAt) {
      this.props.leftAt = new Date();
    }
  }

  public get isActive(): boolean {
    return this.props.leftAt === null;
  }

  public get duration(): number | null {
    if (!this.props.leftAt) {
      return null;
    }
    return this.props.leftAt.getTime() - this.props.joinedAt.getTime();
  }
}
