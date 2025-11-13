// constants/content.js
import { GAME_HISTORY, getAggregateTotals, getSeasonSummary } from './gameHistory';

const AGGREGATE_TOTALS = getAggregateTotals();
const CURRENT_SEASON = getSeasonSummary(GAME_HISTORY[0]?.id);

// Club Information
export const CLUB_INFO = {
  name: "Smithtown Hawks",
  tagline: "Building Character Through Competition",
  founded: "2022",
  description:
    "The Smithtown Hawks are a competitive U13 boys travel soccer team competing in the LIJSL. We focus on development, teamwork, and leadership — helping young players grow on and off the field.",
  email: "ryanjhofman@gmail.com",
  leadership: [
    {
      name: "Ryan Hofman",
      title: "Founder & Head Coach",
      bio: "Ryan founded the Smithtown Hawks with a player-first vision — blending structure, creativity, and accountability to develop resilient athletes. Under his leadership, the Hawks have earned multiple promotions and built a strong, family-like culture.",
    },
    {
      name: "Carlo Scanni",
      title: "Head of Training",
      bio: "Carlo oversees the technical and tactical training curriculum, ensuring each player progresses in skill, discipline, and understanding of the game. His attention to detail and passion for player development are central to the Hawks' success.",
    },
    {
      name: "Chris Steir",
      title: "Head of Administration",
      bio: "Chris keeps our logistics tight — coordinating communications, scheduling, and team admin so coaches and players can focus on training.",
    },
  ],
};

// Hero Section
export const HERO_CONTENT = {
  headline: "Heart. Effort. Teamwork.",
  subheadline:
    "Hawks compete with passion, discipline, and purpose.",
  cta: {
    primary: "View Schedule",
    secondary: "Meet the Coaches",
  },
};

// Daily spotlight for parents/players
export const TODAY_INFO = {
  dateLabel: "Thursday • Nov 13",
  sessionTitle: "Practice: Game Review",
  time: "6:00 – 7:45 PM",
  location: "9 Janet Court, Nesconset, NY 11767",
  note: "Game review session so everyone knows what we're covering tonight.",
};

// Team Pillars / Core Values
export const TEAM_PILLARS = [
  {
    icon: "trophy",
    title: "Competitive Spirit",
    description:
      "We play with heart and hunger every match — developing players who compete at the highest level with sportsmanship and respect.",
  },
  {
    icon: "users",
    title: "Player Development",
    description:
      "Focused training sessions designed to improve technical ability, tactical awareness, and overall soccer IQ.",
  },
  {
    icon: "activity",
    title: "Fitness & Discipline",
    description:
      "Building strong, conditioned athletes who bring focus and effort to every practice and game.",
  },
  {
    icon: "target",
    title: "Team Culture",
    description:
      "Our culture is built on accountability, effort, and trust. Every Hawk plays a role, and every player matters.",
  },
];

const DEFAULT_RECORD = { wins: 0, draws: 0, losses: 0 };

// Season Information
export const TEAM_HISTORY = {
  totals: {
    matchesPlayed: AGGREGATE_TOTALS.matchesPlayed,
    wins: AGGREGATE_TOTALS.wins,
    draws: AGGREGATE_TOTALS.draws,
    losses: AGGREGATE_TOTALS.losses,
  },
  currentSeason: {
    season: CURRENT_SEASON?.season || "Season TBA",
    division: CURRENT_SEASON?.division || "Division TBA",
    matchesPlayed: CURRENT_SEASON?.matchesPlayed || 0,
    wins: CURRENT_SEASON?.record?.wins ?? DEFAULT_RECORD.wins,
    draws: CURRENT_SEASON?.record?.draws ?? DEFAULT_RECORD.draws,
    losses: CURRENT_SEASON?.record?.losses ?? DEFAULT_RECORD.losses,
  },
  highlight: "Promoted from Division 7 → 6 → 4 in just two years.",
};

// Coaching Philosophy
export const COACHING_PHILOSOPHY = {
  headline: "A Player-First Approach",
  description:
    "Our mission is to teach young players to think, adapt, and lead — on the field and beyond. Every training session emphasizes creativity, effort, and accountability. Winning matters, but growth always comes first.",
  values: [
    "Effort and Accountability",
    "Creativity and Confidence",
    "Teamwork and Communication",
    "Respect for the Game",
  ],
};

// Schedule Information
export const SCHEDULE_INFO = {
  practice: [
    { day: "Tuesday", time: "6:00–7:30 PM", location: "Moriches Field" },
    { day: "Thursday", time: "7:30–8:45 PM", location: "Moriches Field" },
  ],
  nextGame: {
    date: "Sat, Nov 15, 2025",
    opponent: "Manorville United",
    location: "Manorville",
  },
};

export const INDOOR_PRACTICE_SCHEDULE = [
  { date: "2026-01-11", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
  { date: "2026-01-18", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
  { date: "2026-01-25", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
  { date: "2026-02-01", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
  { date: "2026-02-08", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
  { date: "2026-02-15", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
  { date: "2026-02-22", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
  { date: "2026-03-01", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
  { date: "2026-03-08", day: "Sun", time: "6:00–8:00 PM", location: "SPORTIME Kings Park", address: "275 Old Indian Head Road, Kings Park, NY 11754", link: "https://www.sportimeny.com/kingspark" },
];

// Team Roster
export const TEAM_ROSTER = [
  { name: "Julian Carazo" },
  { name: "Lucas Cianci" },
  { name: "Nathaniel Donlon" },
  { name: "Jake Ferraro" },
  { name: "Anthony Fil" },
  { name: "Patrick Gillen" },
  { name: "Matthew Habek" },
  { name: "John Haloulakos" },
  { name: "Benjamin Haloulakos" },
  { name: "Derek Hofman" },
  { name: "Paul Lomonaco" },
  { name: "Samuel Marin" },
  { name: "Lucas Marvin" },
  { name: "Cole Nordin" },
  { name: "Nitish Prithivi" },
  { name: "Storm Stier" },
  { name: "Robert Sullivan" },
];

// Team Stats Summary
export const TEAM_STATS = {
  goalsScored: AGGREGATE_TOTALS.goalsFor,
  goalsAllowed: AGGREGATE_TOTALS.goalsAgainst,
  cleanSheets: AGGREGATE_TOTALS.cleanSheets,
  playerCount: TEAM_ROSTER.length,
  streak: CURRENT_SEASON
    ? `${CURRENT_SEASON.season} form: ${CURRENT_SEASON.record?.wins ?? 0}-${CURRENT_SEASON.record?.draws ?? 0}-${CURRENT_SEASON.record?.losses ?? 0}`
    : "Season loading",
};
