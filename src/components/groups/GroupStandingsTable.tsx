import type { Standing, Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';
import { Badge } from '../ui/Badge';

interface GroupStandingsTableProps {
  standings: Standing[];
  teams: Team[];
  groupComplete: boolean;
}

export function GroupStandingsTable({ standings, teams, groupComplete }: GroupStandingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Equipo</th>
            <th className="px-3 py-2 text-center">PJ</th>
            <th className="px-3 py-2 text-center">PG</th>
            <th className="px-3 py-2 text-center">PE</th>
            <th className="px-3 py-2 text-center">PP</th>
            <th className="px-3 py-2 text-center">GF</th>
            <th className="px-3 py-2 text-center">GC</th>
            <th className="px-3 py-2 text-center">DG</th>
            <th className="px-3 py-2 text-center font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, idx) => {
            const team = teams.find((t) => t.id === s.teamId);
            const isQualifying = groupComplete && idx < 2;
            return (
              <tr
                key={s.teamId}
                className={`border-t border-gray-100 ${
                  isQualifying ? 'bg-green-50/50' : ''
                } hover:bg-gray-50 transition-colors`}
              >
                <td className="px-3 py-2.5 text-gray-500 font-mono">{idx + 1}</td>
                <td className="px-3 py-2.5 flex items-center gap-2">
                  {team && <FlagIcon countryCode={team.flag} size="sm" />}
                  <span className="font-medium text-gray-900">{team?.name ?? s.teamId}</span>
                  {isQualifying && <Badge variant="success">C</Badge>}
                </td>
                <td className="px-3 py-2.5 text-center font-mono">{s.played}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.wins}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.draws}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.losses}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.goalsFor}</td>
                <td className="px-3 py-2.5 text-center font-mono">{s.goalsAgainst}</td>
                <td className={`px-3 py-2.5 text-center font-mono ${
                  s.goalDifference > 0 ? 'text-green-600' : s.goalDifference < 0 ? 'text-red-600' : ''
                }`}>
                  {s.goalDifference > 0 ? '+' : ''}{s.goalDifference}
                </td>
                <td className="px-3 py-2.5 text-center font-bold font-mono text-gray-900">{s.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
