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
      case 'pitch':
        return {
          orbs: [
            { size: 140, colors: ['#E31B23', '#FFFFFF'], duration: 6000, delay: 0 },
            { size: 90, colors: ['#166534', '#22C55E66'], duration: 7000, delay: 1200 },
            { size: 70, colors: ['#14532D', '#65A30D66'], duration: 6500, delay: 2200 },
          ],
          fieldOverlay: true,
        };
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
  
  const { orbs, fieldOverlay } = getOrbConfig();
  
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

      
      {/* Soccer Pitch Overlay */}
      {fieldOverlay && (
        <>
          <LinearGradient
            colors={['transparent', 'rgba(34, 197, 94, 0.15)', 'rgba(22, 101, 52, 0.85)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: height ,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: height * 0.4,
              borderTopWidth: 2,
              borderColor: 'rgba(255,255,255,0.35)',
            }}
          >
            {/* Center Circle */}
            <View
              style={{
                position: 'absolute',
                top: height * 0.12,
                left: '50%',
                width: 140,
                height: 140,
                marginLeft: -70,
                borderRadius: 70,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.25)',
              }}
            />
            {/* Midfield Line */}
            <View
              style={{
                position: 'absolute',
                top: height * 0.12 + 70,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.25)',
              }}
            />


          </View>
        </>
      )}
      
      {/* Content */}
      {children}
    </View>
  );
}
