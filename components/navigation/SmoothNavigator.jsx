// components/navigation/SmoothNavigator.jsx
import React, { useEffect, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { COLORS, SPACING } from '../../constants/design-system';
import { NAVIGATION_ITEMS } from '../../constants/navigation';

const { width } = Dimensions.get('window');

const NavigationTab = ({ item, isActive, onPress, index, totalItems }) => {
  const scale = useSharedValue(isActive ? 1 : 0.8);
  const opacity = useSharedValue(isActive ? 1 : 0.6);
  const translateY = useSharedValue(isActive ? 0 : 10);
  
  useEffect(() => {
    scale.value = withSpring(isActive ? 1 : 0.8, { damping: 15 });
    opacity.value = withTiming(isActive ? 1 : 0.6, { duration: 200 });
    translateY.value = withSpring(isActive ? 0 : 10, { damping: 20 });
  }, [isActive]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));
  
  const rippleEffect = useSharedValue(0);
  
  const handlePress = () => {
    // Ripple animation
    rippleEffect.value = 0;
    rippleEffect.value = withTiming(1, { duration: 300 }, () => {
      rippleEffect.value = withTiming(0, { duration: 200 });
    });
    
    onPress();
  };
  
  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(rippleEffect.value, [0, 1], [0, 2]) }],
    opacity: interpolate(rippleEffect.value, [0, 0.5, 1], [0, 0.3, 0]),
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flex: 1,
        alignItems: 'center',
        paddingVertical: SPACING.md,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ripple Effect */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.primary,
            top: '50%',
            left: '50%',
            marginTop: -30,
            marginLeft: -30,
          },
          rippleStyle
        ]}
      />
      
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: SPACING.sm,
            paddingHorizontal: SPACING.md,
            borderRadius: 20,
            backgroundColor: isActive ? COLORS.primaryLight : 'transparent',
            minHeight: 50,
          },
          animatedStyle
        ]}
      >
        <MaterialIcons
          name={item.icon}
          size={24}
          color={isActive ? COLORS.primary : COLORS.text.light}
          style={{ marginBottom: 4 }}
        />
        <Text
          style={{
            fontSize: 12,
            fontWeight: isActive ? '600' : '400',
            color: isActive ? COLORS.primary : COLORS.text.light,
            textAlign: 'center',
          }}
        >
          {item.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const ActiveIndicator = ({ activeIndex, itemCount }) => {
  const translateX = useSharedValue(0);
  const itemWidth = width / itemCount;
  
  useEffect(() => {
    translateX.value = withSpring(activeIndex * itemWidth, {
      damping: 20,
      stiffness: 200,
    });
  }, [activeIndex, itemWidth]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          width: itemWidth,
          height: 3,
          backgroundColor: COLORS.primary,
          borderRadius: 2,
        },
        animatedStyle
      ]}
    />
  );
};

export default function SmoothNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  
  const activeIndex = NAVIGATION_ITEMS.findIndex(item => {
    if (item.href === '/' && pathname === '/') return true;
    if (item.href !== '/' && pathname === item.href) return true;
    return false;
  });
  
  const handleNavigation = (href, index) => {
    // Add haptic feedback here if needed
    router.push(href);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: COLORS.background.main + 'F0',
        borderTopWidth: 1,
        borderTopColor: COLORS.background.tertiary,
        paddingBottom: SPACING.sm,
        position: 'relative',
        backdropFilter: 'blur(10px)',
      }}
    >
      <ActiveIndicator activeIndex={activeIndex} itemCount={NAVIGATION_ITEMS.length} />
      
      {NAVIGATION_ITEMS.map((item, index) => (
        <NavigationTab
          key={item.name}
          item={item}
          isActive={index === activeIndex}
          onPress={() => handleNavigation(item.href, index)}
          index={index}
          totalItems={NAVIGATION_ITEMS.length}
        />
      ))}
    </View>
  );
}