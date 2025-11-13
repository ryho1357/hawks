import fall2025 from '../data/game-history/fall-2025-lijsl.json';
import spring2025 from '../data/game-history/spring-2025-lijsl.json';
import longIslandCup2025 from '../data/game-history/long-island-cup-2025.json';
import fall2024 from '../data/game-history/fall-2024-lijsl.json';

const RAW_SEASONS = [fall2025, spring2025, longIslandCup2025, fall2024];

const computeRecord = (games = []) =>
  games.reduce(
    (acc, game) => {
      if (!game?.score) return acc;

      acc.goalsFor += Number(game.score.hawks || 0);
      acc.goalsAgainst += Number(game.score.opponent || 0);

      switch (game.result) {
        case 'W':
          acc.wins += 1;
          break;
        case 'L':
          acc.losses += 1;
          break;
        default:
          acc.draws += 1;
      }

      return acc;
    },
    {
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    }
  );

export const GAME_HISTORY = RAW_SEASONS.map((season) => ({
  ...season,
  record: computeRecord(season.games),
}));

const getGames = () => GAME_HISTORY.flatMap((season) => season.games);

export const getAllMatches = () =>
  GAME_HISTORY.flatMap((season) =>
    season.games.map((game) => ({
      seasonId: season.id,
      seasonName: `${season.season} · ${season.competition}`,
      division: season.division,
      ...game,
    }))
  );

export const getAggregateTotals = () => {
  const games = getAllMatches();
  const record = computeRecord(games);
  const cleanSheets = games.filter((game) => Number(game?.score?.opponent) === 0).length;

  return {
    matchesPlayed: games.length,
    wins: record.wins,
    draws: record.draws,
    losses: record.losses,
    goalsFor: record.goalsFor,
    goalsAgainst: record.goalsAgainst,
    cleanSheets,
  };
};

export const getSeasonSummary = (seasonId) => {
  const season = GAME_HISTORY.find((entry) => entry.id === seasonId) || GAME_HISTORY[0];
  if (!season) return null;

  return {
    id: season.id,
    season: season.season,
    division: season.division,
    competition: season.competition,
    matchesPlayed: season.games.length,
    record: season.record,
    goalsFor: season.record.goalsFor,
    goalsAgainst: season.record.goalsAgainst,
  };
};
