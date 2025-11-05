// constants/design-system.js

export const COLORS = {
  // --- Core Brand Colors ---
  primary: '#B22222', // Hawks Red – bold, confident, energetic
  primaryLight: '#E57373', // Lighter red for hover, accents, gradients
  primaryDark: '#7F1D1D', // Deep maroon red for contrast
  secondary: '#FFFFFF', // Clean white as the secondary brand color
  secondaryLight: '#F9FAFB', // Off-white for subtle backgrounds

  // --- Text Colors ---
  text: {
    primary: '#1F2937', // Dark slate gray for body text
    secondary: '#4B5563', // Muted gray for subtext
    light: '#9CA3AF', // Light gray for hints/labels
    white: '#FFFFFF', // White for text on red backgrounds
    account: '#10B981', // Optional accent (success/active)
    lock: '#DC2626', // Bright red for alerts or warnings
  },

  // --- Backgrounds ---
  background: {
    main: '#FFFFFF', // Clean white for main sections
    secondary: '#F3F4F6', // Soft neutral gray for cards/alternating rows
    tertiary: '#E5E7EB', // Slightly darker gray for footer/contrast
    banner: '#B22222', // Primary red for hero or callout backgrounds
  },

  // --- Status Colors ---
  status: {
    pending: '#FBBF24', // Amber
    placed: '#60A5FA', // Blue
    processed: '#A78BFA', // Purple
    completed: '#10B981', // Green
    cancelled: '#EF4444', // Red
  },
};

// --- Shadows ---
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
  },
};

// --- Spacing Scale ---
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// --- Typography ---
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
  },
};

// --- Border Radius ---
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};
