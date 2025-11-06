// app/index.jsx - Full carousel implementation
import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions, Image } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Hero from './hero';
import AboutSection from '../components/sections/AboutSection';
import TeamSection from '../components/sections/TeamSection';
import ContactSection from '../components/sections/ContactSection';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  { component: Hero, name: 'Home', slug: 'home' },
  { component: AboutSection, name: 'About', slug: 'about' },
  { component: TeamSection, name: 'Team', slug: 'team' },
  { component: ContactSection, name: 'Contact', slug: 'contact' },
];

const getIndexFromSlug = (slug) => {
  const normalized = slug || 'home';
  const foundIndex = PAGES.findIndex((page) => page.slug === normalized);
  return foundIndex === -1 ? 0 : foundIndex;
};

export default function CarouselApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const { page } = useLocalSearchParams();
  const router = useRouter();

  const handleIndexChange = useCallback((index) => {
    setCurrentIndex(index);
    const slug = PAGES[index].slug;
    if (slug === 'home') {
      router.replace('/');
    } else {
      router.replace({ pathname: '/', params: { page: slug } });
    }
  }, [router]);

  useEffect(() => {
    const slugParam = Array.isArray(page) ? page[0] : page;
    const targetIndex = getIndexFromSlug(slugParam);
    if (targetIndex !== currentIndex) {
      translateX.value = withSpring(-targetIndex * SCREEN_WIDTH);
      setCurrentIndex(targetIndex);
    }
  }, [page, currentIndex, translateX]);

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
        runOnJS(handleIndexChange)(targetIndex);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* Hawks Logo Background Cover with Opacity */}
      <View 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: SCREEN_WIDTH * 0.45,
          height: SCREEN_WIDTH * 0.45,
          marginLeft: -(SCREEN_WIDTH * 0.45 / 2),
          marginTop: -(SCREEN_WIDTH * 0.45 / 2),
          opacity: 0.08,
          transform: [{ rotate: '0deg' }],
          zIndex: 0,
        }}
      >
        <Image
          source={require('../assets/images/logo/hawks.png')}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="contain"
        />
      </View>

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
        {PAGES.map((page) => {
          const PageComponent = page.component;
          return (
            <View key={page.slug} style={{ width: SCREEN_WIDTH, flex: 1 }}>
              <PageComponent />
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}