import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text, Animated, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import { TEAM_STATS, TEAM_ROSTER, TEAM_HISTORY, INDOOR_PRACTICE_SCHEDULE } from '../../constants/content';
import { GAME_HISTORY, getAllMatches } from '../../constants/gameHistory';
import { STANDINGS } from '../../constants/standings';
import Container from '../ui/Container';
import { isDesktop, isTablet } from '../../utils/responsive';

const TOTAL_MATCHES = TEAM_HISTORY.totals.matchesPlayed || 0;
const percentLabel = (value) => `${value.toFixed(1)}%`;
const winPercentage = TOTAL_MATCHES ? percentLabel((TEAM_HISTORY.totals.wins / TOTAL_MATCHES) * 100) : '0%';
const nonLossPercentage = TOTAL_MATCHES
  ? percentLabel(((TOTAL_MATCHES - TEAM_HISTORY.totals.losses) / TOTAL_MATCHES) * 100)
  : '0%';

const stats = [
  {
    label: 'Matches Played',
    value: TEAM_HISTORY.totals.matchesPlayed,
    icon: 'calendar-today',
    accent: {
      gradient: ['#FFFFFF', '#F2F6FF'],
      iconBg: '#E0E7FF',
      iconColor: '#1D4ED8',
      valueColor: '#111827',
    },
  },
  {
    label: 'Wins',
    value: TEAM_HISTORY.totals.wins,
    icon: 'emoji-events',
    accent: {
      gradient: ['#FFF9E6', '#FFEAC2'],
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      valueColor: '#92400E',
    },
  },
  {
    label: 'Draws',
    value: TEAM_HISTORY.totals.draws,
    icon: 'handshake',
    accent: {
      gradient: ['#F7F7FF', '#ECECFF'],
      iconBg: '#E0E7FF',
      iconColor: '#4338CA',
      valueColor: '#312E81',
    },
  },
  {
    label: 'Goals Scored',
    value: TEAM_STATS.goalsScored,
    icon: 'sports-soccer',
    accent: {
      gradient: ['#FFF5F5', '#FFE5E5'],
      iconBg: '#FECACA',
      iconColor: '#B91C1C',
      valueColor: '#991B1B',
    },
  },
  {
    label: 'Goals Allowed',
    value: TEAM_STATS.goalsAllowed,
    icon: 'shield',
    accent: {
      gradient: ['#F5F3FF', '#EDE9FE'],
      iconBg: '#DDD6FE',
      iconColor: '#6D28D9',
      valueColor: '#4C1D95',
    },
  },
  {
    label: 'Clean Sheets',
    value: TEAM_STATS.cleanSheets,
    icon: 'cleaning-services',
    accent: {
      gradient: ['#F0FDF4', '#DCFCE7'],
      iconBg: '#BBF7D0',
      iconColor: '#15803D',
      valueColor: '#166534',
    },
  },
  {
    label: 'Win Percentage',
    value: winPercentage,
    icon: 'trending-up',
    accent: {
      gradient: ['#ECFEFF', '#CFFAFE'],
      iconBg: '#BAE6FD',
      iconColor: '#0284C7',
      valueColor: '#075985',
    },
  },
  {
    label: 'Non-Loss Percentage',
    value: nonLossPercentage,
    icon: 'check-circle',
    accent: {
      gradient: ['#FFF1F2', '#FFE4E6'],
      iconBg: '#FADCDC',
      iconColor: '#DB2777',
      valueColor: '#9D174D',
    },
  },
];

const SEASON_PLACEMENTS = {
  'spring-2025-lijsl': 1,
  'fall-2024-lijsl': 3,
};

const PLACEMENT_LABELS = {
  1: '1st Place Finish',
  2: '2nd Place Finish',
  3: '3rd Place Finish',
};

const MedalIcon = ({ place = 1, size = 20 }) => {
  const palette =
    {
      1: { fill: '#F4C542', border: '#D4A02B', text: '#FFFFFF' },
      2: { fill: '#C0C0C8', border: '#A0A0B0', text: '#1F2933' },
      3: { fill: '#C4702A', border: '#9C541A', text: '#FFF4E0' },
    }[place] || { fill: '#F4C542', border: '#D4A02B', text: '#FFFFFF' };

  const ribbonColors = ['#1F3C88', '#FFFFFF', '#E31B23'];
  const ribbonWidth = Math.max(2, size / 6);
  const ribbonHeight = Math.max(6, size / 2.5);

  return (
    <View style={{ alignItems: 'center', marginRight: SPACING.xs }}>
      <View style={{ flexDirection: 'row', marginBottom: size * 0.1 }}>
        {ribbonColors.map((color, idx) => (
          <View key={`${place}-ribbon-${idx}`} style={{ width: ribbonWidth, height: ribbonHeight, backgroundColor: color }} />
        ))}
      </View>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.fill,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: palette.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: size * 0.5,
            fontWeight: TYPOGRAPHY.weights.bold,
            color: palette.text,
          }}
        >
          {place}
        </Text>
      </View>
    </View>
  );
};

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

