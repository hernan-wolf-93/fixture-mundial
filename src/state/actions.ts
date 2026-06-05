import type { MatchResult, GoalEvent } from '../types';

export interface BulkMatchUpdate {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  result: MatchResult;
  goals: GoalEvent[];
}

export type AppAction =
  | { type: 'SET_MATCH_RESULT'; payload: { matchId: string; result: MatchResult; goals?: GoalEvent[] } }
  | { type: 'RESET_MATCH_RESULT'; payload: { matchId: string } }
  | { type: 'RESET_ALL' }
  | { type: 'BULK_SIMULATE'; payload: { updates: BulkMatchUpdate[] } };
