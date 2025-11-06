import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import { TEAM_STATS, TEAM_ROSTER, TEAM_HISTORY } from '../../constants/content';
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

const PlayerCard = ({ name, index }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

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
          {name}
        </Text>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            color: COLORS.text.secondary,
            marginTop: 2,
          }}
        >
          Player #{index + 1}
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

export default function TeamSection() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.secondaryLight }}
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
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.md,
              lineHeight: 22,
              color: COLORS.text.white,
            }}
          >
            {TEAM_HISTORY.highlight}
          </Text>
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
      </Container>
    </ScrollView>
  );
}
