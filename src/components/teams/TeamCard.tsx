import { Link } from 'react-router-dom';
import type { Team } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
    >
      <FlagIcon countryCode={team.flag} size="md" alt={team.name} />
      <span className="font-medium text-gray-900 text-sm">{team.name}</span>
      <span className="ml-auto text-xs text-gray-400 uppercase">{team.id}</span>
    </Link>
  );
}
