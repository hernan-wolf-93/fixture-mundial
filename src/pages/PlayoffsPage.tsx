import { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import type { Match, MatchResult, GoalEvent } from '../types';
import { BracketView } from '../components/playoffs/BracketView';
import { ResultForm } from '../components/matches/ResultForm';

export function PlayoffsPage() {
  const { state, dispatch } = useAppContext();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  function handleSelectMatch(match: Match) {
    setSelectedMatch(match);
  }

  function handleSubmitResult(matchId: string, result: MatchResult, goals: GoalEvent[]) {
    dispatch({ type: 'SET_MATCH_RESULT', payload: { matchId, result, goals } });
    setSelectedMatch(null);
  }

  function handleResetResult(matchId: string) {
    dispatch({ type: 'RESET_MATCH_RESULT', payload: { matchId } });
    setSelectedMatch(null);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Playoffs</h2>
          {state.playoffs.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {state.tournamentStage === 'finished'
                ? 'Torneo finalizado'
                : 'Fase eliminatoria — hacé clic en cada cruce para cargar el resultado'}
            </p>
          )}
        </div>
      </div>

      {state.playoffs.length === 0 ? (
        <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <span className="text-5xl block mb-4">🏆</span>
          <p className="text-gray-300 text-lg">
            Los cruces de playoffs aparecerán una vez que la fase de grupos esté completa.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Cargá los resultados de todos los partidos de grupos para desbloquear la fase eliminatoria.
          </p>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
          <BracketView onSelectMatch={handleSelectMatch} />
        </div>
      )}

      {selectedMatch && (
        <ResultForm
          match={selectedMatch}
          homeTeam={state.teams.find((t) => t.id === selectedMatch.homeTeamId)}
          awayTeam={state.teams.find((t) => t.id === selectedMatch.awayTeamId)}
          isOpen={true}
          onClose={() => setSelectedMatch(null)}
          onSubmit={handleSubmitResult}
          onReset={handleResetResult}
        />
      )}
    </div>
  );
}
