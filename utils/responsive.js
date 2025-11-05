import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1440
};

export const getResponsiveValue = (mobile, tablet, desktop) => {
  if (width >= BREAKPOINTS.desktop) return desktop || tablet || mobile;
  if (width >= BREAKPOINTS.tablet) return tablet || mobile;
  return mobile;
};

export const isDesktop = () => width >= BREAKPOINTS.desktop;
export const isTablet = () => width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
export const isMobile = () => width < BREAKPOINTS.tablet;

export const wp = (percentage) => (width * percentage) / 100;
export const hp = (percentage) => (height * percentage) / 100;