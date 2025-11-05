import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { isDesktop, isMobile } from '../../utils/responsive';
import Container from '../ui/Container';
import ElevenLabsWidget from '../ui/ElevenLabsWidget';

const { width } = Dimensions.get('window');

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (href) => {
    if (href === '/') {
      router.push('/');
    } else {
      router.push(href);
    }
    setMobileMenuOpen(false);
  };

  const isActive = (href) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname === href) return true;
    return false;
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
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: SPACING.md,
          minHeight: 60
        }}>
          {/* Logo */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            backgroundColor: 'transparent',
            transform: [{ scale: 4 }] // Scale the entire view by 125%
          }}>
        <Image
          source={require('../../assets/images/logo/hawks.png')}
          style={{
            width: 62.5, // Scaled width by 125%
            height: 42.5, // Scaled height by 125%
            borderRadius: 50, // Scaled border radius proportionally
            marginTop: 2, // Adjusted to center the logo vertically
            marginLeft: 30 // Adjusted to center the logo horizontally
          }}
          resizeMode="contain"
        />
      </View>
          {/* Desktop Navigation */}
          {isDesktop() && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {NAVIGATION_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => handleNavigation(item.href)}
                  style={{
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    marginHorizontal: SPACING.xs,
                    borderRadius: 8,
                    backgroundColor: isActive(item.href) ? COLORS.primaryLight : 'transparent'
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: isActive(item.href) ? '600' : '500',
                    color: isActive(item.href) ? COLORS.primary : COLORS.text.secondary
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
                backgroundColor: mobileMenuOpen ? COLORS.primaryLight : 'transparent'
              }}
            >
              <MaterialIcons 
                name={mobileMenuOpen ? "close" : "menu"} 
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
                onPress={() => handleNavigation(item.href)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: SPACING.md,
                  paddingHorizontal: SPACING.sm,
                  borderRadius: 8,
                  marginVertical: 2,
                  backgroundColor: isActive(item.href) ? COLORS.primaryLight : 'transparent'
                }}
              >
                <MaterialIcons 
                  name={item.icon} 
                  size={20} 
                  color={isActive(item.href) ? COLORS.primary : COLORS.text.light}
                  style={{ marginRight: SPACING.sm }}
                />
                <Text style={{
                  fontSize: 16,
                  fontWeight: isActive(item.href) ? '600' : '500',
                  color: isActive(item.href) ? COLORS.primary : COLORS.text.secondary
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