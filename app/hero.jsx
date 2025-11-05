// app/hero.jsx - Enhanced version
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { 
  Easing
} from 'react-native-reanimated';
import { MotiView, MotiText } from 'moti';
import { COLORS, SPACING, SHADOWS } from '../constants/design-system';
import { HERO_CONTENT } from '../constants/content';
import { getResponsiveValue, isDesktop } from '../utils/responsive';
import Button from '../components/ui/Button';
import AIBackground from '../components/backgrounds/AIBackground';

const { width, height } = Dimensions.get('window');

const AnimatedIcon = ({ name, size, color, delay = 0 }) => {
  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0,
        rotate: '0deg',
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: '360deg',
      }}
      transition={{
        delay: delay,
        duration: 1000,
        rotate: {
          repeat: Infinity,
          duration: 10000,
          easing: Easing.linear,
        },
        scale: {
          type: 'spring',
          damping: 15,
        }
      }}
      style={{
        position: 'absolute',
      }}
    >
      <MaterialIcons name={name} size={size} color={color} />
    </MotiView>
  );
};

const TypewriterText = ({ text, delay = 0 }) => {
  return (
    <MotiText
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay,
        duration: 2000,
        type: 'timing',
      }}
      style={{
        fontSize: getResponsiveValue(28, 36, 48),
        fontWeight: 'bold',
        color: COLORS.text.primary,
        textAlign: 'center',
        lineHeight: getResponsiveValue(28, 36, 48) * 1.2
      }}
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

export default function Hero() {
  const router = useRouter();
  const heroHeight = getResponsiveValue(height * 0.8, height * 0.7, height * 0.9);

  return (
    <AIBackground variant="ai">
      <View style={{
        minHeight: heroHeight,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: getResponsiveValue(16, 24, 32),
        paddingVertical: SPACING.xxl,
        position: 'relative'
      }}>
        {/* Animated Background Icons */}
        <View style={{ position: 'absolute', top: 80, right: 50 }}>
          <AnimatedIcon name="psychology" size={60} color={COLORS.primary + '20'} delay={500} />
        </View>
        
        <View style={{ position: 'absolute', top: 200, left: 30 }}>
          <AnimatedIcon name="memory" size={40} color={COLORS.secondary + '30'} delay={1000} />
        </View>
        
        <View style={{ position: 'absolute', bottom: 150, right: 80 }}>
          <AnimatedIcon name="settings" size={50} color={COLORS.background.secondary + '25'} delay={1500} />
        </View>

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
          >
            <TypewriterText text={HERO_CONTENT.headline} />
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
            }}
          >
            <Text style={{
              fontSize: getResponsiveValue(16, 18, 22),
              color: COLORS.text.secondary,
              textAlign: 'center',
              lineHeight: getResponsiveValue(16, 18, 22) * 1.4,
              maxWidth: isDesktop() ? 700 : '100%'
            }}>
              {HERO_CONTENT.subheadline}
            </Text>
          </MotiView>

          {/* Animated CTA Buttons */}
          <View style={{
            flexDirection: isDesktop() ? 'row' : 'column',
            alignItems: 'center',
            gap: SPACING.md,
            width: '100%',
            maxWidth: 500,
            marginBottom: SPACING.xl
          }}>
            <FloatingButton
              title={HERO_CONTENT.cta.primary}
              onPress={() => router.push('/portfolio')}
              delay={1200}
            />
            
            <FloatingButton
              title={HERO_CONTENT.cta.secondary}
              onPress={() => router.push('/contact')}
              variant="secondary"
              delay={1400}
            />
          </View>

        {/* Animated Trust Indicators */}
        <MotiView
          from={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: isDesktop() ? 1 : 0.9, // Scale down to 90% on mobile
          }}
          transition={{
            delay: 1600,
            duration: 800,
            type: 'spring',
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isDesktop() ? SPACING.lg : SPACING.sm, // Smaller gap on mobile
          }}>
            {[
              { icon: 'verified', text: 'Excellent Rating', color: COLORS.status.completed },
              { icon: 'star', size: 18, color: COLORS.background.secondary },
              { icon: 'star', size: 18, color: COLORS.background.secondary },
              { icon: 'star', size: 18, color: COLORS.background.secondary },
              { icon: 'star', size: 18, color: COLORS.background.secondary },
              { icon: 'star', size: 18, color: COLORS.background.secondary },
            ].map((item, index) => (
              <MotiView
                key={index}
                from={{
                  opacity: 0,
                  translateY: 20,
                }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                }}
                transition={{
                  delay: 1800 + (index * 200),
                  type: 'spring',
                  damping: 15,
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.background.main + '80',
                  paddingHorizontal: isDesktop() ? SPACING.md : SPACING.sm, // Smaller padding on mobile
                  paddingVertical: SPACING.sm,
                  borderRadius: 20,
                  backdropFilter: 'blur(10px)',
                  minWidth: item.text ? undefined : (isDesktop() ? 40 : 36), // Smaller min-width on mobile
                }}
              >
                <MaterialIcons 
                  name={item.icon} 
                  size={isDesktop() ? 18 : 16} // Smaller icons on mobile
                  color={item.color} 
                />
                {item.text && (
                  <Text style={{
                    marginLeft: SPACING.xs,
                    fontSize: isDesktop() ? 14 : 12, // Smaller text on mobile
                    color: COLORS.text.secondary,
                    fontWeight: '500'
                  }}>
                    {item.text}
                  </Text>
                )}
              </MotiView>
            ))}
          </View>
        </MotiView>
        </View>

        
      </View>
    </AIBackground>
  );
}