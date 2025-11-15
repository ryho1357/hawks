import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import { PLAYER_EVALUATION_GROUPS } from '../../constants/playerEvaluation';
import {
  buildInitialScoreMap,
  clampEvaluationValue,
  buildGroupTotals,
  getMetricMeta,
  sortMetricsByScore,
  getPlayerTotalPoints,
} from '../../utils/playerEvaluation';
import Button from '../ui/Button';

const PlayerBadge = ({ player, active, selected, summaryScore, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: '31%',
      minWidth: 160,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: active ? COLORS.primary : COLORS.background.tertiary,
      backgroundColor: selected ? COLORS.primary + '10' : COLORS.background.main,
      ...SHADOWS.small,
      position: 'relative',
    }}
  >
    {selected && (
      <MaterialIcons
        name="check-circle"
        size={20}
        color={COLORS.primary}
        style={{ position: 'absolute', top: 8, right: 8 }}
      />
    )}
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.text.primary,
      }}
    >
      #{player.number} {player.name}
    </Text>
    <Text style={{ color: COLORS.text.secondary }}>{player.position}</Text>
    <Text style={{ color: COLORS.text.secondary, fontSize: TYPOGRAPHY.sizes.sm }}>
      {player.roleTag}
    </Text>
    <View
      style={{
        marginTop: SPACING.sm,
        paddingVertical: 4,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: '#EEF2FF',
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weights.semibold }}>
        {Math.round(summaryScore).toLocaleString()} pts
      </Text>
    </View>
  </TouchableOpacity>
);

