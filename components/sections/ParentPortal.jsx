import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

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

const TEMP_ACCESS_CODES = {
  coach: 'hawks-coach',
  family: 'hawks-family',
};

const messageToneColor = {
  success: COLORS.status.completed,
  error: COLORS.primary,
  info: COLORS.text.secondary,
};

export default function ParentPortal() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginMessage, setLoginMessage] = useState(null);
  const router = useRouter();
  const { authenticated, role, login, logout } = useAuth();

  const updateField = (key, value) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  };

  const isCoach = role === 'coach';

  const handleLogin = () => {
    setLoginMessage(null);
    if (!credentials.username || !credentials.password) {
      setLoginMessage({
        text: 'Enter the email plus temporary code provided by the staff.',
        tone: 'error',
      });
      return;
    }

    const normalized = credentials.password.trim().toLowerCase();
    if (normalized === TEMP_ACCESS_CODES.coach) {
      login({ email: credentials.username, role: 'coach' });
      setLoginMessage({ text: 'Coach access granted. Evaluation dashboard unlocked.', tone: 'success' });
      router.replace('/evaluations');
    } else if (normalized === TEMP_ACCESS_CODES.family) {
      login({ email: credentials.username, role: 'family' });
      setLoginMessage({ text: 'Welcome back! Player content unlocked.', tone: 'success' });
      router.replace('/evaluations');
    } else {
      setLoginMessage({
        text: 'Access code not recognized. Contact staff for updated credentials.',
        tone: 'error',
      });
    }
  };

  const handleLogout = () => {
    logout();
    setCredentials({ username: '', password: '' });
    setLoginMessage({ text: 'You have been signed out.', tone: 'info' });
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
              gap: SPACING.lg,
            }}
          >
            <View style={{ gap: SPACING.sm }}>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.md,
                  color: COLORS.text.secondary,
                }}
              >
                Portal access is limited to active Hawks families. Use the temporary codes while we
                wire up Appwrite auth: <Text style={{ fontWeight: TYPOGRAPHY.weights.semibold }}>hawks-family</Text> for
                guardians or <Text style={{ fontWeight: TYPOGRAPHY.weights.semibold }}>hawks-coach</Text> for staff.
              </Text>
              {!!loginMessage && (
                <Text
                  style={{
                    color: messageToneColor[loginMessage.tone || 'info'],
                    fontSize: TYPOGRAPHY.sizes.sm,
                  }}
                >
                  {loginMessage.text}
                </Text>
              )}
            </View>

            {!authenticated ? (
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
                    Email
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
                    Access Code
                  </Text>
                  <TextInput
                    placeholder="Temporary access code"
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
                  title="Sign In"
                  onPress={handleLogin}
                  style={{
                    borderRadius: BORDER_RADIUS.round,
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  padding: SPACING.lg,
                  backgroundColor: COLORS.background.secondary,
                  borderRadius: BORDER_RADIUS.lg,
                  gap: SPACING.md,
                }}
              >
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.sizes.lg,
                    fontWeight: TYPOGRAPHY.weights.semibold,
                    color: COLORS.text.primary,
                  }}
                >
                  Logged in as {isCoach ? 'Coach' : 'Family'} Account
                </Text>
                <Text style={{ color: COLORS.text.secondary }}>
                  {isCoach
                    ? 'Head to the evaluation dashboard to work through charts, focus badges, and quick edit tools.'
                    : 'Open the secure evaluation dashboard to view your player card and notes.'}
                </Text>
                <Button
                  title="Open Player Evaluations"
                  onPress={() => router.push('/evaluations')}
                  style={{ borderRadius: BORDER_RADIUS.round }}
                />
                <Button
                  title="Sign Out"
                  variant="secondary"
                  onPress={handleLogout}
                  style={{ borderRadius: BORDER_RADIUS.round }}
                />
              </View>
            )}
          </View>
        </View>
      </Container>
    </ScrollView>
  );
}
