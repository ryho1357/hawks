import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../../constants/design-system';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import PlayerEvaluationCard from './PlayerEvaluationCard';
import CoachEvaluationBoard from './CoachEvaluationBoard';
import {
  PLAYER_ROSTER,
  PLAYER_EVALUATION_MAP,
  DEFAULT_FAMILY_PLAYER_ID,
} from '../../data/playerEvaluationSample';
import { PLAYER_EVALUATION_GROUPS } from '../../constants/playerEvaluation';
import { getPlayerTotalPoints } from '../../utils/playerEvaluation';
import { loadEvaluations, savePlayerEvaluation } from '../../services/playerEvaluationStorage';

export default function EvaluationDashboard() {
  const router = useRouter();
  const { authenticated, role, logout } = useAuth();
  const [evaluationsByPlayer, setEvaluationsByPlayer] = useState(PLAYER_EVALUATION_MAP);
  const [loading, setLoading] = useState(true);
  const isCoach = role === 'coach';
  const familyPlayerId = DEFAULT_FAMILY_PLAYER_ID || PLAYER_ROSTER[0]?.id;
  const familyPlayerMeta = PLAYER_ROSTER.find((player) => player.id === familyPlayerId) || PLAYER_ROSTER[0];
  const familyEvaluation = familyPlayerId ? evaluationsByPlayer[familyPlayerId] : null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await loadEvaluations();
      if (mounted) {
        setEvaluationsByPlayer(stored);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const leaderboard = useMemo(
    () =>
      PLAYER_ROSTER.map((player) => {
        const evaluation = evaluationsByPlayer[player.id];
        return {
          ...player,
          totalPoints: evaluation ? getPlayerTotalPoints(evaluation.scores || {}) : 0,
        };
      }).sort((a, b) => b.totalPoints - a.totalPoints),
    [evaluationsByPlayer]
  );

  const handleSignOut = () => {
    logout();
    router.replace('/portal');
  };

  if (!authenticated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background.secondary,
          alignItems: 'center',
          justifyContent: 'center',
          padding: SPACING.xl,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.background.main,
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.xl,
            width: '100%',
            maxWidth: 520,
            ...SHADOWS.medium,
            gap: SPACING.md,
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxxl,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.text.primary,
            }}
          >
            Protected Area
          </Text>
          <Text style={{ color: COLORS.text.secondary, fontSize: TYPOGRAPHY.sizes.md }}>
            Sign into the Parent Portal first, then return here to view Hawks player evaluations.
          </Text>
          <Button title="Go to Portal" onPress={() => router.replace('/portal')} />
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background.secondary,
          alignItems: 'center',
          justifyContent: 'center',
          padding: SPACING.xl,
        }}
      >
        <Text style={{ color: COLORS.text.secondary }}>Loading Hawks points…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background.secondary }}
      contentContainerStyle={{ paddingVertical: SPACING.xl }}
      showsVerticalScrollIndicator={false}
    >
      <Container style={{ gap: SPACING.xl }}>
        <View
          style={{
            backgroundColor: COLORS.background.main,
            padding: SPACING.lg,
            borderRadius: BORDER_RADIUS.xl,
            ...SHADOWS.small,
            gap: SPACING.xs,
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxxl,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.text.primary,
            }}
          >
            Player Evaluation Hub
          </Text>
          <Text style={{ color: COLORS.text.secondary, fontSize: TYPOGRAPHY.sizes.md }}>
            {isCoach
              ? 'Coach utilities: roster grid, focus badges, and quick-edit metric grid.'
              : 'Family view: live card with ratings, trends, and notes from the coaching staff.'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: SPACING.md,
          }}
        >
          <Text style={{ color: COLORS.text.secondary }}>
            Signed in as {isCoach ? 'Coach' : 'Family'} account
          </Text>
          <Button
            title="Sign Out"
            variant="secondary"
            onPress={handleSignOut}
            style={{ borderRadius: BORDER_RADIUS.round }}
          />
        </View>

        {isCoach ? (
          <CoachEvaluationBoard
            roster={PLAYER_ROSTER}
            evaluationsByPlayer={evaluationsByPlayer}
            onSavePlayer={async (playerId, payload) => {
              setEvaluationsByPlayer((prev) => ({
                ...prev,
                [playerId]: { ...(prev[playerId] || {}), ...payload },
              }));
              await savePlayerEvaluation(playerId, payload);
            }}
          />
        ) : (
          <>
            <PlayerEvaluationCard
              player={{ ...familyPlayerMeta, ...(familyEvaluation || {}) }}
              initialEvaluations={familyEvaluation || {}}
              canEdit={false}
            />
            <View
              style={{
                backgroundColor: COLORS.background.main,
                borderRadius: BORDER_RADIUS.xl,
                padding: SPACING.lg,
                ...SHADOWS.small,
                gap: SPACING.md,
              }}
            >
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.xl,
                  fontWeight: TYPOGRAPHY.weights.semibold,
                  color: COLORS.text.primary,
                }}
              >
                Hawks Leaderboard
              </Text>
              {leaderboard.slice(0, 5).map((entry, index) => (
                <View
                  key={`leader-${entry.id}`}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: SPACING.xs,
                    borderBottomWidth: index === 4 ? 0 : 1,
                    borderBottomColor: COLORS.background.tertiary,
                  }}
                >
                  <Text style={{ color: COLORS.text.primary }}>
                    {index + 1}. {entry.name}
                  </Text>
                  <Text style={{ color: COLORS.text.secondary }}>
                    {entry.totalPoints.toLocaleString()} pts
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={{ color: COLORS.text.secondary }}>
          {isCoach
            ? 'Updates save locally for now. Wire up Appwrite storage to sync cards across staff devices.'
            : 'Your view is read-only. Coaches share updates instantly after reviews are published.'}
        </Text>

        <View
          style={{
            backgroundColor: COLORS.background.main,
            padding: SPACING.lg,
            borderRadius: BORDER_RADIUS.xl,
            ...SHADOWS.small,
            gap: SPACING.md,
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xl,
              fontWeight: TYPOGRAPHY.weights.semibold,
              color: COLORS.text.primary,
            }}
          >
            Category Definitions
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
            {PLAYER_EVALUATION_GROUPS.map((group) => (
              <View
                key={group.title}
                style={{
                  flex: 1,
                  minWidth: 220,
                  borderWidth: 1,
                  borderColor: COLORS.background.tertiary,
                  borderRadius: BORDER_RADIUS.lg,
                  padding: SPACING.md,
                }}
              >
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.sizes.lg,
                    fontWeight: TYPOGRAPHY.weights.semibold,
                    color: COLORS.text.primary,
                    marginBottom: SPACING.xs,
                  }}
                >
                  {group.title}
                </Text>
                <Text style={{ color: COLORS.text.secondary }}>{group.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </Container>
    </ScrollView>
  );
}
