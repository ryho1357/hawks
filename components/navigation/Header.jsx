import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

  router.replace({ pathname: '/', params: { page: slug } });
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { page } = useLocalSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeSlug = pathname === '/' ? (Array.isArray(page) ? page[0] : page) || 'home' : null;

  const handleNavigation = (slug) => {
    navigateToSlug(router, slug);
    setMobileMenuOpen(false);
  };

  const isActive = (slug) => {
    if (pathname !== '/') return false;
    return (activeSlug || 'home') === slug;
  };

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
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: SPACING.md,
          minHeight: 60
        }}>

          {/* Desktop Navigation */}
          {isDesktop() && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {NAVIGATION_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => handleNavigation(item.slug)}
                  style={{
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    marginHorizontal: SPACING.xs,
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
          )}

          {/* Mobile Menu Button */}
          {isMobile() && (
            <TouchableOpacity 
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                padding: SPACING.sm,
                borderRadius: 8,
                backgroundColor: mobileMenuOpen ? COLORS.background.tertiary : 'transparent'
              }}
            >
              <MaterialIcons 
                name={mobileMenuOpen ? 'close' : 'menu'} 
                size={24} 
                color={COLORS.primary} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Mobile Menu */}
        {isMobile() && mobileMenuOpen && (
          <View style={{
            paddingBottom: SPACING.md,
            borderTopWidth: 1,
            borderTopColor: COLORS.background.tertiary,
            marginTop: SPACING.sm
          }}>
            {NAVIGATION_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => handleNavigation(item.slug)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: SPACING.md,
                  paddingHorizontal: SPACING.sm,
                  borderRadius: 8,
                  marginVertical: 2,
                  backgroundColor: isActive(item.slug) ? COLORS.primary : 'transparent'
                }}
              >
                <MaterialIcons 
                  name={item.icon} 
                  size={20} 
                  color={isActive(item.slug) ? COLORS.text.white : COLORS.text.secondary}
                  style={{ marginRight: SPACING.sm }}
                />
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
        )}
      </Container>
    </View>
  );
}