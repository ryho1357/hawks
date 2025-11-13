import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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
  const logoSize = mobileView ? 40 : 56;

  return (
    <View style={{ 
      backgroundColor: COLORS.background.main,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.background.tertiary,
      ...SHADOWS.small
    }}>
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
