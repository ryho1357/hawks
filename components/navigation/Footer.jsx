// components/navigation/Footer.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/design-system';
import { CLUB_INFO } from '../../constants/content';
import { FOOTER_LINKS } from '../../constants/navigation';
import { isDesktop } from '../../utils/responsive';
import Container from '../ui/Container';

const navigateToSlug = (router, slug) => {
  if (slug === 'home') {
    router.replace('/');
  } else {
    router.replace({ pathname: '/', params: { page: slug } });
  }
};

const LinkGroup = ({ title, links }) => {
  const router = useRouter();

  return (
    <View style={{ marginBottom: SPACING.md }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: COLORS.text.white,
          marginBottom: SPACING.xs,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      {links.map((link) => (
        <TouchableOpacity
          key={link.name}
          onPress={() => navigateToSlug(router, link.slug)}
          style={{ paddingVertical: 4 }}
        >
          <Text
            style={{
              fontSize: 14,
              color: COLORS.text.light,
            }}
          >
            {link.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function Footer() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CLUB_INFO.email}`);
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.text.primary,
        paddingVertical: SPACING.xl,
        borderTopWidth: 1,
        borderTopColor: COLORS.text.secondary,
      }}
    >
      <Container>
        <View
          style={{
            flexDirection: isDesktop() ? 'row' : 'column',
            justifyContent: 'space-between',
            gap: SPACING.xl,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: COLORS.primary,
                marginBottom: SPACING.xs,
              }}
            >
              {CLUB_INFO.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.text.light,
                marginBottom: SPACING.md,
              }}
            >
              {CLUB_INFO.tagline}
            </Text>
            <TouchableOpacity
              onPress={handleEmailPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <MaterialIcons
                name='mail'
                size={18}
                color={COLORS.primary}
                style={{ marginRight: SPACING.xs }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.text.white,
                  fontWeight: '600',
                }}
              >
                {CLUB_INFO.email}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: SPACING.xl,
              flex: 1,
              justifyContent: isDesktop() ? 'center' : 'flex-start',
            }}
          >
            <LinkGroup title='Explore' links={[{ name: 'Home', slug: 'home' }, ...FOOTER_LINKS.club]} />
            <LinkGroup title='Resources' links={FOOTER_LINKS.resources} />
          </View>

          <View
            style={{
              flex: 1,
              alignItems: isDesktop() ? 'flex-end' : 'flex-start',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={() => navigateToSlug(router, 'contact')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: SPACING.sm,
              }}
            >
              <MaterialIcons
                name='chat'
                size={18}
                color={COLORS.text.light}
                style={{ marginRight: SPACING.xs }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.text.light,
                }}
              >
                Connect with the Hawks
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.text.light,
              }}
            >
              © {new Date().getFullYear()} {CLUB_INFO.name}. All rights reserved.
            </Text>
          </View>
        </View>
      </Container>
    </View>
  );
}
