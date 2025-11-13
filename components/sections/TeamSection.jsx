import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import { TEAM_STATS, TEAM_ROSTER, TEAM_HISTORY } from '../../constants/content';
import { GAME_HISTORY, getAllMatches } from '../../constants/gameHistory';
import { STANDINGS } from '../../constants/standings';
import Container from '../ui/Container';
import { isDesktop, isTablet } from '../../utils/responsive';

const stats = [
  {
    label: 'Matches Played',
    value: TEAM_HISTORY.totals.matchesPlayed,
    icon: 'calendar-today',
  },
  {
    label: 'Wins',
    value: TEAM_HISTORY.totals.wins,
    icon: 'military-tech',
  },
  {
    label: 'Draws',
    value: TEAM_HISTORY.totals.draws,
    icon: 'handshake',
  },
  {
    label: 'Goals Scored',
    value: TEAM_STATS.goalsScored,
    icon: 'sports-soccer',
  },
  {
    label: 'Goals Allowed',
    value: TEAM_STATS.goalsAllowed,
    icon: 'shield',
  },
  {
    label: 'Clean Sheets',
    value: TEAM_STATS.cleanSheets,
    icon: 'cleaning-services',
  },
];

const PlayerCard = ({ index }) => {
  const initials = `#${String(index + 1).padStart(2, '0')}`;

  const cardWidth = isDesktop() ? '30%' : isTablet() ? '45%' : '100%';

  return (
    <View
      style={{
        width: cardWidth,
        backgroundColor: COLORS.background.main,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        marginRight: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.small,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: BORDER_RADIUS.round,
          backgroundColor: COLORS.primary + '15',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: SPACING.md,
        }}
      >
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.lg,
            fontWeight: TYPOGRAPHY.weights.bold,
            color: COLORS.primary,
          }}
        >
          {initials}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.lg,
            fontWeight: TYPOGRAPHY.weights.semibold,
            color: COLORS.text.primary,
          }}
        >
          Hawk Player #{index + 1}
        </Text>
      </View>
    </View>
  );
};

const StatCard = ({ label, value, icon }) => (
  <View
    style={{
      flex: 1,
      minWidth: isDesktop() ? '30%' : '45%',
      backgroundColor: COLORS.background.main,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      marginRight: SPACING.md,
      ...SHADOWS.small,
    }}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
      }}
    >
      <MaterialIcons name={icon} size={20} color={COLORS.primary} />
    </View>
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.xxxl,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.primary,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.text.secondary,
        marginTop: SPACING.xs,
      }}
    >
      {label}
    </Text>
  </View>
);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toDateKey = (date) => {
  if (!(date instanceof Date)) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateString = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if ([year, month, day].some((part) => Number.isNaN(part))) {
    return null;
  }
  return new Date(year, month - 1, day);
};

const buildCalendarDays = (referenceDate) => {
  const base = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const firstDayIndex = base.getDay();
  const totalCells = 42; // 6 weeks to ensure consistent grid
  const todayKey = toDateKey(new Date());

  return Array.from({ length: totalCells }, (_, index) => {
    const cellDate = new Date(base.getFullYear(), base.getMonth(), index - firstDayIndex + 1);
    const key = toDateKey(cellDate);
    return {
      key: `${key}-${index}`,
      date: cellDate,
      display: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === base.getMonth(),
      isToday: key === todayKey,
    };
  });
};

const INITIAL_CALENDAR_DATE = (() => {
  const firstGameDate = GAME_HISTORY?.[0]?.games?.[0]?.date;
  return parseDateString(firstGameDate) || new Date();
})();

const formatDateLabel = (game) => {
  if (!game?.date) {
    return game.day || 'Date TBA';
  }

  const [year, month, day] = game.date.split('-');
  const monthIdx = Number(month) - 1;

  if (Number.isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) {
    return game.day || game.date;
  }

  const readableDay = Number(day);
  return `${game.day || ''}${game.day ? ' · ' : ''}${MONTHS[monthIdx]} ${Number.isNaN(readableDay) ? day : readableDay}`;
};

