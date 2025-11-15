import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { isDesktop, isMobile } from '../../utils/responsive';
import Container from '../ui/Container';
import { useAuth } from '../../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

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
  const { authenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const derivedSlug = React.useMemo(() => {
    if (pathname === '/') {
      return (Array.isArray(page) ? page[0] : page) || 'home';
    }

    const normalized = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    return normalized.length ? normalized : 'home';
  }, [pathname, page]);

  const navigationItems = useMemo(() => {
    if (authenticated) {
      return NAVIGATION_ITEMS;
    }
    return NAVIGATION_ITEMS.filter((item) => item.slug !== 'evaluations');
  }, [authenticated]);

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
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [derivedSlug]);

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
          {!mobileView ? (
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: desktopView ? 'center' : 'flex-start',
              alignItems: 'center'
            }}>
              {navigationItems.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => handleNavigation(item.slug)}
                  style={{
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    marginRight: SPACING.xs,
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
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {mobileView && (
            <TouchableOpacity
              onPress={() => setMobileMenuOpen((prev) => !prev)}
              style={{
                padding: SPACING.sm,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: COLORS.primary,
              }}
            >
              <MaterialIcons
                name={mobileMenuOpen ? 'close' : 'menu'}
                size={28}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Container>
      {mobileView && mobileMenuOpen ? (
        <View
          style={{
            paddingHorizontal: SPACING.xl,
            paddingBottom: SPACING.lg,
            backgroundColor: 'rgba(255,255,255,0.98)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.05)',
          }}
        >
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.slug}
              onPress={() => handleNavigation(item.slug)}
              style={{
                paddingVertical: SPACING.md,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: item !== navigationItems[navigationItems.length - 1] ? 1 : 0,
                borderBottomColor: 'rgba(0,0,0,0.05)',
              }}
            >
              <MaterialIcons
                name={isActive(item.slug) ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={20}
                color={isActive(item.slug) ? COLORS.primary : COLORS.text.secondary}
                style={{ marginRight: SPACING.sm }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: isActive(item.slug) ? '700' : '500',
                  color: isActive(item.slug) ? COLORS.primary : COLORS.text.primary,
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
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