const MetricChip = ({ metric, value, onAdjust }) => (
  <View
    key={metric.key}
    style={{
      width: '48%',
      backgroundColor: COLORS.background.secondary,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.background.tertiary,
    }}
  >
    <Text
      style={{
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}
    >
      {metric.label}
    </Text>
    <Text style={{ color: COLORS.text.secondary, fontSize: TYPOGRAPHY.sizes.sm, marginBottom: SPACING.sm }}>
      {metric.description}
    </Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View
        style={{
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.xs,
          borderRadius: BORDER_RADIUS.round,
          backgroundColor: COLORS.primary + '10',
        }}
      >
        <Text style={{ fontSize: TYPOGRAPHY.sizes.xl, fontWeight: TYPOGRAPHY.weights.bold, color: COLORS.primary }}>
          {value}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
        <TouchableOpacity
          onPress={() => onAdjust(metric.key, -1)}
          style={{
            width: 32,
            height: 32,
            borderRadius: BORDER_RADIUS.round,
            borderWidth: 1,
            borderColor: COLORS.background.tertiary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="remove" size={18} color={COLORS.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onAdjust(metric.key, 1)}
          style={{
            width: 32,
            height: 32,
            borderRadius: BORDER_RADIUS.round,
            borderWidth: 1,
            borderColor: COLORS.background.tertiary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="add" size={18} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function CoachEvaluationBoard({
  roster = [],
  evaluationsByPlayer = {},
  onSavePlayer,
}) {
  const initialPlayerId = roster[0]?.id || null;
  const [activePlayerId, setActivePlayerId] = useState(initialPlayerId);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState(
    initialPlayerId ? [initialPlayerId] : []
  );
  const [scores, setScores] = useState(() =>
    buildInitialScoreMap(evaluationsByPlayer[initialPlayerId]?.scores)
  );
  const [notes, setNotes] = useState(evaluationsByPlayer[initialPlayerId]?.notes || '');
  const [lastUpdated, setLastUpdated] = useState(
    evaluationsByPlayer[initialPlayerId]?.lastUpdated || null
  );
  const [status, setStatus] = useState('saved');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedMetricKey, setSelectedMetricKey] = useState(
    PLAYER_EVALUATION_GROUPS[0]?.metrics[0]?.key || null
  );
  const [pointsInput, setPointsInput] = useState('');
  const [awardMessage, setAwardMessage] = useState('');

  useEffect(() => {
    if (!activePlayerId && roster.length) {
      setActivePlayerId(roster[0].id);
    }
    if (!selectedPlayerIds.length && roster.length) {
      setSelectedPlayerIds([roster[0].id]);
    }
  }, [activePlayerId, selectedPlayerIds.length, roster]);

  const activePlayer = roster.find((player) => player.id === activePlayerId) || roster[0];

  useEffect(() => {
    if (!activePlayer) {
      return;
    }
    const activeEvaluation = evaluationsByPlayer[activePlayer.id];
    setScores(buildInitialScoreMap(activeEvaluation?.scores));
    setNotes(activeEvaluation?.notes || '');
    setLastUpdated(activeEvaluation?.lastUpdated || null);
    setStatus('saved');
  }, [activePlayer, evaluationsByPlayer]);

  useEffect(() => {
    const metrics = PLAYER_EVALUATION_GROUPS[selectedCategoryIndex]?.metrics || [];
    if (!metrics.length) {
      setSelectedMetricKey(null);
      return;
    }
    if (!metrics.find((metric) => metric.key === selectedMetricKey)) {
      setSelectedMetricKey(metrics[0].key);
    }
  }, [selectedCategoryIndex, selectedMetricKey]);

  const groupTotals = useMemo(() => buildGroupTotals(scores), [scores]);
  const overallPoints = useMemo(() => getPlayerTotalPoints(scores), [scores]);
  const orderedMetrics = useMemo(() => sortMetricsByScore(scores), [scores]);
  const topMetrics = orderedMetrics.slice(0, 3);
  const growthMetrics = orderedMetrics.slice(-3).reverse();
  const focusTags = orderedMetrics.slice(-6);
  const selectedNames = useMemo(
    () =>
      roster
        .filter((player) => selectedPlayerIds.includes(player.id))
        .map((player) => player.name)
        .join(', '),
    [roster, selectedPlayerIds]
  );
  const selectedCategory = PLAYER_EVALUATION_GROUPS[selectedCategoryIndex] || null;
  const selectedMetrics = selectedCategory?.metrics || [];

  const togglePlayerSelection = (playerId) => {
    setAwardMessage('');
    setSelectedPlayerIds((prev) => {
      let next;
      if (prev.includes(playerId)) {
        next = prev.filter((id) => id !== playerId);
        if (!next.length) {
          next = [playerId];
        }
      } else {
        next = [...prev, playerId];
      }
      return next;
    });
    setActivePlayerId(playerId);
  };

  const handleAwardPoints = async () => {
    const amount = parseInt(pointsInput, 10);
    if (!amount || !selectedMetricKey || !selectedPlayerIds.length) {
      setAwardMessage('Select players, a metric, and enter points to award.');
      return;
    }
    setAwardMessage('');
    const timestamp = new Date().toISOString();
    for (const playerId of selectedPlayerIds) {
      const existing = evaluationsByPlayer[playerId] || {};
      const currentScores = buildInitialScoreMap(existing.scores);
      const updatedScores = {
        ...currentScores,
        [selectedMetricKey]: clampEvaluationValue(
          (currentScores[selectedMetricKey] || 0) + amount
        ),
      };
      const payload = {
        ...existing,
        scores: updatedScores,
        lastUpdated: timestamp,
      };
      if (playerId === activePlayer?.id) {
        setScores(updatedScores);
        setLastUpdated(timestamp);
      }
      await onSavePlayer?.(playerId, payload);
    }
    setPointsInput('');
    setAwardMessage(`+${amount} pts added to ${selectedPlayerIds.length} player(s).`);
  };

  const adjustMetric = (key, delta) => {
    setScores((prev) => {
      const nextValue = clampEvaluationValue((prev[key] || 0) + delta);
      return { ...prev, [key]: nextValue };
    });
    setStatus('dirty');
  };

  const handleSave = () => {
    const payload = {
      scores,
      notes,
      lastUpdated: new Date().toISOString(),
    };
    setLastUpdated(payload.lastUpdated);
    setStatus('saved');
    if (activePlayer) {
      onSavePlayer?.(activePlayer.id, payload);
    }
  };

  return (
    <View style={{ gap: SPACING.lg }}>
      <View
        style={{
          backgroundColor: COLORS.background.main,
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.lg,
          ...SHADOWS.medium,
          gap: SPACING.md,
        }}
      >
        <Text style={{ fontSize: TYPOGRAPHY.sizes.xxl, fontWeight: TYPOGRAPHY.weights.semibold, color: COLORS.text.primary }}>
          Select Player
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
          {roster.map((player) => {
            const evaluation = evaluationsByPlayer[player.id];
            const totalPoints = evaluation ? getPlayerTotalPoints(evaluation.scores || {}) : 0;
            return (
              <PlayerBadge
                key={player.id}
                player={player}
                active={player.id === activePlayer?.id}
                selected={selectedPlayerIds.includes(player.id)}
                summaryScore={totalPoints}
                onPress={() => togglePlayerSelection(player.id)}
              />
            );
          })}
        </View>
      </View>

      <View
        style={{
          backgroundColor: COLORS.background.main,
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.lg,
          ...SHADOWS.medium,
          gap: SPACING.md,
        }}
      >
        <Text style={{ fontSize: TYPOGRAPHY.sizes.xl, fontWeight: TYPOGRAPHY.weights.semibold, color: COLORS.text.primary }}>
          Quick Reward
        </Text>
        <Text style={{ color: COLORS.text.secondary }}>
          Selected: {selectedNames || 'Choose at least one player'}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
          {PLAYER_EVALUATION_GROUPS.map((group, index) => (
            <TouchableOpacity
              key={group.title}
              onPress={() => setSelectedCategoryIndex(index)}
              style={{
                paddingHorizontal: SPACING.md,
                paddingVertical: SPACING.sm,
                borderRadius: BORDER_RADIUS.round,
                backgroundColor: index === selectedCategoryIndex ? COLORS.primary : COLORS.background.secondary,
              }}
            >
              <Text
                style={{
                  color: index === selectedCategoryIndex ? COLORS.text.white : COLORS.text.primary,
                  fontWeight: TYPOGRAPHY.weights.medium,
                }}
              >
                {group.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            {selectedMetrics.map((metric) => (
              <TouchableOpacity
                key={`award-${metric.key}`}
                onPress={() => setSelectedMetricKey(metric.key)}
                style={{
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  borderRadius: BORDER_RADIUS.round,
                  backgroundColor:
                    selectedMetricKey === metric.key ? COLORS.primary : COLORS.background.secondary,
                  borderWidth: 1,
                  borderColor:
                    selectedMetricKey === metric.key ? COLORS.primary : COLORS.background.tertiary,
                }}
              >
                <Text
                  style={{
                    color: selectedMetricKey === metric.key ? COLORS.text.white : COLORS.text.primary,
                    fontWeight: TYPOGRAPHY.weights.medium,
                  }}
                >
                  {metric.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
          <TextInput
            value={pointsInput}
            onChangeText={setPointsInput}
            placeholder="+10 pts"
            placeholderTextColor={COLORS.text.secondary + '80'}
            keyboardType="numeric"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: COLORS.background.tertiary,
              borderRadius: BORDER_RADIUS.lg,
              padding: SPACING.sm,
              color: COLORS.text.primary,
            }}
          />
          <Button
            title="Award Points"
            onPress={handleAwardPoints}
            style={{ minWidth: 160 }}
          />
        </View>
        {!!awardMessage && (
          <Text style={{ color: COLORS.text.secondary }}>{awardMessage}</Text>
        )}
      </View>

      <LinearGradient
        colors={['#111827', '#1F2937']}
        style={{
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.xl,
          ...SHADOWS.large,
          gap: SPACING.sm,
        }}
      >
        <Text style={{ fontSize: TYPOGRAPHY.sizes.xxxl, fontWeight: TYPOGRAPHY.weights.bold, color: COLORS.text.white }}>
          {activePlayer?.name}
        </Text>
        <Text style={{ color: COLORS.text.white }}>
          #{activePlayer?.number} • {activePlayer?.position} • {activePlayer?.roleTag}
        </Text>
        <Text style={{ color: COLORS.text.white, opacity: 0.75 }}>
          {activePlayer?.league} | {activePlayer?.seasonLabel}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md }}>
          {topMetrics.map(([metricKey, value]) => {
            const meta = getMetricMeta(metricKey);
            return (
              <View
                key={`medal-${metricKey}`}
                style={{
                  paddingHorizontal: SPACING.md,
                  paddingVertical: 6,
                  borderRadius: BORDER_RADIUS.round,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }}
              >
                <Text style={{ color: COLORS.text.white, fontWeight: TYPOGRAPHY.weights.semibold }}>
                  {meta.label} • {value} pts
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={{ color: COLORS.text.white, marginTop: SPACING.sm }}>
          Overall Points: {overallPoints.toLocaleString()} pts
        </Text>
        {lastUpdated && (
          <Text style={{ color: COLORS.text.white, opacity: 0.6, fontSize: TYPOGRAPHY.sizes.sm }}>
            Updated {new Date(lastUpdated).toLocaleDateString()}
          </Text>
        )}
      </LinearGradient>

      <View
        style={{
          backgroundColor: COLORS.background.main,
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.lg,
          ...SHADOWS.medium,
          gap: SPACING.md,
        }}
      >
        <Text style={{ fontSize: TYPOGRAPHY.sizes.xl, fontWeight: TYPOGRAPHY.weights.semibold, color: COLORS.text.primary }}>
          Focus Badges
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
          {focusTags.slice(0, 6).map(([metricKey, value]) => {
            const meta = getMetricMeta(metricKey);
            return (
              <View
                key={`focus-${metricKey}`}
                style={{
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  borderRadius: BORDER_RADIUS.round,
                  backgroundColor: '#FEF3C7',
                }}
              >
                <Text style={{ color: '#92400E', fontWeight: TYPOGRAPHY.weights.semibold }}>
                  {meta.label} • {value} pts
                </Text>
              </View>
            );
          })}
          {!focusTags.length && (
            <Text style={{ color: COLORS.text.secondary }}>No focus items tagged yet.</Text>
          )}
        </View>
        <Text style={{ fontSize: TYPOGRAPHY.sizes.lg, fontWeight: TYPOGRAPHY.weights.semibold, color: COLORS.text.primary }}>
          Growth Spotlight
        </Text>
        {growthMetrics.map(([metricKey, value]) => {
          const meta = getMetricMeta(metricKey);
          return (
            <View
              key={`growth-${metricKey}`}
              style={{
                padding: SPACING.md,
                borderRadius: BORDER_RADIUS.lg,
                borderWidth: 1,
                borderColor: COLORS.background.tertiary,
                marginBottom: SPACING.sm,
              }}
            >
              <Text style={{ fontSize: TYPOGRAPHY.sizes.md, fontWeight: TYPOGRAPHY.weights.semibold, color: COLORS.text.primary }}>
                {meta.label}
              </Text>
              <Text style={{ color: COLORS.text.secondary }}>
                Currently {value} pts. Add targeted reps this block.
              </Text>
            </View>
          );
        })}
      </View>

      <View
        style={{
          backgroundColor: COLORS.background.main,
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.lg,
          ...SHADOWS.medium,
        }}
      >
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.xl,
            fontWeight: TYPOGRAPHY.weights.semibold,
            color: COLORS.text.primary,
            marginBottom: SPACING.md,
          }}
        >
          Metric Grid
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: '100%' }}>
            {PLAYER_EVALUATION_GROUPS.map((group) => (
              <View
                key={group.title}
                style={{
                  paddingBottom: SPACING.md,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.background.tertiary,
                  marginBottom: SPACING.md,
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
                <Text style={{ color: COLORS.text.secondary, marginBottom: SPACING.xs }}>
                  {group.description}
                </Text>
                <Text style={{ color: COLORS.text.secondary, marginBottom: SPACING.sm }}>
                  {groupTotals[group.title]?.toLocaleString() || 0} pts logged
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {group.metrics.map((metric) => (
                    <MetricChip
                      key={metric.key}
                      metric={metric}
                      value={scores[metric.key]}
                      onAdjust={adjustMetric}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View
        style={{
          backgroundColor: COLORS.background.main,
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.lg,
          ...SHADOWS.medium,
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
          Notes & Action Items
        </Text>
        <TextInput
          value={notes}
          onChangeText={(text) => {
            setNotes(text);
            setStatus('dirty');
          }}
          placeholder="Training focus, match notes, and player check-ins."
          placeholderTextColor={COLORS.text.secondary + '80'}
          multiline
          style={{
            minHeight: 120,
            borderWidth: 1,
            borderColor: COLORS.background.tertiary,
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING.md,
            fontSize: TYPOGRAPHY.sizes.md,
            color: COLORS.text.primary,
            textAlignVertical: 'top',
          }}
        />
        <Button
          title={status === 'dirty' ? 'Save Player Update' : 'Saved'}
          onPress={handleSave}
          disabled={status !== 'dirty'}
          style={{ opacity: status === 'dirty' ? 1 : 0.7 }}
        />
        <Text style={{ color: COLORS.text.secondary, fontSize: TYPOGRAPHY.sizes.sm }}>
          {status === 'dirty'
            ? 'Unsaved changes'
            : `Saved ${lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'just now'}`}
        </Text>
      </View>
    </View>
  );
}
