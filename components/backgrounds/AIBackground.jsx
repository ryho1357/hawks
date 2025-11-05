// components/backgrounds/AIBackground.jsx
import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/design-system';

const { width, height } = Dimensions.get('window');

const FloatingOrb = ({ size, duration, delay, colors }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(Math.random() * 100 - 50, { duration: duration + Math.random() * 1000 }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(Math.random() * 100 - 50, { duration: duration + Math.random() * 1000 }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.2, { duration: duration }),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: interpolate(scale.value, [0.8, 1.2], [0.3, 0.8])
  }));
  
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle
      ]}
    >
      <LinearGradient
        colors={colors}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
        }}
      />
    </Animated.View>
  );
};

export default function AIBackground({ children, variant = 'primary' }) {
  const getOrbConfig = () => {
    switch (variant) {
      case 'cyberpunk':
        return {
          orbs: [
            { size: 120, colors: ['#FF006E', '#8338EC'], duration: 4000, delay: 0 },
            { size: 80, colors: ['#3A86FF', '#06FFA5'], duration: 6000, delay: 1000 },
            { size: 60, colors: ['#FFBE0B', '#FB8500'], duration: 5000, delay: 2000 },
          ]
        };
      case 'ai':
        return {
          orbs: [
            { size: 100, colors: [COLORS.primary, COLORS.primaryLight], duration: 5000, delay: 0 },
            { size: 70, colors: [COLORS.secondary, COLORS.secondaryLight], duration: 7000, delay: 1500 },
            { size: 90, colors: [COLORS.background.secondary, COLORS.primary], duration: 6000, delay: 3000 },
          ]
        };
      default:
        return {
          orbs: [
            { size: 80, colors: [COLORS.primary + '40', COLORS.primaryLight], duration: 6000, delay: 0 },
            { size: 60, colors: [COLORS.secondary + '40', COLORS.secondaryLight], duration: 8000, delay: 2000 },
          ]
        };
    }
  };
  
  const { orbs } = getOrbConfig();
  
  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      {/* Floating Orbs */}
      {orbs.map((orb, index) => (
        <FloatingOrb
          key={index}
          size={orb.size}
          colors={orb.colors}
          duration={orb.duration}
          delay={orb.delay}
        />
      ))}
      
      {/* Grid Pattern Overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `linear-gradient(${COLORS.primary} 1px, transparent 1px),
                           linear-gradient(90deg, ${COLORS.primary} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Content */}
      {children}
    </View>
  );
}