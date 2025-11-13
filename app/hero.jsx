// app/hero.jsx - Enhanced version
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { COLORS, SPACING, SHADOWS } from '../constants/design-system';
import { HERO_CONTENT, TODAY_INFO } from '../constants/content';
import { getResponsiveValue, isDesktop } from '../utils/responsive';


const { width, height } = Dimensions.get('window');

const TypewriterText = ({ text, delay = 0, style }) => {
  return (
    <MotiText
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay,
        duration: 2000,
        type: 'timing',
      }}
      style={[
        {
          fontSize: getResponsiveValue(28, 36, 48),
          fontWeight: 'bold',
          color: COLORS.text.primary,
          textAlign: 'center',
          lineHeight: getResponsiveValue(28, 36, 48) * 1.2
        },
        style
      ]}
    >
      {text}
    </MotiText>
  );
};

const FloatingButton = ({ title, onPress, variant, delay = 0 }) => {
  return (
    <MotiView
      from={{
        opacity: 0,
        translateY: 50,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
        scale: 1,
      }}
      transition={{
        delay,
        type: 'spring',
        damping: 15,
        stiffness: 200,
      }}
      style={{
        flex: isDesktop() ? 1 : undefined,
        width: isDesktop() ? undefined : '100%',
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          colors={variant === 'secondary' 
            ? ['transparent', 'transparent'] 
            : [COLORS.primary, COLORS.primaryDark, '#FFFFFF']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: variant === 'secondary' ? 2 : 0,
            borderColor: variant === 'secondary' ? COLORS.primary : 'transparent',
            ...SHADOWS.large
          }}
        >
          <Text style={{
            color: variant === 'secondary' ? COLORS.primary : COLORS.text.white,
            fontSize: 16,
            fontWeight: '600'
          }}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
};

const SoccerBallCluster = () => {
  const balls = [
    { size: 54, translateX: -10, translateY: -10, delay: 0, opacity: 0.35 },
    { size: 40, translateX: 32, translateY: -6, delay: 300, opacity: 0.4 },
    { size: 32, translateX: 4, translateY: 28, delay: 600, opacity: 0.5 },
  ];

  return (
    <View
      style={{
        position: 'absolute',
        top: 40,
        left: 32,
        width: 160,
        height: 160,
      }}
    >
      {balls.map((ball, index) => (
        <MotiView
          key={index}
          from={{
            opacity: 0,
            scale: 0.85,
            translateX: ball.translateX - 12,
            translateY: ball.translateY - 12,
            rotate: '0deg',
          }}
          animate={{
            opacity: ball.opacity,
            scale: 1.05,
            translateX: ball.translateX + 8,
            translateY: ball.translateY + 8,
            rotate: '360deg',
          }}
          transition={{
            type: 'timing',
            duration: 4500,
            loop: true,
            delay: ball.delay,
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <View
            style={{
              width: ball.size,
              height: ball.size,
              borderRadius: ball.size / 2,
              backgroundColor: COLORS.background.main + '10',
              alignItems: 'center',
              justifyContent: 'center',
              ...SHADOWS.small,
            }}
          >
            <MaterialIcons name="sports-soccer" size={ball.size * 0.6} color={COLORS.primary} />
          </View>
        </MotiView>
      ))}
    </View>
  );
};

const TodayDetailRow = ({ icon, label, value }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    }}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
      }}
    >
      <MaterialIcons name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 13,
          textTransform: 'uppercase',
          color: COLORS.text.secondary,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.text.primary,
          lineHeight: 22,
        }}
      >
        {value}
      </Text>
    </View>
  </View>
);

