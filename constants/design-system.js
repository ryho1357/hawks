// constants/design-system.js
export const COLORS = {
    primary: '#A7C957', // Soft Sage Green for freshness, health, and sustainability
    primaryLight: '#EAF1E2', // Adjust to a lighter tone of Soft Sage Green
    primaryDark: '#7A9A40', // Adjust to a darker tone of Soft Sage Green
    secondary: '#FF6F61', // Coral Pink for warmth, femininity, and approachability
    secondaryLight: '#FFD0CA', // Adjust to a lighter tone of Coral Pink
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      light: '#9CA3AF',
      white: '#FFFFFF',
      account: '#34D399',
      lock: '#FF3131',
    },
    background: {
      main: '#FAF9F6', // Soft Off-White for a clean, minimal, and airy feel
      secondary: '#FFA726', // Warm Tangerine for energy, positivity, and appetite stimulation
      tertiary: '#F3F4F6',
    },
    status: {
      pending: '#FCD34D',
      placed: '#60A5FA',
      processed: '#A78BFA',
      completed: '#10B981',
      cancelled: '#EF4444',
    }
  };
  
  export const SHADOWS = {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    }
  };
  
  export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };
  
  export const TYPOGRAPHY = {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  };
  
  export const BORDER_RADIUS = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  };