const StatCard = ({ label, value, icon, accent = {} }) => {
  const {
    gradient = ['#FFFFFF', '#F5F5F5'],
    iconBg = COLORS.background.secondary,
    iconColor = COLORS.primary,
    valueColor = COLORS.text.primary,
  } = accent;

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        minWidth: isDesktop() ? '30%' : '45%',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        marginRight: SPACING.md,
        ...SHADOWS.small,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: BORDER_RADIUS.round,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: SPACING.sm,
        }}
      >
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.xxxl,
          fontWeight: TYPOGRAPHY.weights.bold,
          color: valueColor,
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
    </LinearGradient>
  );
};

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

const formatEventDateLabel = (value) => {
  const date = parseDateString(value);
  if (!date) {
    return 'Date TBA';
  }
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const monthName = MONTH_NAMES_FULL[date.getMonth()];
  return `${weekday} · ${monthName} ${date.getDate()}`;
};

const ResultBadge = ({ result, scoreline }) => {
  const palette = {
    W: { bg: '#10B98120', text: '#0F9D58' },
    L: { bg: COLORS.primary + '15', text: COLORS.primary },
    D: { bg: COLORS.neutralLight + '30', text: COLORS.neutralDark },
  }[result] || { bg: COLORS.neutralLight + '30', text: COLORS.neutralDark };

  const iconName =
    {
      W: 'emoji-events',
      L: 'highlight-off',
      D: 'remove',
    }[result] || null;

  return (
    <View
      style={{
        backgroundColor: palette.bg,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.round,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
      }}
    >
      {iconName ? (
        <MaterialIcons name={iconName} size={16} color={palette.text} />
      ) : null}
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

const SeasonCard = ({ season, isExpanded, onToggle }) => {
  const { record = { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 } } = season;
  const isChampSeason = season.id === 'spring-2025-lijsl';
  const placement = SEASON_PLACEMENTS[season.id];
  const gradientColors = isChampSeason ? ['#FFF7EF', '#FFEFEA'] : ['#F9FBFF', '#FFFFFF'];
  const championBadges = isChampSeason
    ? [
        { label: 'Division Champions', color: COLORS.primary },
        { label: 'Undefeated Season', color: '#059669' },
      ]
    : [];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.small,
        position: 'relative',
      }}
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.9}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: SPACING.md,
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
          {placement && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.xs,
                marginTop: SPACING.xs,
                flexWrap: 'wrap',
              }}
            >
              {Array.from({ length: isChampSeason ? 3 : 1 }).map((_, idx) => (
                <MedalIcon
                  key={`${season.id}-header-medal-${idx}`}
                  place={placement}
                  size={isChampSeason ? 16 : 20}
                />
              ))}
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.sm,
                  fontWeight: TYPOGRAPHY.weights.semibold,
                  color: isChampSeason ? COLORS.primary : COLORS.text.secondary,
                }}
              >
                {isChampSeason ? 'Undefeated Division 6 Champions' : PLACEMENT_LABELS[placement] || 'Top Finish'}
              </Text>
            </View>
          )}
          {championBadges.length ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: SPACING.xs,
                marginTop: SPACING.xs,
              }}
            >
              {championBadges.map((badge) => (
                <View
                  key={`header-${badge.label}`}
                  style={{
                    backgroundColor: badge.color,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: 4,
                    borderRadius: BORDER_RADIUS.round,
                  }}
                >
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.sizes.xs,
                      fontWeight: TYPOGRAPHY.weights.semibold,
                      color: COLORS.text.white,
                      letterSpacing: 0.5,
                    }}
                  >
                    {badge.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            minWidth: isDesktop() ? 200 : undefined,
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.primary,
            }}
          >
            Record (W-L-D): {record.wins}-{record.losses}-{record.draws}
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
        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={COLORS.text.primary}
          style={{ marginTop: 2 }}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={{ marginTop: SPACING.lg }}>
          {season.games.map((game) => (
            <GameRow
              key={`${season.id}-${game.date}-${game.kickoff}-${game.opponent}`}
              game={game}
            />
          ))}
        </View>
      )}
    </LinearGradient>
  );
};