const ResultBadge = ({ result, scoreline }) => {
  const palette = {
    W: { bg: '#10B98120', text: '#0F9D58' },
    L: { bg: COLORS.primary + '15', text: COLORS.primary },
    D: { bg: COLORS.neutralLight + '30', text: COLORS.neutralDark },
  }[result] || { bg: COLORS.neutralLight + '30', text: COLORS.neutralDark };

  return (
    <View
      style={{
        backgroundColor: palette.bg,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.round,
      }}
    >
      <Text
        style={{
          color: palette.text,
          fontSize: TYPOGRAPHY.sizes.sm,
          fontWeight: TYPOGRAPHY.weights.semibold,
        }}
      >
        {result || '—'} {scoreline || ''}
      </Text>
    </View>
  );
};

const GameRow = ({ game }) => {
  const matchupPrefix = game.isHome ? 'vs' : '@';
  const scoreline =
    typeof game?.score?.hawks === 'number' && typeof game?.score?.opponent === 'number'
      ? `${game.score.hawks}-${game.score.opponent}`
      : '';

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.secondary,
        gap: SPACING.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            color: COLORS.text.secondary,
            marginBottom: 4,
          }}
        >
          {formatDateLabel(game)} · {game.kickoff || 'TBD'}
        </Text>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.lg,
            fontWeight: TYPOGRAPHY.weights.semibold,
            color: COLORS.text.primary,
          }}
        >
          {matchupPrefix} {game.opponent}
        </Text>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            color: COLORS.text.secondary,
            marginTop: 2,
          }}
        >
          {game.location}
        </Text>
        {game.notes ? (
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.sm,
              color: COLORS.text.secondary,
              marginTop: 4,
            }}
          >
            {game.notes}
          </Text>
        ) : null}
      </View>
      <View style={{ alignItems: 'flex-end', minWidth: 90 }}>
        <ResultBadge result={game.result} scoreline={scoreline} />
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            color: COLORS.text.secondary,
            marginTop: SPACING.xs,
            textAlign: 'right',
          }}
        >
          {game.isHome ? 'Home' : 'Away'}
        </Text>
      </View>
    </View>
  );
};

const SeasonCard = ({ season }) => {
  const { record = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 } } = season;
  return (
    <View
      style={{
        backgroundColor: COLORS.background.main,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.small,
      }}
    >
      <View
        style={{
          flexDirection: isDesktop() ? 'row' : 'column',
          justifyContent: 'space-between',
          gap: SPACING.sm,
          marginBottom: SPACING.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
            }}
          >
            {season.season} · {season.competition}
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.md,
              color: COLORS.text.secondary,
              marginTop: 2,
            }}
          >
            {season.division}
          </Text>
        </View>
        <View style={{ alignItems: isDesktop() ? 'flex-end' : 'flex-start' }}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.primary,
            }}
          >
            Record: {record.wins}-{record.draws}-{record.losses}
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.sm,
              color: COLORS.text.secondary,
              marginTop: 2,
            }}
          >
            Goals · {record.goalsFor} for / {record.goalsAgainst} against
          </Text>
        </View>
      </View>
      {season.games.map((game) => (
        <GameRow
          key={`${season.id}-${game.date}-${game.kickoff}-${game.opponent}`}
          game={game}
        />
      ))}
    </View>
  );
};

const groupEventsByDate = (matches = []) =>
  matches.reduce((acc, match) => {
    if (!match?.date) return acc;
    if (!acc[match.date]) acc[match.date] = [];

    acc[match.date].push({
      id: `${match.seasonId}-${match.date}-${match.opponent}-${acc[match.date].length}`,
      title: `${match.isHome ? 'vs' : '@'} ${match.opponent}`,
      details: `${match.kickoff || 'TBD'} · ${match.location}`,
      seasonLabel: match.seasonName,
    });

    return acc;
  }, {});

const CalendarDay = ({ day, events }) => (
  <View style={{ width: `${100 / 7}%`, padding: 4 }}>
    <View
      style={{
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: day.isCurrentMonth ? COLORS.background.tertiary : COLORS.background.secondary,
        backgroundColor: day.isCurrentMonth ? COLORS.background.main : COLORS.background.secondary,
        opacity: day.isCurrentMonth ? 1 : 0.65,
        minHeight: 96,
        padding: SPACING.xs,
        gap: SPACING.xs,
      }}
    >
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.sm,
          fontWeight: TYPOGRAPHY.weights.semibold,
          color: day.isToday ? COLORS.primary : COLORS.text.primary,
        }}
      >
        {day.display}
      </Text>
      {events?.map((event) => (
        <View
          key={event.id}
          style={{
            backgroundColor: COLORS.primary + '10',
            borderRadius: BORDER_RADIUS.sm,
            paddingHorizontal: SPACING.xs,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xs,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.primary,
            }}
          >
            {event.title}
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xs,
              color: COLORS.text.secondary,
            }}
          >
            {event.details}
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xs,
              color: COLORS.text.secondary,
            }}
          >
            {event.seasonLabel}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const CalendarWeekHeader = () => (
  <View
    style={{
      flexDirection: 'row',
      marginBottom: SPACING.xs,
    }}
  >
    {WEEKDAY_LABELS.map((label) => (
      <Text
        key={label}
        style={{
          width: `${100 / 7}%`,
          textAlign: 'center',
          fontSize: TYPOGRAPHY.sizes.sm,
          fontWeight: TYPOGRAPHY.weights.semibold,
          color: COLORS.text.secondary,
        }}
      >
        {label}
      </Text>
    ))}
  </View>
);

