// utils/advancedAnimations.js
import { useSharedValue, withTiming, withSpring, withRepeat, withSequence, Easing, interpolate, runOnJS } from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Advanced easing curves for 2025 feel
export const ADVANCED_EASINGS = {
  elastic: Easing.elastic(1.2),
  bouncy: Easing.bounce,
  smooth: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  dramatic: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  cyberpunk: Easing.bezier(0.77, 0, 0.175, 1),
};

// Scroll-triggered animation hook
export const useScrollAnimation = (scrollY) => {
  const opacity = interpolate(scrollY.value, [0, 100], [1, 0]);
  const scale = interpolate(scrollY.value, [0, 100], [1, 0.8]);
  const translateY = interpolate(scrollY.value, [0, 100], [0, -50]);
  
  return { opacity, scale, translateY };
};

// Parallax effect hook
export const useParallax = (scrollY, speed = 0.5) => {
  return interpolate(scrollY.value, [0, height], [0, -height * speed]);
};

// Stagger animation for lists
export const useStaggerAnimation = (index, delay = 100) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  
  const startAnimation = () => {
    opacity.value = withTiming(1, { 
      duration: 600, 
      delay: index * delay,
      easing: ADVANCED_EASINGS.smooth 
    });
    translateY.value = withTiming(0, { 
      duration: 600, 
      delay: index * delay,
      easing: ADVANCED_EASINGS.smooth 
    });
  };
  
  return { opacity, translateY, startAnimation };
};

// Floating animation for AI elements
export const useFloatingAnimation = () => {
  const translateY = useSharedValue(0);
  
  const startFloat = () => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000, easing: ADVANCED_EASINGS.smooth }),
        withTiming(10, { duration: 2000, easing: ADVANCED_EASINGS.smooth })
      ),
      -1,
      true
    );
  };
  
  return { translateY, startFloat };
};

// Glitch effect for cyberpunk theme
export const useGlitchAnimation = () => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  const glitch = () => {
    translateX.value = withSequence(
      withTiming(2, { duration: 50 }),
      withTiming(-2, { duration: 50 }),
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    opacity.value = withSequence(
      withTiming(0.8, { duration: 50 }),
      withTiming(1, { duration: 50 })
    );
  };
  
  return { translateX, opacity, glitch };
};

// Morphing button animation
export const useMorphingButton = () => {
  const borderRadius = useSharedValue(12);
  const scale = useSharedValue(1);
  
  const morph = () => {
    borderRadius.value = withTiming(borderRadius.value === 12 ? 30 : 12, {
      duration: 300,
      easing: ADVANCED_EASINGS.smooth
    });
    scale.value = withSequence(
      withTiming(0.95, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  };
  
  return { borderRadius, scale, morph };
};