import type { AppState } from '../types';
import { teams } from './teams';
import { matches } from './matches';
import { recalculateStandings } from '../logic/standings';

export const initialAppState: AppState = {
  teams,
  matches,
  standings: recalculateStandings(matches, teams),
  playoffs: [],
  topScorers: [],
  topAssisters: [],
  tournamentStage: 'group',
};
