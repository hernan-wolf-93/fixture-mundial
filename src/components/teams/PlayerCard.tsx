import { useState } from 'react';
import type { Player } from '../../types';
import { FlagIcon } from '../ui/FlagIcon';

interface PlayerCardProps {
  player: Player;
  flagCode: string;
}

const positionLabels: Record<Player['position'], string> = {
  Goalkeeper: 'Arquero',
  Defender: 'Defensor',
  Midfielder: 'Mediocampista',
  Forward: 'Delantero',
};

export function PlayerCard({ player, flagCode }: PlayerCardProps) {
  const [imgError, setImgError] = useState(false);

  const showFallback = !player.picture || imgError;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        {showFallback ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
            <FlagIcon countryCode={flagCode} size="sm" />
          </div>
        ) : (
          <img
            src={player.picture}
            alt={player.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">#{player.jerseyNum}</span>
          <span className="font-medium text-gray-900 text-sm truncate">{player.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span>{positionLabels[player.position]}</span>
          <span>·</span>
          <span>{player.age} años</span>
          <span>·</span>
          <span>{player.height} cm</span>
          <span>·</span>
          <span>{player.weight} kg</span>
        </div>
      </div>
    </div>
  );
}
