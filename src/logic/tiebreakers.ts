import type { Standing, Match } from '../types';

export function resolveHeadToHead(a: Standing, b: Standing, matches: Match[]): number {
  const directMatch = matches.find(
    (m) =>
      m.stage === 'group' &&
      m.group === a.group &&
      m.status === 'played' &&
      m.result &&
      ((m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
        (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId))
  );

  if (!directMatch?.result) return 0;
  if (directMatch.result.homeGoals === directMatch.result.awayGoals) return 0;

  const { homeTeamId, result } = directMatch;
  const aIsHome = homeTeamId === a.teamId;
  const aGoals = aIsHome ? result.homeGoals : result.awayGoals;
  const bGoals = aIsHome ? result.awayGoals : result.homeGoals;

  return bGoals - aGoals;
}

export function sortStandings(standings: Standing[], matches: Match[]): Standing[] {
  return [...standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    const headToHead = resolveHeadToHead(a, b, matches);
    if (headToHead !== 0) return headToHead;
    return 0;
  });
}