const buildMapsLink = (location) => {
  if (!location) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

const buildCalendarEvents = (matches = [], practices = []) => {
  const matchEvents = matches.map((match, index) => {
    const hasScore =
      typeof match?.score?.hawks === 'number' && typeof match?.score?.opponent === 'number';
    const scoreline = hasScore ? `${match.score.hawks}-${match.score.opponent}` : '';
    const locationLabel = match?.location || 'Location TBD';

    return {
      id: `${match.seasonId}-${match.date}-${match.opponent}-${index}`,
      date: match.date,
      title: `${match.isHome ? 'vs' : '@'} ${match.opponent}`,
      details: `${match.kickoff || 'TBD'} · ${locationLabel}`,
      seasonLabel: match.seasonName,
      type: 'game',
      result: match.result,
      scoreline,
      isPlayed: Boolean(scoreline || match.result),
      time: match?.kickoff || 'Time TBD',
      location: locationLabel,
      mapsUrl: buildMapsLink(match?.location),
      note: match?.notes || '',
    };
  });

  const practiceEvents = practices.map((session, index) => ({
    id: `practice-${session.date}-${index}`,
    date: session.date,
    title: session.title || 'Indoor Practice',
    details: `${session.time} · ${session.location || 'Location TBD'}`,
    seasonLabel: session.address || 'Indoor Training',
    type: 'practice',
    time: session?.time || 'Time TBD',
    location: session?.location || 'Location TBD',
    mapsUrl: buildMapsLink(session?.location),
    note: session?.address || '',
  }));

  return [...matchEvents, ...practiceEvents];
};

const groupEventsByDate = (events = []) =>
  events.reduce((acc, event) => {
    if (!event?.date) return acc;
    if (!acc[event.date]) acc[event.date] = [];

    acc[event.date].push(event);
    return acc;
  }, {});

const getEventPalette = (event) => {
  if (!event) {
    return {
      bg: COLORS.background.secondary,
      border: COLORS.background.tertiary,
      title: COLORS.text.primary,
      icon: 'event',
      resultColor: COLORS.text.secondary,
    };
  }

  if (event.type === 'practice') {
    return {
      bg: '#10B98120',
      border: '#10B98140',
      title: '#0F9D58',
      icon: 'event-available',
      resultColor: '#0F9D58',
    };
  }

  if (event.type === 'game' && event.isPlayed) {
    switch (event.result) {
      case 'W':
        return {
          bg: '#DCFCE7',
          border: '#86EFAC',
          title: '#166534',
          icon: 'emoji-events',
          resultColor: '#0F9D58',
        };
      case 'L':
        return {
          bg: '#FEE2E2',
          border: '#FECACA',
          title: '#B91C1C',
          icon: 'report',
          resultColor: '#B91C1C',
        };
      case 'D':
        return {
          bg: '#F3F4F6',
          border: '#E5E7EB',
          title: '#374151',
          icon: 'remove-circle-outline',
          resultColor: '#374151',
        };
      default:
        return {
          bg: '#E0F2FE',
          border: '#BAE6FD',
          title: COLORS.primary,
          icon: 'sports-soccer',
          resultColor: COLORS.primary,
        };
    }
  }

  return {
    bg: '#FEF9C3',
    border: '#FDE68A',
    title: '#92400E',
    icon: 'schedule',
    resultColor: '#92400E',
  };
};

const CalendarDay = ({ day, events, onEventPress }) => {
  const cellHeight = isDesktop() ? 130 : 110;
  return (
    <View style={{ width: `${100 / 7}%`, padding: 4 }}>
    <View
      style={{
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: day.isCurrentMonth ? COLORS.background.tertiary : COLORS.background.secondary,
        backgroundColor: day.isCurrentMonth ? COLORS.background.main : COLORS.background.secondary,
        opacity: day.isCurrentMonth ? 1 : 0.65,
        height: cellHeight,
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
      {events?.map((event) => {
        const palette = getEventPalette(event);
        return (
          <TouchableOpacity
            key={event.id}
            onPress={() => onEventPress?.(event)}
            activeOpacity={0.9}
            style={{
              backgroundColor: palette.bg,
              borderRadius: BORDER_RADIUS.sm,
              paddingHorizontal: SPACING.xs,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: palette.border,
              gap: 2,
              overflow: 'hidden',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialIcons name={palette.icon} size={12} color={palette.title} />
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.xs,
                  fontWeight: TYPOGRAPHY.weights.semibold,
                  color: palette.title,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {event.title}
              </Text>
            </View>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.xs,
                color: COLORS.text.secondary,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {event.details}
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.xs,
                color: COLORS.text.secondary,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {event.seasonLabel}
            </Text>
            {event.type === 'game' && event.isPlayed && event.scoreline ? (
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.xs,
                  fontWeight: TYPOGRAPHY.weights.semibold,
                  color: palette.resultColor,
                }}
              >
                {event.result ? `${event.result} · ${event.scoreline}` : event.scoreline}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
    </View>
  );
};

const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  const palette = getEventPalette(event);
  const dateLabel = formatEventDateLabel(event.date);
  const badgeLabel =
    event.type === 'practice'
      ? 'Training Session'
      : event.isPlayed
      ? 'Final Result'
      : 'Match Day';

  const resultLabel =
    event.type === 'game' && event.isPlayed && event.scoreline
      ? `${event.scoreline}${event.result ? ` · ${event.result}` : ''}`
      : null;

  const infoRows = [
    { icon: 'schedule', label: 'Time', value: event.time || 'Time TBD' },
    {
      icon: 'place',
      label: 'Location',
      value: event.location || 'Location TBD',
      link: event.mapsUrl,
    },
  ];

  return (
    <Modal visible transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'flex-end',
        }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        </TouchableWithoutFeedback>
        <View
          style={{
            backgroundColor: COLORS.background.main,
            borderTopLeftRadius: BORDER_RADIUS.xxl,
            borderTopRightRadius: BORDER_RADIUS.xxl,
            padding: SPACING.xl,
            gap: SPACING.md,
            ...SHADOWS.large,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.sm,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: BORDER_RADIUS.round,
                  backgroundColor: palette.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: palette.border,
                }}
              >
                <MaterialIcons name={palette.icon} size={20} color={palette.title} />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.sizes.xs,
                    fontWeight: TYPOGRAPHY.weights.semibold,
                    color: palette.title,
                    letterSpacing: 1,
                  }}
                >
                  {badgeLabel}
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.sizes.md,
                    color: COLORS.text.secondary,
                  }}
                >
                  {dateLabel}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={20} color={COLORS.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 4 }}>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.xxl,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.text.primary,
              }}
            >
              {event.title}
            </Text>
            {event.seasonLabel ? (
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.md,
                  color: COLORS.text.secondary,
                }}
              >
                {event.seasonLabel}
              </Text>
            ) : null}
            {resultLabel ? (
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.md,
                  fontWeight: TYPOGRAPHY.weights.semibold,
                  color: palette.resultColor,
                }}
              >
                {resultLabel}
              </Text>
            ) : null}
          </View>

          <View style={{ gap: SPACING.sm }}>
            {infoRows.map((row) => {
              const Wrapper = row.link ? TouchableOpacity : View;
              const wrapperProps = row.link
                ? {
                    onPress: () => {
                      if (row.link) {
                        Linking.openURL(row.link);
                      }
                    },
                    activeOpacity: 0.8,
                  }
                : {};
              return (
                <Wrapper
                  key={row.label}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SPACING.sm,
                  }}
                  {...wrapperProps}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: BORDER_RADIUS.round,
                      backgroundColor: COLORS.background.secondary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcons name={row.icon} size={18} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.sizes.xs,
                        color: COLORS.text.secondary,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {row.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: TYPOGRAPHY.sizes.md,
                        color: row.link ? COLORS.primary : COLORS.text.primary,
                        fontWeight: TYPOGRAPHY.weights.semibold,
                        textDecorationLine: row.link ? 'underline' : 'none',
                      }}
                    >
                      {row.value}
                    </Text>
                  </View>
                </Wrapper>
              );
            })}
          </View>

          {event.note ? (
            <Text
              style={{
                color: COLORS.text.secondary,
                lineHeight: 20,
              }}
            >
              {event.note}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

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
      W-L-D
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
  const normalizedTeam = (entry.team || '').toLowerCase();
  const isHawks = normalizedTeam.includes('smithtown hawks');
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
        {record.wins}-{record.losses}-{record.draws}
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

const STANDINGS_ACCENTS = [
  {
    gradient: ['#F5F9FF', '#E3EDFF'],
    border: '#C3DAFE',
    badgeBg: '#DBEAFE',
    badgeText: '#1D4ED8',
  },
  {
    gradient: ['#FFF5F5', '#FFE4E6'],
    border: '#FECACA',
    badgeBg: '#FEE2E2',
    badgeText: '#B91C1C',
  },
  {
    gradient: ['#F0FDF4', '#DCFCE7'],
    border: '#BBF7D0',
    badgeBg: '#BBF7D0',
    badgeText: '#166534',
  },
];

const formatOrdinal = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return value;
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
};

const StandingsCard = ({ table, isExpanded, onToggle, accentIndex = 0 }) => {
  const accent = STANDINGS_ACCENTS[accentIndex % STANDINGS_ACCENTS.length];
  const hawksEntry = table.entries.find((entry) =>
    (entry.team || '').toLowerCase().includes('smithtown hawks')
  );
  const hawksSummary = hawksEntry
    ? `${formatOrdinal(hawksEntry.rank)} · ${hawksEntry.points} pts`
    : null;

  return (
    <LinearGradient
      colors={accent.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: accent.border,
        ...SHADOWS.small,
      }}
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.9}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: SPACING.md,
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
            {table.season} · {table.division}
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.md,
              color: COLORS.text.secondary,
              marginTop: 2,
            }}
          >
            {table.league}
          </Text>
          {hawksSummary ? (
            <View
              style={{
                alignSelf: 'flex-start',
                marginTop: SPACING.xs,
                paddingHorizontal: SPACING.sm,
                paddingVertical: 4,
                borderRadius: BORDER_RADIUS.round,
                backgroundColor: accent.badgeBg,
              }}
            >
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.sm,
                  fontWeight: TYPOGRAPHY.weights.semibold,
                  color: accent.badgeText,
                }}
              >
                Hawks: {hawksSummary}
              </Text>
            </View>
          ) : null}
        </View>
        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={COLORS.text.primary}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={{ marginTop: SPACING.md }}>
          <StandingsHeader />
          {table.entries.map((entry) => (
            <StandingsRow key={`${table.id}-${entry.rank}`} entry={entry} />
          ))}
        </View>
      )}
    </LinearGradient>
  );
};

