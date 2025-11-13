// app/index.jsx - Final version with dynamic ball motion triangles
import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Hero from './hero';
import AboutSection from '../components/sections/AboutSection';
import TeamSection from '../components/sections/TeamSection';
import ContactSection from '../components/sections/ContactSection';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

// Floating Triangle Component - subtle motion trail effect
const FloatingTriangle = ({ size, duration, delay, color, startX, startY }) => {
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const rotate = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const opacity = useSharedValue(0.15);
  
  useEffect(() => {
    // Subtle floating motion
    translateX.value = withRepeat(
      withTiming(startX + (Math.random() * 40 - 20), { duration: duration }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(startY + (Math.random() * 40 - 20), { duration: duration }),
      -1,
      true
    );
    
    // Very slow rotation
    rotate.value = withRepeat(
      withTiming(360, { duration: duration * 4 }),
      -1,
      false
    );
    
    // Subtle stretch effect - like ball motion trail
    scaleX.value = withRepeat(
      withTiming(1.4, { duration: duration }),
      -1,
      true
    );
    scaleY.value = withRepeat(
      withTiming(0.8, { duration: duration }),
      -1,
      true
    );
    
    // Very subtle opacity pulse
    opacity.value = withRepeat(
      withTiming(0.25, { duration: duration }),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value }
    ],
    opacity: opacity.value
  }));
  
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        },
        animatedStyle
      ]}
    />
  );
};

// Soccer Field Background Component
const SoccerFieldBackground = () => {
  const lineColor = 'rgba(255,255,255,0.15)';
  const lineWidth = 2;
  
  return (
    <View style={styles.fieldContainer}>
      {/* Base Grass Gradient - Smooth white to green transition */}
      <LinearGradient
        colors={[
          '#e8f5e9',  // Very light green (almost white) at top
          '#c8e6c9',  // Light green
          '#a5d6a7',  // Medium-light green
          '#81c784',  // Medium green
          '#66bb6a',  // Medium-bright green
          '#4caf50',  // Bright green
          '#2d7a34',  // Dark green
          '#1f6b26',  // Darker green
          '#1a5f1f',  // Darkest green at bottom
        ]}
        locations={[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]}
        style={styles.grassGradient}
      />
      
      {/* Floating Triangles - Subtle motion trails like ball paths */}
      <FloatingTriangle 
        size={80} 
        color="rgba(227, 27, 35, 0.18)" 
        duration={5000} 
        delay={0}
        startX={SCREEN_WIDTH * 0.3}
        startY={SCREEN_HEIGHT * 0.3}
      />
      <FloatingTriangle 
        size={100} 
        color="rgba(212, 175, 55, 0.15)" 
        duration={6000} 
        delay={1000}
        startX={SCREEN_WIDTH * 0.7}
        startY={SCREEN_HEIGHT * 0.4}
      />
      <FloatingTriangle 
        size={90} 
        color="rgba(255, 255, 255, 0.12)" 
        duration={5500} 
        delay={2000}
        startX={SCREEN_WIDTH * 0.5}
        startY={SCREEN_HEIGHT * 0.5}
      />
      <FloatingTriangle 
        size={70} 
        color="rgba(227, 27, 35, 0.15)" 
        duration={5200} 
        delay={3000}
        startX={SCREEN_WIDTH * 0.4}
        startY={SCREEN_HEIGHT * 0.65}
      />
      <FloatingTriangle 
        size={85} 
        color="rgba(212, 175, 55, 0.13)" 
        duration={5800} 
        delay={4000}
        startX={SCREEN_WIDTH * 0.65}
        startY={SCREEN_HEIGHT * 0.75}
      />
      
      {/* Field Boundary */}
      <View style={[styles.fieldBoundary, { borderWidth: lineWidth, borderColor: lineColor }]} />
      
      {/* Center Circle */}
      <View style={[styles.centerCircle, { borderWidth: lineWidth, borderColor: lineColor }]} />
      
      {/* Center Spot */}
      <View style={[styles.centerSpot, { backgroundColor: lineColor }]} />
      
      {/* Halfway Line */}
      <View style={[styles.halfwayLine, { height: lineWidth, backgroundColor: lineColor }]} />
      
      {/* Top Penalty Area */}
      <View style={[styles.topPenaltyArea, { 
        borderBottomWidth: lineWidth, 
        borderLeftWidth: lineWidth, 
        borderRightWidth: lineWidth, 
        borderColor: lineColor 
      }]} />
      
      {/* Top Goal Area */}
      <View style={[styles.topGoalArea, { 
        borderBottomWidth: lineWidth, 
        borderLeftWidth: lineWidth, 
        borderRightWidth: lineWidth, 
        borderColor: lineColor 
      }]} />
      
      {/* Bottom Penalty Area */}
      <View style={[styles.bottomPenaltyArea, { 
        borderTopWidth: lineWidth, 
        borderLeftWidth: lineWidth, 
        borderRightWidth: lineWidth, 
        borderColor: lineColor 
      }]} />
      
      {/* Bottom Goal Area */}
      <View style={[styles.bottomGoalArea, { 
        borderTopWidth: lineWidth, 
        borderLeftWidth: lineWidth, 
        borderRightWidth: lineWidth, 
        borderColor: lineColor 
      }]} />
      
      {/* Corner Arcs */}
      <View style={[styles.cornerTopLeft, { borderWidth: lineWidth, borderColor: lineColor }]} />
      <View style={[styles.cornerTopRight, { borderWidth: lineWidth, borderColor: lineColor }]} />
      <View style={[styles.cornerBottomLeft, { borderWidth: lineWidth, borderColor: lineColor }]} />
      <View style={[styles.cornerBottomRight, { borderWidth: lineWidth, borderColor: lineColor }]} />
    </View>
  );
};

