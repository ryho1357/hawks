import React from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import { CLUB_INFO, SCHEDULE_INFO, TEAM_STATS } from '../../constants/content';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { isDesktop } from '../../utils/responsive';

const ContactRow = ({ icon, label, value, onPress }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
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
        marginRight: SPACING.md,
      }}
    >
      <MaterialIcons name={icon} size={22} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.md,
          fontWeight: TYPOGRAPHY.weights.semibold,
          color: COLORS.text.primary,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.md,
          color: COLORS.text.secondary,
          marginTop: 2,
        }}
      >
        {value}
      </Text>
    </View>
    {onPress && (
      <Button
        title="Reach Out"
        size="small"
        onPress={onPress}
        style={{ minWidth: 110 }}
      />
    )}
  </View>
);

const PracticeCard = ({ session }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background.main,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      marginRight: SPACING.md,
      ...SHADOWS.small,
    }}
  >
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.text.primary,
      }}
    >
      {session.day}
    </Text>
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.text.secondary,
        marginTop: SPACING.xs,
      }}
    >
      {session.time}
    </Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm }}>
      <MaterialIcons
        name="place"
        size={18}
        color={COLORS.primary}
        style={{ marginRight: SPACING.xs }}
      />
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.md,
          color: COLORS.text.secondary,
        }}
      >
        {session.location}
      </Text>
    </View>
  </View>
);

export default function ContactSection() {
  const handleEmail = () => Linking.openURL(`mailto:${CLUB_INFO.email}`);

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
            Stay Connected
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              color: COLORS.text.white,
              marginBottom: SPACING.md,
            }}
          >
            We are always looking to connect with families, teams, and clubs who share our passion for development.
          </Text>
        <Button
          title="Email Coach Ryan"
          onPress={handleEmail}
          variant="secondary"
          style={{
            alignSelf: isDesktop() ? 'flex-start' : 'stretch',
            marginTop: SPACING.sm,
            backgroundColor: COLORS.text.white + '10',
            borderColor: COLORS.text.white,
          }}
          textStyle={{ color: COLORS.text.white }}
        />
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
            Contact Information
          </Text>
          <ContactRow
            icon="mail"
            label="General Inquiries"
            value={CLUB_INFO.email}
            onPress={handleEmail}
          />
          <ContactRow
            icon="sports-soccer"
            label="Latest Team Run"
            value={TEAM_STATS.streak}
          />
          <ContactRow
            icon="event"
            label="Next Match"
            value={`${SCHEDULE_INFO.nextGame.date} vs ${SCHEDULE_INFO.nextGame.opponent} · ${SCHEDULE_INFO.nextGame.location}`}
          />
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
            Training Schedule
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}
          >
            {SCHEDULE_INFO.practice.map((session) => (
              <PracticeCard key={session.day} session={session} />
            ))}
          </View>
        </View>
      </Container>
    </ScrollView>
  );
}
