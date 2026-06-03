export type { GroupLetter } from './team';
export type { Team } from './team';
export type { MatchStage, MatchStatus, MatchResult, GoalEvent, Match } from './match';
export type { Standing, GroupStandings } from './standing';
export type { BracketRoundName, BracketMatch, BracketRound } from './playoff';
export type { ScorerEntry, AssisterEntry } from './stats';

export interface AppState {
  teams: Team[];
  matches: Match[];
  standings: GroupStandings;
  playoffs: BracketRound[];
  topScorers: ScorerEntry[];
  topAssisters: AssisterEntry[];
  tournamentStage: 'group' | 'playoffs' | 'finished';
}
