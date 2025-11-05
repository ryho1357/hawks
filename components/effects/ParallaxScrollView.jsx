// components/effects/ParallaxScrollView.jsx
import React, { useRef } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const ParallaxElement = ({ 
  children, 
  speed = 0.5, 
  style,
  fadeRange = [0, 200]
}) => {
  const scrollY = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, height],
      [0, -height * speed],
      Extrapolate.EXTEND
    );
    
    const opacity = interpolate(
      scrollY.value,
      fadeRange,
      [1, 0],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ translateY }],
      opacity,
    };
  });
  
  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default function ParallaxScrollView({ 
  children, 
  showsVerticalScrollIndicator = false,
  onScroll,
  ...props 
}) {
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if (onScroll) {
        onScroll(event);
      }
    },
  });
  
  return (
    <AnimatedScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...props}
    >
      {children}
    </AnimatedScrollView>
  );
}