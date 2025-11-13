import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import { CLUB_INFO, TEAM_PILLARS, COACHING_PHILOSOPHY } from '../../constants/content';
import Container from '../ui/Container';
import { isDesktop } from '../../utils/responsive';

const ICON_MAP = {
  trophy: 'emoji-events',
  users: 'groups',
  activity: 'fitness-center',
  target: 'center-focus-strong',
};

const PillarCard = ({ pillar, index }) => {
  const iconName = ICON_MAP[pillar.icon] || 'sports-soccer';
  const palettes = [
    { gradient: ['#FFF7ED', '#FFE4E6'], iconBg: '#FED7AA' },
    { gradient: ['#EEF2FF', '#E0E7FF'], iconBg: '#C7D2FE' },
    { gradient: ['#ECFCCB', '#DCFCE7'], iconBg: '#A7F3D0' },
    { gradient: ['#E0F2FE', '#BAE6FD'], iconBg: '#BFDBFE' },
  ];
  const palette = palettes[index % palettes.length];

  return (
    <LinearGradient
      colors={palette.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        minWidth: isDesktop() ? '45%' : '100%',
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
          backgroundColor: palette.iconBg,
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
    </LinearGradient>
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
              textAlign: 'center',
            }}
          >
            About the Hawks
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.white,
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
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
            }}
          >
            {CLUB_INFO.description}
          </Text>
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
            {TEAM_PILLARS.map((pillar, index) => (
              <PillarCard key={pillar.title} pillar={pillar} index={index} />
            ))}
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
            Coaching Philosophy
          </Text>
          <LinearGradient
            colors={['#F8FBFF', '#EDF7FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
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
                <LinearGradient
                  key={value}
                  colors={['#FFF7ED', '#FFE4E6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: BORDER_RADIUS.lg,
                    padding: SPACING.md,
                    borderWidth: 1,
                    borderColor: '#FED7AA',
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
                </LinearGradient>
              ))}
            </View>
          </LinearGradient>
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
