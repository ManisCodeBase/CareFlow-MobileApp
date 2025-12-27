/**
 * Input Component
 * Reusable text input with iOS styling and validation support
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  containerStyle?: ViewStyle;
  required?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  containerStyle,
  required = false,
  helperText,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border.medium;
  };

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <View style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}>
        <Ionicons
          name={icon}
          size={20}
          color={error ? Colors.error : isFocused ? Colors.primary : Colors.text.secondary}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          isFocused && styles.inputContainerFocused,
          error ? styles.inputContainerError : undefined,
        ]}
      >
        {icon && iconPosition === 'left' && renderIcon()}
        
        <TextInput
          {...textInputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            icon && iconPosition === 'left' && styles.inputWithIconLeft,
            icon && iconPosition === 'right' && styles.inputWithIconRight,
          ]}
          placeholderTextColor={Colors.text.tertiary}
        />

        {icon && iconPosition === 'right' && renderIcon()}
      </View>

      {(error || helperText) && (
        <View style={styles.helperContainer}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  required: {
    color: Colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    minHeight: 44,
    paddingHorizontal: Spacing.md,
  },
  inputContainerFocused: {
    borderWidth: 2,
    paddingHorizontal: Spacing.md - 1, // Compensate for thicker border
  },
  inputContainerError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.text.primary,
    paddingVertical: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    fontWeight: FontWeights.regular,
    letterSpacing: -0.2,
  },
  inputWithIconLeft: {
    marginLeft: Spacing.sm,
  },
  inputWithIconRight: {
    marginRight: Spacing.sm,
  },
  iconLeft: {
    marginRight: 0,
  },
  iconRight: {
    marginLeft: 0,
  },
  helperContainer: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    fontWeight: FontWeights.regular,
    letterSpacing: -0.1,
  },
  helperText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    fontWeight: FontWeights.regular,
    letterSpacing: -0.1,
  },
});