export default function TeamSection() {
  const promotionPulse = useRef(new Animated.Value(0)).current;
  const allMatches = useMemo(() => getAllMatches(), []);
  const calendarEvents = useMemo(
    () => buildCalendarEvents(allMatches, INDOOR_PRACTICE_SCHEDULE),
    [allMatches]
  );
  const eventsByDate = useMemo(() => groupEventsByDate(calendarEvents), [calendarEvents]);
  const [calendarMonth, setCalendarMonth] = useState(INITIAL_CALENDAR_DATE);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedSeasonIds, setExpandedSeasonIds] = useState(() => {
    const initialId = GAME_HISTORY?.[0]?.id;
    return new Set(initialId ? [initialId] : []);
  });
  const [expandedStandingsIds, setExpandedStandingsIds] = useState(() => {
    const initialId = STANDINGS?.[0]?.id;
    return new Set(initialId ? [initialId] : []);
  });
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

  const toggleSeason = (seasonId) => {
    setExpandedSeasonIds((prev) => {
      const next = new Set(prev);
      if (next.has(seasonId)) {
        next.delete(seasonId);
      } else {
        next.add(seasonId);
      }
      return next;
    });
  };

  const toggleStandings = (tableId) => {
    setExpandedStandingsIds((prev) => {
      const next = new Set(prev);
      if (next.has(tableId)) {
        next.delete(tableId);
      } else {
        next.add(tableId);
      }
      return next;
    });
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
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background.main }}
        contentContainerStyle={{
          paddingVertical: SPACING.xxl,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Container style={{ gap: SPACING.xxl }}>
        <LinearGradient
          colors={['#F35B5B', '#E02424', '#C81414']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.xxl,
            ...SHADOWS.medium,
            overflow: 'hidden',
          }}
        >
          <Image
            source={require('../../assets/favicon.png')}
            resizeMode="cover"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              opacity: 0.05,
            }}
            pointerEvents="none"
          />
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
        </LinearGradient>

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
                  onEventPress={setSelectedEvent}
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
            Recent LIJSL tables showing the Hawks climbing from Division 7E to Division 4E.
          </Text>
          {STANDINGS.map((table, index) => (
            <StandingsCard
              key={table.id}
              table={table}
              isExpanded={expandedStandingsIds.has(table.id)}
              onToggle={() => toggleStandings(table.id)}
              accentIndex={index}
            />
          ))}
        </View>

        {/* Roster Section 
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
        */}
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

          {GAME_HISTORY.map((season) => (
            <SeasonCard
              key={season.id}
              season={season}
              isExpanded={expandedSeasonIds.has(season.id)}
              onToggle={() => toggleSeason(season.id)}
            />
          ))}
        </View>
        </Container>
      </ScrollView>
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}
