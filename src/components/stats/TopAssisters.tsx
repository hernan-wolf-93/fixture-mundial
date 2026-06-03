import type { AssisterEntry, Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface TopAssistersProps {
  assisters: AssisterEntry[];
  teams: Team[];
}

export function TopAssisters({ assisters, teams }: TopAssistersProps) {
  if (assisters.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        Aún no se registraron asistencias. Cargá resultados con detalles de asistencias para poblar esta lista.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Jugador</th>
            <th className="px-3 py-2 text-left">Equipo</th>
            <th className="px-3 py-2 text-center font-bold">Asistencias</th>
          </tr>
        </thead>
        <tbody>
          {assisters.map((entry, idx) => {
            const team = teams.find((t) => t.id === entry.teamId);
            return (
              <tr
                key={`${entry.playerName}-${entry.teamId}`}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 py-2.5 text-gray-500 font-mono">{idx + 1}</td>
                <td className="px-3 py-2.5 font-medium text-gray-900">{entry.playerName}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {team && <FlagIcon countryCode={team.flag} size="sm" />}
                    <span className="text-gray-600">{team?.name ?? entry.teamId}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center font-bold font-mono text-lg text-amber-700">
                  {entry.assists}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
