// components/navigation/CarouselNavigator.jsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Dimensions, State } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { COLORS } from '../../constants/design-system';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  { name: 'Home', route: '/', component: 'hero' },
  { name: 'About', route: '/about', component: 'about' },
  { name: 'Solutions', route: '/solutions', component: 'solutions' },
  { name: 'Portfolio', route: '/portfolio', component: 'portfolio' },
];

export default function CarouselNavigator({ children, currentRoute }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const translateX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Find current page index
  useEffect(() => {
    const index = PAGES.findIndex(page => page.route === pathname);
    if (index !== -1 && index !== currentIndex) {
      setCurrentIndex(index);
      translateX.value = withSpring(-index * SCREEN_WIDTH, {
        damping: 20,
        stiffness: 200,
        mass: 0.8
      });
    }
  }, [pathname]);

  const navigateToPage = (index) => {
    if (index >= 0 && index < PAGES.length && index !== currentIndex) {
      // Animate first, then navigate
      translateX.value = withSpring(-index * SCREEN_WIDTH, {
        damping: 20,
        stiffness: 200,
        mass: 0.8
      }, () => {
        runOnJS(() => {
          setCurrentIndex(index);
          router.push(PAGES[index].route);
        })();
      });
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            flex: 1,
            width: SCREEN_WIDTH * PAGES.length,
          },
          containerStyle
        ]}
      >
        {PAGES.map((page, index) => (
          <CarouselPage
            key={page.route}
            index={index}
            currentIndex={currentIndex}
            translateX={translateX}
          >
            {/* Page content will be rendered here */}
            {children}
          </CarouselPage>
        ))}
      </Animated.View>
      
      {/* Navigation Dots */}
      <PageIndicator 
        pages={PAGES} 
        currentIndex={currentIndex} 
        onPagePress={navigateToPage}
      />
    </View>
  );
}

const CarouselPage = ({ children, index, currentIndex, translateX }) => {
  const pageStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    
    // Parallax effect for background elements
    const parallaxX = interpolate(
      translateX.value,
      inputRange,
      [SCREEN_WIDTH * 0.3, 0, -SCREEN_WIDTH * 0.3],
      Extrapolate.CLAMP
    );
    
    // Scale effect
    const scale = interpolate(
      translateX.value,
      inputRange,
      [0.85, 1, 0.85],
      Extrapolate.CLAMP
    );
    
    // Opacity effect
    const opacity = interpolate(
      translateX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [
        { translateX: parallaxX },
        { scale }
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: SCREEN_WIDTH,
          flex: 1,
        },
        pageStyle
      ]}
    >
      {children}
    </Animated.View>
  );
};

const PageIndicator = ({ pages, currentIndex, onPagePress }) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: COLORS.background.main + 'CC',
      backdropFilter: 'blur(10px)',
    }}>
      {pages.map((page, index) => (
        <PageDot
          key={index}
          index={index}
          currentIndex={currentIndex}
          onPress={() => onPagePress(index)}
          label={page.name}
        />
      ))}
    </View>
  );
};

const PageDot = ({ index, currentIndex, onPress, label }) => {
  const isActive = index === currentIndex;
  const scale = useSharedValue(isActive ? 1 : 0.7);
  const opacity = useSharedValue(isActive ? 1 : 0.5);
  
  useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.7, { damping: 15 });
    opacity.value = withTiming(isActive ? 1 : 0.5, { duration: 200 });
  }, [isActive]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginHorizontal: 4,
          borderRadius: 20,
          backgroundColor: isActive ? COLORS.primary : 'transparent',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: isActive ? COLORS.text.white : COLORS.primary,
            marginBottom: 4,
          }}
        />
        <Text style={{
          fontSize: 10,
          fontWeight: '500',
          color: isActive ? COLORS.text.white : COLORS.text.secondary,
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
