import fall2024 from '../data/standings/fall-2024-division-7e.json';
import spring2025 from '../data/standings/spring-2025-division-6e.json';
import fall2025 from '../data/standings/fall-2025-division-4e.json';

export const STANDINGS = [fall2025, spring2025, fall2024];

export const getStandingsBySeasonId = (seasonId) =>
  STANDINGS.find((table) => table.id === seasonId);
