// constants/design-system.js
export const COLORS = {
  // --- Core Brand Colors ---
  primary: '#E31B23', // Hawks Red – vibrant, energetic red from the logo
  primaryLight: '#FF4444', // Brighter red for hover states and accents
  primaryDark: '#B91C1C', // Deep red for contrast and depth
  
  secondary: '#1A1A1A', // Bold black from logo outline/details
  secondaryLight: '#2D2D2D', // Lighter black for hover states
  
  accent: '#D4AF37', // Gold/metallic yellow from the dragon's claws
  accentLight: '#F4D03F', // Brighter gold for highlights
  accentDark: '#B8941E', // Deeper gold for contrast
  
  neutral: '#6B7280', // Medium gray from logo shading
  neutralLight: '#9CA3AF', // Light gray
  neutralDark: '#374151', // Dark gray
  
  white: '#FFFFFF', // Clean white from logo and text
  
  // --- Text Colors ---
  text: {
    primary: '#1A1A1A', // Black for main text
    secondary: '#4B5563', // Gray for secondary text
    light: '#9CA3AF', // Light gray for hints/labels
    white: '#FFFFFF', // White for text on red/dark backgrounds
    accent: '#D4AF37', // Gold for emphasis
    error: '#E31B23', // Hawks red for errors/alerts
  },
  
  // --- Backgrounds ---
  background: {
    main: '#FFFFFF', // Clean white for main sections
    secondary: '#F9FAFB', // Soft off-white for cards
    tertiary: '#F3F4F6', // Light gray for alternating sections
    dark: '#1A1A1A', // Black for dark sections/footer
    banner: '#E31B23', // Hawks red for hero sections
    bannerDark: '#B91C1C', // Deep red for overlays
    accent: '#D4AF37', // Gold for special callouts
  },
  
  // --- Status Colors ---
  status: {
    pending: '#F59E0B', // Amber/Gold tone
    placed: '#3B82F6', // Blue
    processed: '#8B5CF6', // Purple
    completed: '#10B981', // Green
    cancelled: '#E31B23', // Hawks red
    active: '#D4AF37', // Gold for active states
  },
  
  // --- Interactive States ---
  interactive: {
    hover: '#FF4444', // Bright red on hover
    active: '#B91C1C', // Deep red when active
    disabled: '#D1D5DB', // Gray for disabled states
  },
};

// --- Shadows ---
export const SHADOWS = {
  small: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  red: {
    shadowColor: '#E31B23',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gold: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
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
    display: 40,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  fonts: {
    // Suggestions for Hawks brand personality:
    // heading: 'System font bold for impact'
    // body: 'System font for readability'
  },
};

// --- Border Radius ---
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
};

// --- Gradients ---
export const GRADIENTS = {
  primary: ['#E31B23', '#B91C1C'], // Red gradient
  dark: ['#1A1A1A', '#2D2D2D'], // Black gradient
  accent: ['#F4D03F', '#D4AF37'], // Gold gradient
  hero: ['#E31B23', '#B91C1C', '#1A1A1A'], // Red to black
};