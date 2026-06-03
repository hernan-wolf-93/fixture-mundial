import { useAppContext } from '../../hooks/useAppContext';
import type { BracketMatch } from '../../types/playoff';
import type { Match } from '../../types';
import { BracketNode } from './BracketNode';

interface BracketViewProps {
  onSelectMatch: (match: Match) => void;
}

const CARD_HEIGHT = 82;
const COL_WIDTH = 220;

export function BracketView({ onSelectMatch }: BracketViewProps) {
  const { state } = useAppContext();
  const { playoffs: rounds } = state;

  if (rounds.length === 0) return null;

  const maxNodes = Math.max(...rounds.map((r) => r.matches.length), 0);
  const bracketHeight = maxNodes * (CARD_HEIGHT + 12) + 40;

  function handleClick(bracketMatch: BracketMatch) {
    const match = state.matches.find((m) => m.id === bracketMatch.matchId);
    if (match) onSelectMatch(match);
  }

  const roundNameLabels: Record<string, string> = {
    'Round of 16': 'Octavos de Final',
    'Quarter-finals': 'Cuartos de Final',
    'Semi-finals': 'Semifinales',
    'Third Place': 'Tercer Puesto',
    'Final': 'Final',
  };

  const mainRounds = rounds.filter((r) => r.name !== 'Third Place');
  const thirdPlaceRound = rounds.find((r) => r.name === 'Third Place');

  function renderColumn(roundName: string, matches: BracketMatch[], isThirdPlace: boolean) {
    const nodesCount = matches.length;
    return (
      <div key={roundName} className="flex flex-col px-2" style={{ width: COL_WIDTH, minHeight: bracketHeight }}>
        <h3 className={`text-sm font-bold mb-3 text-center uppercase tracking-wide pt-2 ${isThirdPlace ? 'text-gray-500' : 'text-gray-700'}`}>
          {roundNameLabels[roundName] ?? roundName}
        </h3>
        <div className={`flex flex-col flex-1 ${nodesCount > 1 ? 'justify-evenly' : 'justify-center'}`}>
          {matches.map((bm) => {
            const match = state.matches.find((m) => m.id === bm.matchId);
            const homeTeam = bm.homeTeamId
              ? state.teams.find((t) => t.id === bm.homeTeamId)
              : undefined;
            const awayTeam = bm.awayTeamId
              ? state.teams.find((t) => t.id === bm.awayTeamId)
              : undefined;
            const isPlayed = match?.status === 'played';

            return (
              <div key={bm.id}>
                <BracketNode
                  bracketMatch={bm}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  homeScore={match?.result?.homeGoals}
                  awayScore={match?.result?.awayGoals}
                  isPlayed={isPlayed}
                  onClick={() => handleClick(bm)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex items-stretch gap-0" style={{ minWidth: `${mainRounds.length * COL_WIDTH + 80}px` }}>
        {mainRounds.map((round) =>
          renderColumn(round.name, round.matches, false)
        )}
        {thirdPlaceRound && thirdPlaceRound.matches.length > 0 &&
          renderColumn('Third Place', thirdPlaceRound.matches, true)
        }
      </div>
    </div>
  );
}
