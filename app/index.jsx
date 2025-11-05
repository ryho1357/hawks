// app/index.jsx - Full carousel implementation
import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import Hero from './hero';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  { component: Hero, name: 'Home' },
];

export default function CarouselApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const dragDistance = event.translationX;
      let targetIndex = currentIndex;
      
      if (Math.abs(dragDistance) > SCREEN_WIDTH * 0.3) {
        if (dragDistance > 0 && currentIndex > 0) {
          targetIndex = currentIndex - 1;
        } else if (dragDistance < 0 && currentIndex < PAGES.length - 1) {
          targetIndex = currentIndex + 1;
        }
      }
      
      translateX.value = withSpring(-targetIndex * SCREEN_WIDTH);
      
      if (targetIndex !== currentIndex) {
        runOnJS(setCurrentIndex)(targetIndex);
      }
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              width: SCREEN_WIDTH * PAGES.length,
              flex: 1,
            },
            animatedStyle
          ]}
        >
          {PAGES.map((page, index) => {
            const PageComponent = page.component;
            return (
              <View key={index} style={{ width: SCREEN_WIDTH, flex: 1 }}>
                <PageComponent />
              </View>
            );
          })}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}