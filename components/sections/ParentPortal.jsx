import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import Container from '../ui/Container';
import Button from '../ui/Button';

const AccessRow = ({ icon, title, description }) => (
  <View
    style={{
      flex: 1,
      minWidth: 260,
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
        marginBottom: SPACING.sm,
      }}
    >
      <MaterialIcons name={icon} size={22} color={COLORS.primary} />
    </View>
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.text.secondary,
        lineHeight: 22,
      }}
    >
      {description}
    </Text>
  </View>
);

export default function ParentPortal() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const updateField = (key, value) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background.secondary }}
      contentContainerStyle={{ paddingVertical: SPACING.xl, flexGrow: 1 }}
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
              marginBottom: SPACING.xs,
            }}
          >
            Parent Portal
          </Text>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 24,
            }}
          >
            Secure access for Smithtown Hawks families to review team media, player development notes, and protected updates.
          </Text>
        </LinearGradient>

        <View style={{ gap: SPACING.md }}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
            }}
          >
            What’s Inside
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
            <AccessRow
              icon="photo-library"
              title="Team Media"
              description="Weekly galleries and highlight reels captured from training and matches."
            />
            <AccessRow
              icon="bar-chart"
              title="Player Cards"
              description="Individual progress notes, overall ratings, and development checkpoints."
            />
            <AccessRow
              icon="lock"
              title="Protected Updates"
              description="Internal announcements, travel notes, and private event logistics."
            />
          </View>
        </View>

        <View style={{ gap: SPACING.md }}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
            }}
          >
            Login
          </Text>
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
                fontSize: TYPOGRAPHY.sizes.md,
                color: COLORS.text.secondary,
                marginBottom: SPACING.lg,
              }}
            >
              Portal access is limited to current Hawks families. Credentials will be distributed by staff once secure authentication launches.
            </Text>

            <View style={{ gap: SPACING.lg }}>
              <View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.sizes.sm,
                    color: COLORS.text.secondary,
                    marginBottom: SPACING.xs,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Username
                </Text>
                <TextInput
                  placeholder="family@hawks.com"
                  placeholderTextColor={COLORS.text.secondary + '80'}
                  value={credentials.username}
                  onChangeText={(text) => updateField('username', text)}
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.background.tertiary,
                    borderRadius: BORDER_RADIUS.lg,
                    padding: SPACING.md,
                    fontSize: TYPOGRAPHY.sizes.md,
                    color: COLORS.text.primary,
                    backgroundColor: COLORS.background.secondary,
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.sizes.sm,
                    color: COLORS.text.secondary,
                    marginBottom: SPACING.xs,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Password
                </Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.text.secondary + '80'}
                  secureTextEntry
                  value={credentials.password}
                  onChangeText={(text) => updateField('password', text)}
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.background.tertiary,
                    borderRadius: BORDER_RADIUS.lg,
                    padding: SPACING.md,
                    fontSize: TYPOGRAPHY.sizes.md,
                    color: COLORS.text.primary,
                    backgroundColor: COLORS.background.secondary,
                  }}
                />
              </View>

              <Button
                title="Portal Coming Soon"
                disabled
                style={{
                  backgroundColor: COLORS.text.secondary + '40',
                  borderColor: 'transparent',
                  borderRadius: BORDER_RADIUS.round,
                }}
                textStyle={{ color: COLORS.text.white }}
              />
            </View>
          </View>
        </View>
      </Container>
    </ScrollView>
  );
}
