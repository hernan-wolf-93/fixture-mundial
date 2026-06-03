import type { ScorerEntry, Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface TopScorersProps {
  scorers: ScorerEntry[];
  teams: Team[];
}

export function TopScorers({ scorers, teams }: TopScorersProps) {
  if (scorers.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        Aún no se registraron goles. Cargá resultados con detalles de goles para poblar esta lista.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
            <th className="px-1 sm:px-3 py-2 text-left">#</th>
            <th className="px-1 sm:px-3 py-2 text-left">Jugador</th>
            <th className="px-1 sm:px-3 py-2 text-left">Equipo</th>
            <th className="px-1 sm:px-3 py-2 text-center font-bold">Goles</th>
          </tr>
        </thead>
        <tbody>
          {scorers.map((entry, idx) => {
            const team = teams.find((t) => t.id === entry.teamId);
            return (
              <tr
                key={`${entry.playerName}-${entry.teamId}`}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-1 sm:px-3 py-2 sm:py-2.5 text-gray-500 font-mono">{idx + 1}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-2.5 font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">{entry.playerName}</td>
                <td className="px-1 sm:px-3 py-2 sm:py-2.5">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {team && <FlagIcon countryCode={team.flag} size="sm" />}
                    <span className="text-gray-600 truncate max-w-[70px] sm:max-w-none">{team?.name ?? entry.teamId}</span>
                  </div>
                </td>
                <td className="px-1 sm:px-3 py-2 sm:py-2.5 text-center font-bold font-mono text-base sm:text-lg text-blue-700">
                  {entry.goals}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
