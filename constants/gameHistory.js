import fall2025 from '../data/game-history/fall-2025-lijsl.json';
import spring2025 from '../data/game-history/spring-2025-lijsl.json';
import longIslandCup2025 from '../data/game-history/long-island-cup-2025.json';
import fall2024 from '../data/game-history/fall-2024-lijsl.json';

const RAW_SEASONS = [fall2025, spring2025, longIslandCup2025, fall2024];

const annotateSeason = (season) => {
  const competition = (season?.competition || '').toLowerCase();
  const isCup = competition.includes('cup');

  return {
    ...season,
    isCup,
  };
};

const isCompletedGame = (game) =>
  typeof game?.score?.hawks === 'number' && typeof game?.score?.opponent === 'number';

const computeRecord = (games = []) =>
  games.reduce(
    (acc, game) => {
      if (!isCompletedGame(game)) return acc;

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

export const GAME_HISTORY = RAW_SEASONS.map((season) => {
  const annotatedSeason = annotateSeason(season);
  return {
    ...annotatedSeason,
    record: computeRecord(annotatedSeason.games),
  };
});

const filterSeasons = ({ includeCups = true, includeLeagues = true } = {}) =>
  GAME_HISTORY.filter((season) => {
    if (season.isCup) {
      return includeCups;
    }
    return includeLeagues;
  });

export const getAllMatches = (options = {}) =>
  filterSeasons(options).flatMap((season) =>
    season.games.map((game) => ({
      seasonId: season.id,
      seasonName: `${season.season} · ${season.competition}`,
      division: season.division,
      competition: season.competition,
      isCup: season.isCup,
      ...game,
    }))
  );

export const getAggregateTotals = (options = {}) => {
  const { seasonIds } = options;
  const games = getAllMatches(options);
  const filteredGames = seasonIds?.length
    ? games.filter((game) => seasonIds.includes(game.seasonId))
    : games;
  const completedGames = filteredGames.filter(isCompletedGame);
  const record = computeRecord(completedGames);
  const cleanSheets = completedGames.filter((game) => Number(game?.score?.opponent) === 0).length;

  return {
    matchesPlayed: completedGames.length,
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
    matchesPlayed: season.games.filter(isCompletedGame).length,
    record: season.record,
    goalsFor: season.record.goalsFor,
    goalsAgainst: season.record.goalsAgainst,
  };
};
