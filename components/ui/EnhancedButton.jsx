// components/ui/EnhancedButton.jsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  withTiming, 
  withSpring,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';
import { COLORS, SHADOWS, BORDER_RADIUS } from '../../constants/design-system';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function EnhancedButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  icon,
  style,
  textStyle,
  glowEffect = false,
  morphing = false,
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  const borderRadius = useSharedValue(BORDER_RADIUS.lg);
  const glowOpacity = useSharedValue(0);

  const handlePressIn = () => {
    setIsPressed(true);
    scale.value = withSpring(0.95, { damping: 15 });
    if (glowEffect) {
      glowOpacity.value = withTiming(1, { duration: 200 });
    }
    if (morphing) {
      borderRadius.value = withTiming(BORDER_RADIUS.round, { duration: 300 });
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
    scale.value = withSpring(1, { damping: 15 });
    if (glowEffect) {
      glowOpacity.value = withTiming(0, { duration: 200 });
    }
    if (morphing) {
      borderRadius.value = withTiming(BORDER_RADIUS.lg, { duration: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderRadius: borderRadius.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    shadowOpacity: interpolate(glowOpacity.value, [0, 1], [0, 0.5]),
    shadowRadius: interpolate(glowOpacity.value, [0, 1], [0, 20]),
  }));

  const getButtonStyle = () => {
    const base = {
      paddingHorizontal: size === 'large' ? 32 : size === 'small' ? 16 : 24,
      paddingVertical: size === 'large' ? 16 : size === 'small' ? 8 : 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      overflow: 'hidden',
      ...SHADOWS.medium
    };

    if (variant === 'secondary') {
      return {
        ...base,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary
      };
    }

    return base;
  };

  const getTextStyle = () => ({
    fontSize: size === 'large' ? 18 : size === 'small' ? 14 : 16,
    fontWeight: '600',
    color: variant === 'secondary' ? COLORS.primary : COLORS.text.white,
    marginLeft: icon ? 8 : 0
  });

  if (variant === 'primary') {
    return (
      <View style={style}>
        {glowEffect && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: BORDER_RADIUS.lg,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 0 },
              },
              glowStyle
            ]}
          />
        )}
        <AnimatedTouchable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={animatedStyle}
          {...props}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={getButtonStyle()}
          >
            {icon && (
              <MaterialIcons 
                name={icon} 
                size={size === 'large' ? 20 : 16} 
                color={COLORS.text.white} 
              />
            )}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          </LinearGradient>
        </AnimatedTouchable>
      </View>
    );
  }

  return (
    <AnimatedTouchable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, getButtonStyle(), style]} 
      {...props}
    >
      {icon && (
        <MaterialIcons 
          name={icon} 
          size={size === 'large' ? 20 : 16} 
          color={COLORS.primary} 
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </AnimatedTouchable>
  );
}