const StandingsHeader = () => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.xs,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.background.secondary,
    }}
  >
    <Text style={{ width: 24, fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.text.secondary }}>#</Text>
    <Text
      style={{
        flex: 1,
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.text.secondary,
      }}
    >
      Team
    </Text>
    <Text style={{ width: 32, textAlign: 'right', fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.text.secondary }}>
      GP
    </Text>
    <Text style={{ width: 40, textAlign: 'right', fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.text.secondary }}>
      Pts
    </Text>
    <Text style={{ width: 68, textAlign: 'right', fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.text.secondary }}>
      W-D-L
    </Text>
    <Text style={{ width: 72, textAlign: 'right', fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.text.secondary }}>
      GF-GA
    </Text>
    <Text style={{ width: 48, textAlign: 'right', fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.text.secondary }}>
      +/-
    </Text>
  </View>
);

const StandingsRow = ({ entry }) => {
  const isHawks = (entry.team || '').toLowerCase().includes('hawks');
  const record =
    entry.record || {
      wins: 0,
      draws: 0,
      losses: 0,
    };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.secondary,
        paddingHorizontal: isHawks ? SPACING.xs : 0,
        backgroundColor: isHawks ? COLORS.primary + '10' : 'transparent',
        borderRadius: isHawks ? BORDER_RADIUS.sm : 0,
      }}
    >
      <Text
        style={{
          width: 24,
          fontSize: TYPOGRAPHY.sizes.md,
          fontWeight: TYPOGRAPHY.weights.semibold,
          color: COLORS.text.primary,
        }}
      >
        {entry.rank}
      </Text>
      <View style={{ flex: 1, paddingRight: SPACING.sm }}>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.md,
            fontWeight: isHawks ? TYPOGRAPHY.weights.semibold : TYPOGRAPHY.weights.medium,
            color: isHawks ? COLORS.primary : COLORS.text.primary,
          }}
        >
          {entry.team}
        </Text>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            color: COLORS.text.secondary,
          }}
        >
          {entry.club}
        </Text>
      </View>
      <Text style={{ width: 32, textAlign: 'right', color: COLORS.text.primary }}>{entry.gamesPlayed}</Text>
      <Text
        style={{
          width: 40,
          textAlign: 'right',
          color: isHawks ? COLORS.primary : COLORS.text.primary,
          fontWeight: isHawks ? TYPOGRAPHY.weights.semibold : TYPOGRAPHY.weights.medium,
        }}
      >
        {entry.points}
      </Text>
      <Text style={{ width: 68, textAlign: 'right', color: COLORS.text.primary }}>
        {record.wins}-{record.draws}-{record.losses}
      </Text>
      <Text style={{ width: 72, textAlign: 'right', color: COLORS.text.primary }}>
        {entry.goalsFor}-{entry.goalsAgainst}
      </Text>
      <Text style={{ width: 48, textAlign: 'right', color: COLORS.text.primary }}>
        {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
      </Text>
    </View>
  );
};

const StandingsCard = ({ table }) => (
  <View
    style={{
      backgroundColor: COLORS.background.main,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      ...SHADOWS.small,
    }}
  >
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.text.primary,
      }}
    >
      {table.season} · {table.division}
    </Text>
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.text.secondary,
        marginBottom: SPACING.md,
      }}
    >
      {table.league}
    </Text>
    <StandingsHeader />
    {table.entries.map((entry) => (
      <StandingsRow key={`${table.id}-${entry.rank}`} entry={entry} />
    ))}
  </View>
);

