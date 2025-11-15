import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/design-system';
import { PLAYER_EVALUATION_GROUPS, EVALUATION_SCALE } from '../../constants/playerEvaluation';
import Button from '../ui/Button';
import {
  buildInitialScoreMap,
  clampEvaluationValue,
  buildGroupTotals,
  sortMetricsByScore,
  getMetricMeta,
  getPlayerTotalPoints,
} from '../../utils/playerEvaluation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const getScoreColor = (value) => {
  if (value >= 4) {
    return COLORS.status.completed;
  }
  if (value >= 3) {
    return COLORS.status.pending;
  }
  return COLORS.primary;
};

const CategoryRing = ({ title, description, value }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const safeValue = typeof value === 'number' ? value : 0;
  const target = EVALUATION_SCALE.target || 50;
  const normalized = target ? Math.min(1, safeValue / target) : 1;
  const radius = 36;
  const strokeWidth = 8;
  const size = radius * 2 + strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: normalized,
      duration: 750,
      useNativeDriver: false,
    }).start();
  }, [normalized, progress]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View
      style={{
        flex: 1,
        minWidth: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.md,
        ...SHADOWS.small,
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          alignSelf: 'center',
          marginBottom: SPACING.sm,
        }}
      >
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.background.tertiary}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F59E0B"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.text.primary,
            }}
          >
            {Math.round(safeValue).toLocaleString()}
          </Text>
          <Text style={{ color: COLORS.text.secondary, fontSize: TYPOGRAPHY.sizes.sm }}>pts</Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.lg,
          fontWeight: TYPOGRAPHY.weights.semibold,
          color: COLORS.text.primary,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: TYPOGRAPHY.sizes.sm,
          color: COLORS.text.secondary,
          textAlign: 'center',
          marginTop: SPACING.xs,
        }}
      >
        {description}
      </Text>
    </View>
  );
};

