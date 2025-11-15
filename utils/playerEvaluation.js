import {
  PLAYER_EVALUATION_GROUPS,
  PLAYER_EVALUATION_METRIC_MAP,
  DEFAULT_EVALUATION_VALUE,
  EVALUATION_SCALE,
} from '../constants/playerEvaluation';

export const clampEvaluationValue = (value) => Math.max(EVALUATION_SCALE.min, value);

export const buildInitialScoreMap = (initial = {}) => {
  const base = {};
  PLAYER_EVALUATION_GROUPS.forEach((group) => {
    group.metrics.forEach((metric) => {
      const current = initial[metric.key];
      base[metric.key] = typeof current === 'number' ? current : DEFAULT_EVALUATION_VALUE;
    });
  });
  return base;
};

export const buildGroupTotals = (scores = {}) => {
  const summaries = {};
  PLAYER_EVALUATION_GROUPS.forEach((group) => {
    const total = group.metrics.reduce((sum, metric) => sum + (scores[metric.key] || 0), 0);
    summaries[group.title] = total;
  });
  return summaries;
};

export const getPlayerTotalPoints = (scores = {}) =>
  Object.values(scores).reduce((sum, value) => sum + (value || 0), 0);

export const sortMetricsByScore = (scores = {}) =>
  Object.entries(scores).sort((a, b) => (b[1] || 0) - (a[1] || 0));

export const getMetricMeta = (key) => PLAYER_EVALUATION_METRIC_MAP[key] || { label: key };