const TodaySection = () => (
  <MotiView
    from={{
      opacity: 0,
      translateY: 30,
    }}
    animate={{
      opacity: 1,
      translateY: 0,
    }}
    transition={{
      delay: 200,
      type: 'spring',
      damping: 18,
    }}
    style={{ width: '100%' }}
  >
    <View
      style={{
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 28,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.45)',
        ...SHADOWS.large,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          letterSpacing: 2,
          color: COLORS.primary,
          marginBottom: SPACING.xs,
        }}
      >
        TODAY
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: COLORS.text.primary,
          marginBottom: SPACING.xs,
        }}
      >
        {TODAY_INFO.dateLabel}
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: COLORS.text.secondary,
          marginBottom: SPACING.lg,
        }}
      >
        {TODAY_INFO.sessionTitle}
      </Text>
      <TodayDetailRow icon="schedule" label="Time" value={TODAY_INFO.time} />
      <TodayDetailRow icon="place" label="Location" value={TODAY_INFO.location} />
      <Text
        style={{
          marginTop: SPACING.sm,
          color: COLORS.text.secondary,
          lineHeight: 22,
        }}
      >
        {TODAY_INFO.note}
      </Text>
    </View>
  </MotiView>
);

const navigateToSlug = (router, slug) => {
  if (slug === 'home') {
    router.replace('/');
  } else {
    router.replace({ pathname: '/', params: { page: slug } });
  }
};

export default function Hero() {
  const router = useRouter();
  const heroHeight = getResponsiveValue(height * 0.8, height * 0.7, height * 0.9);

  return (

      <View style={{
        minHeight: heroHeight,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: getResponsiveValue(16, 24, 32),
        paddingVertical: SPACING.xxl,
        position: 'relative'
      }}>
        {/* Animated Soccer Ball Cluster */}
        <SoccerBallCluster />

        {/* Main Content */}
        <View style={{
          maxWidth: isDesktop() ? 900 : width - 64,
          alignItems: 'center',
          zIndex: 10
        }}>
          {/* Animated Title */}
          <MotiView
            from={{
              opacity: 0,
              translateY: -30,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              duration: 1000,
              type: 'spring',
              damping: 15,
            }}
            style={{ width: '100%' }}
          >
            <View
              style={{
                alignSelf: 'center',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 28,
                paddingVertical: SPACING.md,
                paddingHorizontal: getResponsiveValue(20, 28, 36),
                maxWidth: isDesktop() ? 720 : '100%',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                ...SHADOWS.large,
              }}
            >
              <LinearGradient
                colors={['rgba(178,34,34,0.95)', 'rgba(127,29,29,0.92)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  ...StyleSheet.absoluteFillObject,
                }}
              />
              <MotiView
                pointerEvents="none"
                from={{ opacity: 0.35, scale: 0.95 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{
                  loop: true,
                  repeatReverse: true,
                  duration: 2400,
                  type: 'timing',
                }}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  borderRadius: 28,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                }}
              />
              <MaterialIcons
                name="sports-soccer"
                size={isDesktop() ? 220 : 180}
                color="rgba(255,255,255,0.12)"
                style={{
                  position: 'absolute',
                  top: isDesktop() ? -40 : -50,
                  right: isDesktop() ? -30 : -60,
                  transform: [{ rotate: '-15deg' }],
                }}
              />
              <TypewriterText
                text={HERO_CONTENT.headline}
                style={{
                  color: COLORS.text.white,
                  textShadowColor: 'rgba(255, 255, 255, 0.65)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 12,
                }}
              />
            </View>
          </MotiView>

          {/* Animated Subtitle */}
          <MotiView
            from={{
              opacity: 0,
              translateY: 20,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              delay: 800,
              duration: 1000,
              type: 'spring',
              damping: 20,
            }}
            style={{
              marginTop: SPACING.lg,
              marginBottom: SPACING.xl,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: COLORS.text.white,
                fontSize: getResponsiveValue(18, 20, 22),
                textAlign: 'center',
                fontWeight: '500',
                marginBottom: SPACING.lg,
                maxWidth: isDesktop() ? 600 : '100%',
              }}
            >
              {HERO_CONTENT.subheadline}
            </Text>
            <TodaySection />
          </MotiView>
        </View>
      </View>

  );
}