const EvaluationMetric = ({ metric, value, canEdit, onAdjust }) => {
  const safeValue = typeof value === 'number' ? value : 0;
  const target = EVALUATION_SCALE.target || 50;
  const percentage = target ? Math.min(safeValue / target, 1) * 100 : 100;
  const barColor = getScoreColor(safeValue);
  return (
    <View
      key={metric.key}
      style={{
        marginBottom: SPACING.sm,
        paddingBottom: SPACING.sm,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.background.tertiary,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: SPACING.xs,
        }}
      >
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.md,
            color: COLORS.text.primary,
            fontWeight: TYPOGRAPHY.weights.medium,
          }}
        >
          {metric.label}
        </Text>
        <Text style={{ fontSize: TYPOGRAPHY.sizes.md, color: COLORS.text.secondary }}>
          {safeValue} pts
        </Text>
      </View>
      {metric.description && (
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            color: COLORS.text.secondary,
            marginBottom: SPACING.sm,
          }}
        >
          {metric.description}
        </Text>
      )}
      <View
        style={{
          height: 8,
          backgroundColor: COLORS.background.tertiary,
          borderRadius: BORDER_RADIUS.round,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: barColor,
          }}
        />
      </View>
      {canEdit && (
        <View style={{ flexDirection: 'row', marginTop: SPACING.sm, gap: SPACING.sm }}>
          <TouchableOpacity
            onPress={() => onAdjust(metric.key, -1)}
            style={{
              flex: 1,
              paddingVertical: SPACING.sm,
              borderWidth: 1,
              borderColor: COLORS.background.tertiary,
              borderRadius: BORDER_RADIUS.md,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: TYPOGRAPHY.sizes.md, color: COLORS.text.primary }}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onAdjust(metric.key, 1)}
            style={{
              flex: 1,
              paddingVertical: SPACING.sm,
              borderWidth: 1,
              borderColor: COLORS.background.tertiary,
              borderRadius: BORDER_RADIUS.md,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: TYPOGRAPHY.sizes.md, color: COLORS.text.primary }}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function PlayerEvaluationCard({
  player,
  initialEvaluations = {},
  canEdit = false,
  onSave,
}) {
  const [scores, setScores] = useState(() => buildInitialScoreMap(initialEvaluations.scores));
  const [notes, setNotes] = useState(initialEvaluations.notes || '');
  const [status, setStatus] = useState('saved');
  const [lastUpdated, setLastUpdated] = useState(initialEvaluations.lastUpdated || null);

  useEffect(() => {
    setScores(buildInitialScoreMap(initialEvaluations.scores));
    setNotes(initialEvaluations.notes || '');
    setLastUpdated(initialEvaluations.lastUpdated || null);
    setStatus('saved');
  }, [initialEvaluations]);

  const handleAdjust = (metricKey, delta) => {
    setScores((prev) => {
      const updated = clampEvaluationValue((prev[metricKey] ?? 0) + delta);
      return { ...prev, [metricKey]: updated };
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
    onSave?.(payload);
  };

  const summaryScores = useMemo(() => buildGroupTotals(scores), [scores]);
  const orderedMetrics = useMemo(() => sortMetricsByScore(scores), [scores]);
  const standoutMetrics = orderedMetrics.slice(0, 3);
  const focusMetrics = orderedMetrics.slice(-2).reverse();
  const divisionLabel = player.league || 'LIJSL Division 4E';
  const seasonLabel = player.seasonLabel || 'U13 Girls';
  const lastUpdatedDisplay = lastUpdated ? new Date(lastUpdated).toLocaleDateString() : null;
  const totalPoints = useMemo(() => getPlayerTotalPoints(scores), [scores]);

  return (
    <View
      style={{
        backgroundColor: '#F4F7FB',
        borderRadius: BORDER_RADIUS.xxl,
        padding: SPACING.lg,
        gap: SPACING.lg,
      }}
    >
      <LinearGradient
        colors={['#111b2c', '#1F2A44', '#B91C1C']}
        style={{
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.lg,
          ...SHADOWS.medium,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.lg }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.display,
                fontWeight: TYPOGRAPHY.weights.bold,
                color: COLORS.text.white,
              }}
            >
              {player.name}
            </Text>
            <Text style={{ color: COLORS.text.white, fontSize: TYPOGRAPHY.sizes.lg, marginTop: SPACING.xs }}>
              #{player.number} • {player.position}
            </Text>
            <Text style={{ color: COLORS.text.white, opacity: 0.8, marginTop: SPACING.xs }}>
              {seasonLabel} | {divisionLabel}
            </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.sm }}>
          {[player.roleTag, `${player.graduationYear} Grad`, `${player.footedness}-footed`]
            .filter(Boolean)
            .map((tag) => (
              <View
                    key={tag}
                    style={{
                      paddingHorizontal: SPACING.sm,
                      paddingVertical: 4,
                      borderRadius: BORDER_RADIUS.round,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    }}
                  >
                    <Text style={{ color: COLORS.text.white, fontSize: TYPOGRAPHY.sizes.sm }}>{tag}</Text>
                  </View>
            ))}
        </View>
        <View
          style={{
            marginTop: SPACING.md,
            padding: SPACING.sm,
            borderRadius: BORDER_RADIUS.lg,
            backgroundColor: 'rgba(255,255,255,0.1)',
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: COLORS.text.white, fontSize: TYPOGRAPHY.sizes.sm, opacity: 0.8 }}>
            Season Points
          </Text>
          <Text
            style={{
              color: COLORS.text.white,
              fontSize: TYPOGRAPHY.sizes.xxl,
              fontWeight: TYPOGRAPHY.weights.bold,
            }}
          >
            {totalPoints.toLocaleString()}
          </Text>
        </View>
          </View>
          <View
            style={{
              width: 140,
              borderRadius: BORDER_RADIUS.xl,
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: SPACING.md,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: COLORS.text.white, opacity: 0.8 }}>Program Focus</Text>
            <Text
              style={{
                color: COLORS.text.white,
                fontSize: TYPOGRAPHY.sizes.xxl,
                fontWeight: TYPOGRAPHY.weights.bold,
              }}
            >
              Creative 10
            </Text>
            <Text style={{ color: COLORS.text.white, opacity: 0.8, fontSize: TYPOGRAPHY.sizes.sm }}>
              D4E attacking mid
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: COLORS.text.white,
            marginTop: SPACING.md,
            lineHeight: 20,
          }}
        >
          Building composure for LIJSL D4E knockout play. Tracking how Avery links midfield to front
          line while staying relentless in transition moments.
        </Text>
        {lastUpdatedDisplay && (
          <Text style={{ color: COLORS.text.white, opacity: 0.7, marginTop: SPACING.sm, fontSize: TYPOGRAPHY.sizes.sm }}>
            Updated {lastUpdatedDisplay}
          </Text>
        )}
      </LinearGradient>

      <View
        style={{
          backgroundColor: COLORS.background.main,
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.lg,
          ...SHADOWS.small,
          gap: SPACING.md,
        }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.lg }}>
          <View style={{ flex: 1, minWidth: 200 }}>
            <Text style={{ fontSize: TYPOGRAPHY.sizes.lg, fontWeight: TYPOGRAPHY.weights.semibold, color: COLORS.text.primary }}>
              Top Strengths
            </Text>
            {standoutMetrics.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.sm }}>
                {standoutMetrics.map(([metricKey, value]) => {
                  const meta = getMetricMeta(metricKey);
                  return (
                    <View
                      key={`strength-${metricKey}`}
                      style={{
                        padding: SPACING.sm,
                        borderRadius: BORDER_RADIUS.lg,
                        backgroundColor: '#DCFCE7',
                        minWidth: 120,
                      }}
                    >
                      <Text style={{ fontWeight: TYPOGRAPHY.weights.semibold, color: '#15803D' }}>{meta.label}</Text>
                      <Text style={{ color: COLORS.text.secondary }}>{value} pts</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={{ color: COLORS.text.secondary, marginTop: SPACING.sm }}>
                Strength data will appear once we log the first eval.
              </Text>
            )}
          </View>
          <View style={{ flex: 1, minWidth: 200 }}>
            <Text style={{ fontSize: TYPOGRAPHY.sizes.lg, fontWeight: TYPOGRAPHY.weights.semibold, color: COLORS.text.primary }}>
              Growth Targets
            </Text>
            {focusMetrics.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.sm }}>
                {focusMetrics.map(([metricKey, value]) => {
                  const meta = getMetricMeta(metricKey);
                  return (
                    <View
                      key={`focus-${metricKey}`}
                      style={{
                        padding: SPACING.sm,
                        borderRadius: BORDER_RADIUS.lg,
                        backgroundColor: '#FFF7EB',
                        minWidth: 120,
                      }}
                    >
                      <Text style={{ fontWeight: TYPOGRAPHY.weights.semibold, color: '#92400E' }}>{meta.label}</Text>
                      <Text style={{ color: COLORS.text.secondary }}>{value} pts</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={{ color: COLORS.text.secondary, marginTop: SPACING.sm }}>
                No growth tags flagged yet — keep logging match notes.
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md }}>
        {PLAYER_EVALUATION_GROUPS.map((group) => (
          <CategoryRing
            key={group.title}
            title={group.title}
            description={group.description}
            value={summaryScores[group.title] || 0}
          />
        ))}
      </View>

      <View style={{ gap: SPACING.md }}>
        {PLAYER_EVALUATION_GROUPS.map((group) => (
          <View
            key={group.title}
            style={{
              backgroundColor: COLORS.background.main,
              borderRadius: BORDER_RADIUS.xl,
              padding: SPACING.lg,
              ...SHADOWS.small,
            }}
          >
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.xl,
                fontWeight: TYPOGRAPHY.weights.semibold,
                color: COLORS.text.primary,
                marginBottom: SPACING.xs,
              }}
            >
              {group.title}
            </Text>
            <Text style={{ color: COLORS.text.secondary, marginBottom: SPACING.md }}>{group.description}</Text>
            {group.metrics.map((metric) => (
              <EvaluationMetric
                key={metric.key}
                metric={metric}
                value={scores[metric.key]}
                canEdit={canEdit}
                onAdjust={handleAdjust}
              />
            ))}
          </View>
        ))}
      </View>

      {canEdit && (
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
            Coach Notes
          </Text>
          <TextInput
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
              setStatus('dirty');
            }}
            placeholder="Training focus, match notes, and development checkpoints."
            placeholderTextColor={COLORS.text.secondary + '80'}
            multiline
            style={{
              minHeight: 120,
              borderWidth: 1,
              borderColor: COLORS.background.tertiary,
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.md,
              textAlignVertical: 'top',
              fontSize: TYPOGRAPHY.sizes.md,
              color: COLORS.text.primary,
            }}
          />
          <Button
            title={status === 'dirty' ? 'Save Evaluation Updates' : 'Saved'}
            onPress={handleSave}
            disabled={status !== 'dirty'}
            style={{ opacity: status === 'dirty' ? 1 : 0.7 }}
          />
          <Text style={{ fontSize: TYPOGRAPHY.sizes.sm, color: COLORS.text.secondary }}>
            {status === 'dirty'
              ? 'Unsaved changes'
              : `Last saved ${lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'now'}`}
          </Text>
        </View>
      )}
    </View>
  );
}
