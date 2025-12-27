/**
 * Card Component
 * Reusable container with consistent styling and elevation
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export type CardElevation = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: CardElevation;
  onPress?: () => void;
  padding?: number;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'sm',
  onPress,
  padding,
  noPadding = false,
}) => {
  const getElevationStyle = (): ViewStyle => {
    switch (elevation) {
      case 'none':
        return {};
      case 'sm':
        return Shadows.sm;
      case 'md':
        return Shadows.md;
      case 'lg':
        return Shadows.lg;
      default:
        return Shadows.sm;
    }
  };

  const cardStyle = [
    styles.card,
    getElevationStyle(),
    noPadding ? {} : { padding: padding ?? Spacing.lg },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
});
