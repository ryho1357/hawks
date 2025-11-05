import React from 'react';
import { Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../constants/design-system';

export function Heading1({ children, style, ...props }) {
  return (
    <Text style={[
      {
        fontSize: TYPOGRAPHY.sizes.xxxl,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.text.primary,
        marginBottom: 16
      },
      style
    ]} {...props}>
      {children}
    </Text>
  );
}

export function Heading2({ children, style, ...props }) {
  return (
    <Text style={[
      {
        fontSize: TYPOGRAPHY.sizes.xxl,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.text.primary,
        marginBottom: 12
      },
      style
    ]} {...props}>
      {children}
    </Text>
  );
}

export function BodyText({ children, style, ...props }) {
  return (
    <Text style={[
      {
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: TYPOGRAPHY.weights.normal,
        color: COLORS.text.secondary,
        lineHeight: 24
      },
      style
    ]} {...props}>
      {children}
    </Text>
  );
}

export function Caption({ children, style, ...props }) {
  return (
    <Text style={[
      {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: TYPOGRAPHY.weights.medium,
        color: COLORS.text.light
      },
      style
    ]} {...props}>
      {children}
    </Text>
  );
}

// Default export for convenience
export default {
  Heading1,
  Heading2,
  BodyText,
  Caption
};