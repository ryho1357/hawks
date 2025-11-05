// components/layout/CarouselPageWrapper.jsx
import React, { useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';
import { usePathname } from 'expo-router';
import { COLORS } from '../../constants/design-system';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';

const TRANSITION_CONFIGS = {
  '/': {
    backgroundColor: COLORS.background.main,
    animation: 'slideUp',
    duration: 800
  },
  '/solutions': {
    backgroundColor: COLORS.primaryLight,
    animation: 'slideLeft',
    duration: 600
  },
  '/portfolio': {
    backgroundColor: COLORS.background.tertiary,
    animation: 'scale',
    duration: 700
  },
  '/about': {
    backgroundColor: COLORS.secondaryLight,
    animation: 'rotate',
    duration: 650
  },
  '/contact': {
    backgroundColor: COLORS.background.secondary + '20',
    animation: 'slideDown',
    duration: 750
  }
};

export default function CarouselPageWrapper({ 
  children, 
  showHeader = true, 
  showFooter = true,
  customTransition 
}) {
  const pathname = usePathname();
  const config = TRANSITION_CONFIGS[pathname] || TRANSITION_CONFIGS['/'];
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const translateX = useSharedValue(30);
  const scale = useSharedValue(0.9);
  const rotate = useSharedValue('5deg');
  
  useEffect(() => {
    // Reset values
    opacity.value = 0;
    translateY.value = 50;
    translateX.value = 30;
    scale.value = 0.9;
    rotate.value = '5deg';
    
    // Animate in based on page type
    const animationConfig = {
      damping: 20,
      stiffness: 200,
      mass: 0.8
    };
    
    switch (config.animation) {
      case 'slideUp':
        opacity.value = withTiming(1, { duration: config.duration });
        translateY.value = withSpring(0, animationConfig);
        break;
        
      case 'slideLeft':
        opacity.value = withTiming(1, { duration: config.duration });
        translateX.value = withSpring(0, animationConfig);
        break;
        
      case 'scale':
        opacity.value = withTiming(1, { duration: config.duration });
        scale.value = withSpring(1, animationConfig);
        break;
        
      case 'rotate':
        opacity.value = withTiming(1, { duration: config.duration });
        rotate.value = withSpring('0deg', animationConfig);
        scale.value = withSpring(1, animationConfig);
        break;
        
      case 'slideDown':
        opacity.value = withTiming(1, { duration: config.duration });
        translateY.value = withSpring(0, { ...animationConfig, damping: 25 });
        break;
        
      default:
        opacity.value = withTiming(1, { duration: config.duration });
        translateY.value = withSpring(0, animationConfig);
    }
  }, [pathname]);
  
  const animatedStyle = useAnimatedStyle(() => {
    switch (config.animation) {
      case 'slideLeft':
        return {
          opacity: opacity.value,
          transform: [{ translateX: translateX.value }],
        };
        
      case 'scale':
        return {
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        };
        
      case 'rotate':
        return {
          opacity: opacity.value,
          transform: [
            { scale: scale.value },
            { rotate: rotate.value }
          ],
        };
        
      default:
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };
    }
  });
  
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: config.backgroundColor,
    opacity: interpolate(opacity.value, [0, 1], [0, 1])
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background.main }}>
      <Animated.View style={[{ flex: 1 }, backgroundStyle]}>
        {showHeader && <Header />}
        
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          {children}
        </Animated.View>
        
        {showFooter && <Footer />}
      </Animated.View>
    </SafeAreaView>
  );
}