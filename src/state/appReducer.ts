import type { AppState } from '../types';
import type { AppAction, BulkMatchUpdate } from './actions';
import { initialAppState } from '../data/initialData';
import { recalculateStandings } from '../logic/standings';
import { buildPlayoffs, getTournamentStage } from '../logic/playoffs';
import { computeTopScorers, computeTopAssisters } from '../logic/statistics';

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MATCH_RESULT': {
      const { matchId, result, goals } = action.payload;
      const newMatches = state.matches.map((m) =>
        m.id === matchId
          ? { ...m, result, goals: goals ?? [], status: 'played' as const }
          : m
      );
      const newStandings = recalculateStandings(newMatches, state.teams);
      const { bracket, updatedMatches } = buildPlayoffs(newStandings, newMatches);
      const finalMatches = bracket.length > 0 ? updatedMatches : newMatches;
      const tournamentStage = getTournamentStage(finalMatches);
      const topScorers = computeTopScorers(finalMatches);
      const topAssisters = computeTopAssisters(finalMatches);
      return {
        ...state,
        matches: finalMatches,
        standings: newStandings,
        playoffs: bracket,
        tournamentStage,
        topScorers,
        topAssisters,
      };
    }

    case 'RESET_MATCH_RESULT': {
      const { matchId } = action.payload;
      const newMatches = state.matches.map((m) =>
        m.id === matchId
          ? { ...m, result: undefined, goals: undefined, status: 'scheduled' as const }
          : m
      );
      const newStandings = recalculateStandings(newMatches, state.teams);
      const { bracket, updatedMatches } = buildPlayoffs(newStandings, newMatches);
      const finalMatches = bracket.length > 0 ? updatedMatches : newMatches;
      const tournamentStage = getTournamentStage(finalMatches);
      const topScorers = computeTopScorers(finalMatches);
      const topAssisters = computeTopAssisters(finalMatches);
      return {
        ...state,
        matches: finalMatches,
        standings: newStandings,
        playoffs: bracket,
        tournamentStage,
        topScorers,
        topAssisters,
      };
    }

    case 'BULK_SIMULATE': {
      const updatesById = new Map<string, BulkMatchUpdate>();
      for (const u of action.payload.updates) {
        updatesById.set(u.matchId, u);
      }
      const newMatches = state.matches.map((m) => {
        const update = updatesById.get(m.id);
        if (update) {
          return {
            ...m,
            homeTeamId: update.homeTeamId,
            awayTeamId: update.awayTeamId,
            result: update.result,
            goals: update.goals,
            status: 'played' as const,
          };
        }
        return m;
      });
      const newStandings = recalculateStandings(newMatches, state.teams);
      const { bracket, updatedMatches } = buildPlayoffs(newStandings, newMatches);
      const finalMatches = bracket.length > 0 ? updatedMatches : newMatches;
      const tournamentStage = getTournamentStage(finalMatches);
      const topScorers = computeTopScorers(finalMatches);
      const topAssisters = computeTopAssisters(finalMatches);
      return {
        ...state,
        matches: finalMatches,
        standings: newStandings,
        playoffs: bracket,
        tournamentStage,
        topScorers,
        topAssisters,
      };
    }

    case 'RESET_ALL':
      return { ...initialAppState };

    default:
      return state;
  }
}