export default function CarouselApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const transitionOpacity = useSharedValue(1);
  const { page } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const slugParam = Array.isArray(page) ? page[0] : page;
    const targetIndex = getIndexFromSlug(slugParam);
    if (targetIndex !== currentIndex) {
      translateX.value = withTiming(-targetIndex * SCREEN_WIDTH, {
        duration: 450,
        easing: Easing.out(Easing.cubic),
      });
      transitionOpacity.value = withSequence(
        withTiming(0.9, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
      );
      setCurrentIndex(targetIndex);
    }
  }, [page, currentIndex, translateX, transitionOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: transitionOpacity.value,
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* Soccer Field Background */}
      <SoccerFieldBackground />
      
      {/* Hawks Logo Background Cover with Opacity */}
      <View style={styles.logoBackground}>
        <Image
          source={require('../assets/images/logo/hawks.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Animated Page Content */}
      <Animated.View
        style={[
          styles.pagesContainer,
          { width: SCREEN_WIDTH * PAGES.length },
          animatedStyle
        ]}
      >
        {PAGES.map((page) => {
          const PageComponent = page.component;
          return (
            <View key={page.slug} style={styles.pageWrapper}>
              <PageComponent />
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Soccer Field Styles
  fieldContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2,
  },
  grassGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fieldBoundary: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    left: SCREEN_WIDTH * 0.08,
    right: SCREEN_WIDTH * 0.08,
    bottom: SCREEN_HEIGHT * 0.1,
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 150,
    height: 150,
    marginLeft: -75,
    marginTop: -75,
    borderRadius: 75,
  },
  centerSpot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 6,
    height: 6,
    marginLeft: -3,
    marginTop: -3,
    borderRadius: 3,
  },
  halfwayLine: {
    position: 'absolute',
    top: '50%',
    left: SCREEN_WIDTH * 0.08,
    right: SCREEN_WIDTH * 0.08,
  },
  topPenaltyArea: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    left: '50%',
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_HEIGHT * 0.18,
    marginLeft: -(SCREEN_WIDTH * 0.225),
  },
  topGoalArea: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    left: '50%',
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.09,
    marginLeft: -(SCREEN_WIDTH * 0.125),
  },
  bottomPenaltyArea: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    left: '50%',
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_HEIGHT * 0.18,
    marginLeft: -(SCREEN_WIDTH * 0.225),
  },
  bottomGoalArea: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    left: '50%',
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.09,
    marginLeft: -(SCREEN_WIDTH * 0.125),
  },
  cornerTopLeft: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1 - 15,
    left: SCREEN_WIDTH * 0.08 - 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1 - 15,
    right: SCREEN_WIDTH * 0.08 - 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1 - 15,
    left: SCREEN_WIDTH * 0.08 - 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1 - 15,
    right: SCREEN_WIDTH * 0.08 - 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  
  // Logo Background
  logoBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_WIDTH * 0.35,
    marginLeft: -(SCREEN_WIDTH * 0.35 / 2),
    marginTop: -(SCREEN_WIDTH * 0.35 / 2),
    opacity: 0.08,
    transform: [{ rotate: '0deg' }],
    zIndex: -1,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  
  // Pages Container
  pagesContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  pageWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
});
