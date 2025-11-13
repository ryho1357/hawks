import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { isDesktop, isMobile } from '../../utils/responsive';
import Container from '../ui/Container';

const navigateToSlug = (router, slug) => {
  if (slug === 'home') {
    router.replace('/');
    return;
  }

  router.replace(`/${slug}`);
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { page } = useLocalSearchParams();
  const mobileView = isMobile();
  const desktopView = isDesktop();

  const derivedSlug = React.useMemo(() => {
    if (pathname === '/') {
      return (Array.isArray(page) ? page[0] : page) || 'home';
    }

    const normalized = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    return normalized.length ? normalized : 'home';
  }, [pathname, page]);

  const handleNavigation = (slug) => {
    navigateToSlug(router, slug);
  };

  const isActive = (slug) => derivedSlug === slug;
  const logoSize = mobileView ? 52 : 72;

  const particleConfigs = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, index) => ({
        size: mobileView ? 6 : 9,
        left: `${Math.random() * 100}%`,
        startOffset: Math.random() * 40 - 20,
        delay: index * 80,
        travel: mobileView ? 28 : 40,
      })),
    [mobileView]
  );

  const particleAnimations = useRef(particleConfigs.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    particleAnimations.forEach((anim, index) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2200,
            delay: particleConfigs[index].delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    });
  }, [particleAnimations, particleConfigs]);

  return (
    <View
      style={{
        backgroundColor: COLORS.background.main,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.tertiary,
        ...SHADOWS.small,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        {particleConfigs.map((particle, index) => {
          const animation = particleAnimations[index % particleAnimations.length];
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [particle.startOffset, particle.startOffset + particle.travel],
          });
          const opacity = animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.35, 0],
          });

          return (
            <Animated.View
              key={`particle-${index}`}
              style={{
                position: 'absolute',
                top: 0,
                left: particle.left,
                width: particle.size,
                height: particle.size,
                borderRadius: particle.size / 2,
                backgroundColor: COLORS.primary,
                transform: [{ translateY }],
                opacity,
              }}
            />
          );
        })}
      </View>
      <Container>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: SPACING.md,
          minHeight: 60
        }}>
          {/* Hawks Icon */}
          <Image
            source={require('../../assets/favicon.png')}
            style={{
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize / 2,
              borderWidth: 0,
              borderColor: COLORS.primary,
              marginRight: SPACING.md
            }}
            resizeMode="contain"
          />

          {/* Primary Navigation */}
          <View style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: mobileView ? 'wrap' : 'nowrap',
            justifyContent: desktopView ? 'center' : 'flex-start',
            alignItems: 'center'
          }}>
            {NAVIGATION_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => handleNavigation(item.slug)}
                style={{
                  paddingHorizontal: mobileView ? SPACING.sm : SPACING.md,
                  paddingVertical: SPACING.sm,
                  marginRight: SPACING.xs,
                  marginBottom: mobileView ? SPACING.xs : 0,
                  borderRadius: 8,
                  backgroundColor: isActive(item.slug) ? COLORS.primary : 'transparent'
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: isActive(item.slug) ? '700' : '500',
                  color: isActive(item.slug) ? COLORS.text.white : COLORS.text.primary
                }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Container>
    </View>
  );
}
