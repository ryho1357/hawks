import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
  const leagueBadgeSize = mobileView ? 44 : 56;

  const orbAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(orbAnimation, {
          toValue: 1,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(orbAnimation, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [orbAnimation]);

  const orbScale = orbAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.1],
  });
  const orbTranslate = orbAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, -8],
  });
  const orbOpacity = orbAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.22],
  });

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FBFF', '#FDEFF0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background.tertiary,
        ...SHADOWS.small,
        position: 'relative',
      }}
    >
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(227, 24, 55, 0.95)', 'rgba(227, 24, 55, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          shadowColor: 'rgba(227, 24, 55, 0.75)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 8,
        }}
      />
      <Container>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: SPACING.md,
          minHeight: 60
        }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: SPACING.md,
            }}
          >
            <Image
              source={require('../../assets/images/logo/lijsl.png')}
              style={{
                width: leagueBadgeSize,
                height: leagueBadgeSize,
                opacity: 0.8,
                marginRight: SPACING.sm,
                resizeMode: 'contain',
              }}
            />
            <Image
              source={require('../../assets/favicon.png')}
              style={{
                width: logoSize,
                height: logoSize,
                borderRadius: logoSize / 2,
                borderWidth: 0,
                borderColor: COLORS.primary,
                resizeMode: 'contain',
              }}
            />
          </View>

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
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: orbTranslate,
          right: 0,
          width: 190,
          height: 190,
          borderRadius: 140,
          backgroundColor: COLORS.primary,
          opacity: orbOpacity,
          transform: [{ translateX: 28 }, { translateY: orbTranslate }, { scale: orbScale }],
        }}
      />
    </LinearGradient>
  );
}
