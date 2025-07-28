export interface MatchDto {
  id?: string;
  externalId: string;
  startedAt: Date;
  endedAt?: Date | null;
  events: Array<{
    timestamp: Date;
    action: string;
    data: unknown;
  }>;
}
