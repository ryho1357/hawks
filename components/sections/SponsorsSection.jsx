import React from 'react';
import { ScrollView, View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import Container from '../ui/Container';
import { SPONSORS } from '../../constants/sponsors';

const SponsorCard = ({ sponsor }) => (
  <LinearGradient
    colors={['#FFFFFF', '#F8FBFF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      ...SHADOWS.small,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: BORDER_RADIUS.lg,
          backgroundColor: COLORS.background.secondary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: SPACING.md,
        }}
      >
        <Image
          source={require('../../assets/favicon.png')}
          resizeMode="contain"
          style={{ width: 36, height: 36, opacity: 0.85 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.xl,
            fontWeight: TYPOGRAPHY.weights.semibold,
            color: COLORS.text.primary,
          }}
        >
          {sponsor.name}
        </Text>
        <Text style={{ color: COLORS.text.secondary }}>{sponsor.contribution}</Text>
      </View>
    </View>
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.text.secondary,
        lineHeight: 22,
        marginBottom: SPACING.md,
      }}
    >
      {sponsor.description}
    </Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <MaterialIcons name="language" size={18} color={COLORS.primary} />
        <Text style={{ color: COLORS.primary }}>{sponsor.website.replace(/^https?:\/\//, '')}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <MaterialIcons name="mail" size={18} color={COLORS.primary} />
        <Text style={{ color: COLORS.primary }}>{sponsor.contact}</Text>
      </View>
    </View>
  </LinearGradient>
);

export default function SponsorsSection() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background.secondary }}
      contentContainerStyle={{ paddingVertical: SPACING.xxl, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Container style={{ gap: SPACING.xl }}>
        <LinearGradient
          colors={['#F35B5B', '#E02424', '#C81414']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.xl,
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
            Hawks Sponsors
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 24,
            }}
          >
            We are grateful for the local partners who invest in our players. These cards update as new supporters join the Hawks family.
          </Text>
        </LinearGradient>

        <View>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
              marginBottom: SPACING.md,
            }}
          >
            Current Partners
          </Text>
          <View style={{ gap: SPACING.md }}>
            {SPONSORS.map((sponsor) => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLORS.background.main,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.xl,
            ...SHADOWS.small,
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
              marginBottom: SPACING.sm,
            }}
          >
            Become a Sponsor
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.md,
              color: COLORS.text.secondary,
              lineHeight: 22,
            }}
          >
            Interested in supporting the Hawks? Reach out to coaching staff for packages covering training gear, tournament travel, and community events.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:ryanjhofman@gmail.com?subject=Sponsor%20Inquiry')}
            style={{
              marginTop: SPACING.lg,
              alignSelf: 'flex-start',
            }}
          >
            <LinearGradient
              colors={['#F35B5B', '#C81E1E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: BORDER_RADIUS.round,
                paddingVertical: SPACING.sm,
                paddingHorizontal: SPACING.lg,
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.xs,
              }}
            >
              <MaterialIcons name="mail" size={18} color={COLORS.text.white} />
              <Text
                style={{
                  color: COLORS.text.white,
                  fontWeight: TYPOGRAPHY.weights.semibold,
                }}
              >
                Email Coach Ryan
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Container>
    </ScrollView>
  );
}
