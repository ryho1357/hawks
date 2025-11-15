// app/hero.jsx - Enhanced version
import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Linking, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { COLORS, SPACING, SHADOWS } from '../constants/design-system';
import { HERO_CONTENT, INDOOR_PRACTICE_SCHEDULE } from '../constants/content';
import { getAllMatches } from '../constants/gameHistory';
import { getResponsiveValue, isDesktop } from '../utils/responsive';


const { width, height } = Dimensions.get('window');
const HAWKS_LOGO = require('../assets/images/logo/hawks.png');

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

const TodayDetailRow = ({ icon, label, value, onPress }) => {
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? { onPress, activeOpacity: 0.75 }
    : {};

  return (
    <Container
      {...containerProps}
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
            color: onPress ? COLORS.primary : COLORS.text.primary,
            lineHeight: 22,
            textDecorationLine: onPress ? 'underline' : 'none',
          }}
        >
          {value}
        </Text>
      </View>
    </Container>
  );
};

const getCountdownParts = (targetDate) => {
  if (!(targetDate instanceof Date) || Number.isNaN(targetDate.getTime())) return null;
  const now = Date.now();
  const diff = targetDate.getTime() - now;
  const clamped = Math.max(diff, 0);
  const days = Math.floor(clamped / (24 * 60 * 60 * 1000));
  const hours = Math.floor((clamped % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((clamped % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((clamped % (60 * 1000)) / 1000);
  return { days, hours, minutes, seconds, isPast: diff <= 0 };
};

const formatCountdownLabel = (parts) => {
  if (!parts) return '';
  const pad = (value) => String(value).padStart(2, '0');
  const time = `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
  return parts.days > 0 ? `${parts.days}d ${time}` : time;
};

const CountdownTimer = ({
  targetDate,
  title,
  note,
  variant = 'kickoff',
  highlightDate,
  pastLabel,
}) => {
  const [parts, setParts] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    if (!targetDate) return undefined;
    setParts(getCountdownParts(targetDate));
    const interval = setInterval(() => {
      setParts(getCountdownParts(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate?.getTime()]);

  if (!targetDate || !parts) return null;

  const hasReachedTarget = parts.isPast;
  const highlightThreshold = highlightDate instanceof Date ? highlightDate : targetDate;
  const hasPassedHighlight =
    highlightThreshold instanceof Date && !Number.isNaN(highlightThreshold.getTime())
      ? Date.now() >= highlightThreshold.getTime()
      : hasReachedTarget;

  let palette = {
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.4)',
    label: '#1D4ED8',
  };
  let completeLabel = pastLabel || (variant === 'arrival' ? 'Game on!' : 'Match in progress');

  if (variant === 'arrival') {
    if (hasPassedHighlight) {
      palette = {
        bg: 'rgba(16,185,129,0.15)',
        border: 'rgba(16,185,129,0.45)',
        label: '#0F9D58',
      };
    } else {
      palette = {
        bg: 'rgba(251,191,36,0.25)',
        border: 'rgba(251,191,36,0.6)',
        label: '#92400E',
      };
    }
  }

  const countdownLabel = hasReachedTarget ? completeLabel : formatCountdownLabel(parts);

  return (
    <View
      style={{
        marginTop: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: 20,
        backgroundColor: palette.bg,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: palette.label,
          letterSpacing: 1,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: getResponsiveValue(22, 26, 28),
          fontWeight: '800',
          color: COLORS.text.primary,
          marginTop: 4,
        }}
      >
        {countdownLabel}
      </Text>
      {note ? (
        <Text
          style={{
            marginTop: 6,
            color: COLORS.text.primary,
            fontWeight: '600',
          }}
        >
          {note}
        </Text>
      ) : null}
      {variant === 'arrival' ? (
        <Text
          style={{
            marginTop: 4,
            color: COLORS.text.secondary,
            fontSize: 13,
          }}
        >
          Players should arrive 1 hour before start time.
        </Text>
      ) : null}
    </View>
  );
};

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_LABELS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toDateKey = (date) => {
  if (!(date instanceof Date)) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (date) => {
  if (!(date instanceof Date)) return '';
  return `${DAY_LABELS[date.getDay()]} • ${MONTH_LABELS_SHORT[date.getMonth()]} ${date.getDate()}`;
};

const parseEventDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;

  const normalizedTime = `${timeStr}`.replace(/[–—]/g, '-');
  const primaryMatch = normalizedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  const meridiemMatch = normalizedTime.match(/(AM|PM)/i);
  if (!primaryMatch) return null;

  const [yearStr, monthStr, dayStr] = dateStr.split('-') || [];
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const day = Number(dayStr);
  if (
    Number.isNaN(year) ||
    Number.isNaN(monthIndex) ||
    Number.isNaN(day) ||
    monthIndex < 0 ||
    monthIndex > 11
  ) {
    return null;
  }

  let hours = Number(primaryMatch[1]);
  const minutes = Number(primaryMatch[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  const meridiem = (primaryMatch[3] || meridiemMatch?.[1] || '').toUpperCase();
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  const date = new Date(year, monthIndex, day, hours, minutes, 0, 0);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const formatTimeLabel = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const buildTodaySchedule = (matches = [], practices = [], referenceDate = new Date()) => {
  const todayKey = toDateKey(referenceDate);
  if (!todayKey) return [];
  const dateLabel = formatDateLabel(referenceDate);
  const events = [];

  matches.forEach((match, index) => {
    if (match?.date !== todayKey) return;
    const startDateTime = parseEventDateTime(match?.date, match?.kickoff);
    events.push({
      id: `match-${match.date}-${match?.opponent || index}`,
      type: 'game',
      dateLabel,
      badge: match?.isHome ? 'Home Match' : 'Away Match',
      badgeColors: match?.isHome
        ? {
            bg: 'rgba(16,185,129,0.15)',
            text: '#0F9D58',
          }
        : {
            bg: 'rgba(251,191,36,0.25)',
            text: '#92400E',
          },
      title: `${match?.isHome ? 'vs' : '@'} ${match?.opponent || 'Opponent TBA'}`,
      subtitle: match?.opponentClub || match?.seasonName,
      time: match?.kickoff || 'Time TBD',
      location: match?.location || 'Location TBD',
      note: match?.notes || match?.seasonName || '',
      startDateTime,
      arrivalDateTime: startDateTime
        ? new Date(startDateTime.getTime() - 60 * 60 * 1000)
        : null,
    });
  });

  practices.forEach((session, index) => {
    if (session?.date !== todayKey) return;
    const startDateTime = parseEventDateTime(session?.date, session?.time);
    events.push({
      id: `practice-${session.date}-${index}`,
      type: 'practice',
      dateLabel,
      badge: session?.title || 'Training',
      badgeColors: {
        bg: 'rgba(16,185,129,0.12)',
        text: '#0F9D58',
      },
      title: session?.title || 'Indoor Practice',
      subtitle: session?.location || session?.day || 'Indoor Session',
      time: session?.time || 'Time TBD',
      location: session?.location || 'Location TBD',
      note: session?.address || '',
      startDateTime,
      arrivalDateTime: startDateTime
        ? new Date(startDateTime.getTime() - 60 * 60 * 1000)
        : null,
    });
  });

  return events;
};

const TodaySection = ({ events, onLocationPress }) => {
  if (!events?.length) return null;
  const dateLabel = events[0]?.dateLabel;

  return (
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
            marginBottom: SPACING.lg,
          }}
        >
          {dateLabel}
        </Text>

        {events.map((event, index) => {
          const kickoffLabel = formatTimeLabel(event.startDateTime);
          const arrivalLabel = formatTimeLabel(event.arrivalDateTime);
          return (
            <View
              key={event.id}
              style={{
                marginTop: index === 0 ? 0 : SPACING.xl,
                paddingTop: index === 0 ? 0 : SPACING.md,
                borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
                borderTopColor: 'rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <View
                pointerEvents="none"
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0.03,
                }}
              >
                <Image
                  source={HAWKS_LOGO}
                  resizeMode="contain"
                  style={{
                    width: isDesktop() ? '90%' : '100%',
                    aspectRatio: 1,
                  }}
                />
              </View>
              <View
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: SPACING.md,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: event.badgeColors.bg,
                  marginBottom: SPACING.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: event.badgeColors.text,
                    letterSpacing: 1,
                  }}
                >
                  {event.badge}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: COLORS.text.primary,
                }}
              >
                {event.title}
              </Text>
              {event.subtitle ? (
                <Text
                  style={{
                    fontSize: 15,
                    color: COLORS.text.secondary,
                    marginTop: 2,
                  }}
                >
                  {event.subtitle}
                </Text>
              ) : null}
              <View style={{ marginTop: SPACING.md }}>
                <TodayDetailRow icon="schedule" label="Time" value={event.time} />
                <TodayDetailRow
                  icon="place"
                  label="Location"
                  value={event.location}
                  onPress={
                    event.location && onLocationPress
                      ? () => onLocationPress(event.location)
                      : undefined
                  }
                />
              </View>
              {event.note ? (
                <Text
                  style={{
                    marginTop: SPACING.sm,
                    color: COLORS.text.secondary,
                    lineHeight: 22,
                  }}
                >
                  {event.note}
                </Text>
              ) : null}

              {event.arrivalDateTime ? (
                <CountdownTimer
                  targetDate={event.arrivalDateTime}
                  title="ARRIVAL COUNTDOWN"
                  note={
                    arrivalLabel
                      ? `Arrive by ${arrivalLabel}${
                          kickoffLabel ? ` • Kickoff ${kickoffLabel}` : ''
                        }`
                      : ''
                  }
                  variant="arrival"
                  highlightDate={event.startDateTime}
                />
              ) : (
                <Text
                  style={{
                    marginTop: SPACING.lg,
                    color: COLORS.text.secondary,
                    fontSize: 13,
                  }}
                >
                  Players should arrive 1 hour before start time.
                </Text>
              )}

              {event.startDateTime ? (
                <CountdownTimer
                  targetDate={event.startDateTime}
                  title="KICKOFF COUNTDOWN"
                  note={kickoffLabel ? `Kickoff ${kickoffLabel}` : ''}
                  variant="kickoff"
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </MotiView>
  );
};

const navigateToSlug = (router, slug) => {
  if (slug === 'home') {
    router.replace('/');
  } else {
    router.replace({ pathname: '/', params: { page: slug } });
  }
};

const openLocationInMaps = (location) => {
  if (!location) return;
  const query = encodeURIComponent(location.trim());
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  Linking.openURL(url).catch((err) => console.warn('Unable to open maps link', err));
};

export default function Hero() {
  const router = useRouter();
  const heroHeight = getResponsiveValue(height * 0.8, height * 0.7, height * 0.9);
  const allMatches = useMemo(() => getAllMatches(), []);
  const todaySchedule = useMemo(
    () => buildTodaySchedule(allMatches, INDOOR_PRACTICE_SCHEDULE),
    [allMatches]
  );

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
            <TodaySection events={todaySchedule} onLocationPress={openLocationInMaps} />
          </MotiView>
        </View>
      </View>

  );
}
