// components/navigation/Footer.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/design-system';
import { COMPANY_INFO } from '../../constants/content';
import { getResponsiveValue, isDesktop } from '../../utils/responsive';
import Container from '../ui/Container';

export default function Footer() {
  const router = useRouter();

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={{
      backgroundColor: COLORS.text.primary,
      paddingVertical: SPACING.lg, // Much smaller padding
      borderTopWidth: 1,
      borderTopColor: COLORS.text.secondary
    }}>
      <Container>
        {/* Single Row Layout */}
        <View style={{
          flexDirection: isDesktop() ? 'row' : 'column',
          justifyContent: 'space-between',
          alignItems: isDesktop() ? 'center' : 'flex-start',
          gap: SPACING.sm
        }}>
          {/* Company Info - Compact */}
          <View style={{
            flex: isDesktop() ? 1 : undefined,
            marginBottom: isDesktop() ? 0 : SPACING.sm
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: COLORS.primary,
              marginBottom: 4
            }}>
              {COMPANY_INFO.name}
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <MaterialIcons 
                name="verified" 
                size={12} 
                color={COLORS.status.completed}
                style={{ marginRight: 4 }}
              />
              <Text style={{
                fontSize: 12,
                color: COLORS.text.light
              }}>
                {COMPANY_INFO.patent}
              </Text>
            </View>
          </View>

          {/* Quick Links - Horizontal */}
          {isDesktop() && (
            <View style={{
              flexDirection: 'row',
              gap: SPACING.lg,
              flex: 1,
              justifyContent: 'center'
            }}>
              {[
                 { name: "Home", href: "/" },
                 { name: "About", href: "/about" },
                { name: "Solutions", href: "/solutions" },
                { name: "Portfolio", href: "/portfolio" },
                
                
              ].map((link) => (
                <TouchableOpacity
                  key={link.name}
                  onPress={() => router.push(link.href)}
                >
                  <Text style={{
                    fontSize: 14,
                    color: COLORS.text.light,
                    fontWeight: '400'
                  }}>
                    {link.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Contact & Copyright */}
          <View style={{
            flex: isDesktop() ? 1 : undefined,
            alignItems: isDesktop() ? 'flex-end' : 'flex-start'
          }}>
            <TouchableOpacity
              onPress={() => handleEmailPress('contact@cookey.ai')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4
              }}
            >
              <MaterialIcons 
                name="email" 
                size={14} 
                color={COLORS.text.light}
                style={{ marginRight: 4 }}
              />
              <Text style={{
                fontSize: 14,
                color: COLORS.primary,
                fontWeight: '500'
              }}>
                contact@cookey.ai
              </Text>
            </TouchableOpacity>
            
            <Text style={{
              fontSize: 12,
              color: COLORS.text.light
            }}>
              © 2025 {COMPANY_INFO.name}
            </Text>
          </View>
        </View>

        {/* Mobile Links - Only show on mobile */}
        {!isDesktop() && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: SPACING.sm,
            paddingTop: SPACING.sm,
            borderTopWidth: 1,
            borderTopColor: COLORS.text.secondary
          }}>
            {[
               { name: "Home", href: "/" },
               { name: "About", href: "/about" },
              { name: "Solutions", href: "/solutions" },
              { name: "Portfolio", href: "/portfolio" },
              
              
            ].map((link) => (
              <TouchableOpacity
                key={link.name}
                onPress={() => router.push(link.href)}
              >
                <Text style={{
                  fontSize: 12,
                  color: COLORS.text.light,
                  fontWeight: '400'
                }}>
                  {link.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Container>
    </View>
  );
}