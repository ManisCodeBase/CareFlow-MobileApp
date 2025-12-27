/**
 * Theme Constants for CareFlow App
 * Modern iOS healthcare design system aligned with HIPAA-compliant medical applications
 * Following Apple Human Interface Guidelines and healthcare industry standards
 */

export const Colors = {
  // Primary medical blue - professional, trustworthy, calming
  primary: '#007AFF', // iOS blue - medical industry standard
  primaryDark: '#0051D5',
  primaryLight: '#4DA2FF',
  
  // Clinical status colors - AMA color coding standards
  success: '#34C759', // iOS green - positive outcomes
  successLight: '#E8F8EB',
  successDark: '#248A3D',
  
  error: '#FF3B30', // iOS red - critical alerts
  errorLight: '#FFE5E5',
  errorDark: '#D32F2F',
  
  warning: '#FF9500', // iOS orange - warnings
  warningLight: '#FFF4E5',
  warningDark: '#FF8800',
  
  // Text hierarchy - WCAG AA compliant
  text: {
    primary: '#000000', // Pure black for medical records
    secondary: '#3C3C43', // iOS secondary text
    tertiary: '#8E8E93', // iOS tertiary text
    disabled: '#C7C7CC',
    white: '#FFFFFF',
    inverse: '#FFFFFF',
  },
  
  // Background layers - iOS elevated design
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7', // iOS grouped background
    tertiary: '#FFFFFF',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  
  // Borders and separators - subtle and professional
  border: {
    light: '#E5E5EA',
    medium: '#D1D1D6',
    dark: '#8E8E93',
    separator: 'rgba(60, 60, 67, 0.36)',
  },
  
  // Clinical status indicators
  status: {
    pending: '#FF9500', // Orange for pending
    inProgress: '#007AFF', // Blue for active
    completed: '#34C759', // Green for completed
    cancelled: '#8E8E93', // Gray for cancelled
    urgent: '#FF3B30', // Red for urgent
  },
  
  // Semantic colors for medical context
  clinical: {
    vital: '#FF3B30', // Critical vitals
    stable: '#34C759', // Stable condition
    attention: '#FF9500', // Needs attention
    info: '#007AFF', // Informational
  },
};

// iOS standard spacing - 8pt grid system
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

// iOS standard corner radius
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  card: 16, // Standard card radius
  button: 12, // Standard button radius
  full: 9999,
};

// iOS typography scale - SF Pro Display/Text
export const FontSizes = {
  xs: 11, // Caption 2
  sm: 13, // Caption 1
  md: 15, // Subheadline
  base: 17, // Body (iOS default)
  lg: 19, // Title 3
  xl: 22, // Title 2
  xxl: 28, // Title 1
  xxxl: 34, // Large Title
  display: 40, // Display
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

// iOS standard shadows for elevation
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// iOS standard touch targets - minimum 44pt
export const TouchTarget = {
  minHeight: 44,
  minWidth: 44,
};

// iOS standard transitions
export const Transitions = {
  fast: 200,
  normal: 300,
  slow: 500,
};
