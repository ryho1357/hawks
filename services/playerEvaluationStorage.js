import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLAYER_EVALUATION_MAP } from '../data/playerEvaluationSample';

const STORAGE_KEY = 'hawks-player-evaluations';

const seedEvaluations = async () => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(PLAYER_EVALUATION_MAP));
  return PLAYER_EVALUATION_MAP;
};

export const loadEvaluations = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return await seedEvaluations();
  } catch (error) {
    console.warn('Failed to load evaluations from storage, seeding defaults.', error);
    return await seedEvaluations();
  }
};

export const persistEvaluations = async (evaluations) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
  } catch (error) {
    console.warn('Failed to persist evaluations', error);
  }
};

export const savePlayerEvaluation = async (playerId, evaluation) => {
  const current = await loadEvaluations();
  const updated = {
    ...current,
    [playerId]: {
      ...(current[playerId] || {}),
      ...evaluation,
    },
  };
  await persistEvaluations(updated);
  return updated;
};
