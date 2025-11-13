import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import { CLUB_INFO, TEAM_PILLARS, COACHING_PHILOSOPHY, TEAM_HISTORY } from '../../constants/content';
import Container from '../ui/Container';
import { isDesktop } from '../../utils/responsive';

const ICON_MAP = {
  trophy: 'emoji-events',
  users: 'groups',
  activity: 'fitness-center',
  target: 'center-focus-strong',
};

const PillarCard = ({ pillar }) => {
  const iconName = ICON_MAP[pillar.icon] || 'sports-soccer';

  return (
    <View
      style={{
        flex: 1,
        minWidth: isDesktop() ? '45%' : '100%',
        backgroundColor: COLORS.background.main,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.small,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: BORDER_RADIUS.round,
          backgroundColor: COLORS.primary + '10',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: SPACING.md,
        }}
      >
        <MaterialIcons name={iconName} size={22} color={COLORS.primary} />
      </View>
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.xl,
          fontWeight: TYPOGRAPHY.weights.semibold,
          color: COLORS.text.primary,
          marginBottom: SPACING.sm,
        }}
      >
        {pillar.title}
      </Text>
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.md,
          lineHeight: 22,
          color: COLORS.text.secondary,
        }}
      >
        {pillar.description}
      </Text>
    </View>
  );
};

const LeadershipCard = ({ leader }) => (
  <View
    style={{
      backgroundColor: COLORS.background.main,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      ...SHADOWS.small,
    }}
  >
    {/* Icon at the top */}
    <Ionicons
      name="football" // This is the soccer ball icon in Ionicons
      size={64}
      color={COLORS.primary}
      style={{ alignSelf: 'center', marginBottom: SPACING.md }}
    />
    
    {/* Name */}
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.text.primary,
        textAlign: 'center',
        marginBottom: SPACING.xs,
      }}
    >
      {leader.name}
    </Text>
    
    {/* Title */}
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.lg,
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: SPACING.md,
        fontWeight: TYPOGRAPHY.weights.medium,
      }}
    >
      {leader.title}
    </Text>
    
    {/* Bio */}
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.md,
        lineHeight: 22,
        color: COLORS.text.secondary,
        textAlign: 'center',
      }}
    >
      {leader.bio}
    </Text>
  </View>
);

export default function AboutSection() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background.secondary }}
      contentContainerStyle={{
        paddingVertical: SPACING.xxl,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Container style={{ gap: SPACING.xxl }}>
        <View
          style={{
            backgroundColor: COLORS.background.main,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.xxl,
            ...SHADOWS.medium,
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxxl,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.primary,
              marginBottom: SPACING.sm,
              textAlign: 'center',
            }}
          >
            About the Hawks
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
              textAlign: 'center',
              marginBottom: SPACING.md,
            }}
          >
            {CLUB_INFO.tagline}
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              lineHeight: 24,
              color: COLORS.text.secondary,
              textAlign: 'center',
            }}
          >
            {CLUB_INFO.description}
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
            Our Pillars
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: SPACING.md,
            }}
          >
            {TEAM_PILLARS.map((pillar) => (
              <PillarCard key={pillar.title} pillar={pillar} />
            ))}
          </View>
        </View>

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
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.white,
              marginBottom: SPACING.sm,
            }}
          >
            Current Season Snapshot
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              color: COLORS.text.white,
              marginBottom: SPACING.sm,
            }}
          >
            {TEAM_HISTORY.currentSeason.season} · {TEAM_HISTORY.currentSeason.division}
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.md,
              color: COLORS.text.white,
              lineHeight: 22,
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
              marginBottom: SPACING.md,
            }}
          >
            Coaching Philosophy
          </Text>
          <View
            style={{
              backgroundColor: COLORS.background.main,
              borderRadius: BORDER_RADIUS.xl,
              padding: SPACING.xxl,
              ...SHADOWS.small,
            }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.lg,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.text.primary,
                marginBottom: SPACING.md,
              }}
            >
              {COACHING_PHILOSOPHY.headline}
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.md,
                lineHeight: 22,
                color: COLORS.text.secondary,
                marginBottom: SPACING.md,
              }}
            >
              {COACHING_PHILOSOPHY.description}
            </Text>
            <View style={{ gap: SPACING.sm }}>
              {COACHING_PHILOSOPHY.values.map((value) => (
                <View
                  key={value}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.background.secondary,
                    borderRadius: BORDER_RADIUS.lg,
                    padding: SPACING.md,
                    borderWidth: 1,
                    borderColor: COLORS.background.tertiary,
                  }}
                >
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={COLORS.primary}
                    style={{ marginRight: SPACING.sm }}
                  />
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.sizes.md,
                      color: COLORS.text.primary,
                      fontWeight: TYPOGRAPHY.weights.medium,
                    }}
                  >
                    {value}
                  </Text>
                </View>
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
              marginBottom: SPACING.md,
            }}
          >
            Program Leadership
          </Text>
          {CLUB_INFO.leadership.map((leader) => (
            <LeadershipCard key={leader.name} leader={leader} />
          ))}
        </View>
      </Container>
    </ScrollView>
  );
}