export default function TeamSection() {
  const promotionPulse = useRef(new Animated.Value(0)).current;
  const allMatches = useMemo(() => getAllMatches(), []);
  const eventsByDate = useMemo(() => groupEventsByDate(allMatches), [allMatches]);
  const [calendarMonth, setCalendarMonth] = useState(INITIAL_CALENDAR_DATE);
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);
  const monthLabel = `${MONTH_NAMES_FULL[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(promotionPulse, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(promotionPulse, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [promotionPulse]);

  const changeMonth = (delta) => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const promotionStyle = {
    opacity: promotionPulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.85, 1],
    }),
    transform: [
      {
        scale: promotionPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.03],
        }),
      },
    ],
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background.main }}
      contentContainerStyle={{
        paddingVertical: SPACING.xxl,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Container style={{ gap: SPACING.xxl }}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.xxl,
            ...SHADOWS.medium,
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxxl,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.text.white,
              marginBottom: SPACING.sm,
            }}
          >
            Smithtown Hawks U13
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              color: COLORS.text.white,
              marginBottom: SPACING.md,
            }}
          >
            {TEAM_HISTORY.currentSeason.season} · {TEAM_HISTORY.currentSeason.division}
          </Text>
          <Animated.View
            style={[
              {
                marginTop: SPACING.md,
                paddingHorizontal: SPACING.md,
                paddingVertical: SPACING.sm,
                borderRadius: BORDER_RADIUS.lg,
                backgroundColor: COLORS.text.white + '15',
                alignSelf: 'flex-start',
              },
              promotionStyle,
            ]}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.md,
                lineHeight: 22,
                color: COLORS.text.white,
                fontWeight: TYPOGRAPHY.weights.semibold,
              }}
            >
              {TEAM_HISTORY.highlight}
            </Text>
          </Animated.View>
        </View>

        <View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
              marginBottom: SPACING.lg,
            }}
          >
            Team Performance
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
              marginBottom: SPACING.sm,
            }}
          >
            Team Calendar
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.md,
              color: COLORS.text.secondary,
              marginBottom: SPACING.lg,
            }}
          >
            Tapping through the months lets you see every match day pulled from our static history files.
          </Text>
          <View
            style={{
              backgroundColor: COLORS.background.main,
              borderRadius: BORDER_RADIUS.xl,
              padding: SPACING.lg,
              ...SHADOWS.small,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: SPACING.sm,
              }}
            >
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                style={{
                  padding: SPACING.sm,
                  borderRadius: BORDER_RADIUS.round,
                  backgroundColor: COLORS.background.secondary,
                }}
              >
                <MaterialIcons name="chevron-left" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.lg,
                  fontWeight: TYPOGRAPHY.weights.semibold,
                  color: COLORS.text.primary,
                }}
              >
                {monthLabel}
              </Text>
              <TouchableOpacity
                onPress={() => changeMonth(1)}
                style={{
                  padding: SPACING.sm,
                  borderRadius: BORDER_RADIUS.round,
                  backgroundColor: COLORS.background.secondary,
                }}
              >
                <MaterialIcons name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <CalendarWeekHeader />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {calendarDays.map((day) => (
                <CalendarDay
                  key={day.key}
                  day={day}
                  events={eventsByDate[toDateKey(day.date)]}
                />
              ))}
            </View>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
              marginBottom: SPACING.sm,
            }}
          >
            Standings
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.md,
              color: COLORS.text.secondary,
              marginBottom: SPACING.lg,
            }}
          >
            Recent LIJSL tables showing the Hawks climbing from Division 7E to Division 4E without relying on a database.
          </Text>
          {STANDINGS.map((table) => (
            <StandingsCard key={table.id} table={table} />
          ))}
        </View>

        <View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
              marginBottom: SPACING.lg,
            }}
          >
            Roster
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}
          >
            {TEAM_ROSTER.map((player, index) => (
              <PlayerCard key={player.name} name={player.name} index={index} />
            ))}
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
              marginBottom: SPACING.sm,
            }}
          >
            Game History
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.md,
              color: COLORS.text.secondary,
              marginBottom: SPACING.lg,
            }}
          >
            Every match lives in static files so the site stays fast and remains friendly to offline-ready deployments.
          </Text>
          {GAME_HISTORY.map((season) => (
            <SeasonCard key={season.id} season={season} />
          ))}
        </View>
      </Container>
    </ScrollView>
  );
}
