import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, BORDER_RADIUS } from '../../constants/design-system';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  style,
  textStyle,
  ...props 
}) {
  const getButtonStyle = () => {
    const base = {
      paddingHorizontal: size === 'large' ? 32 : size === 'small' ? 16 : 24,
      paddingVertical: size === 'large' ? 16 : size === 'small' ? 8 : 12,
      borderRadius: BORDER_RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.medium
    };

    if (variant === 'secondary') {
      return {
        ...base,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary
      };
    }

    return base;
  };

  const getTextStyle = () => ({
    fontSize: size === 'large' ? 18 : size === 'small' ? 14 : 16,
    fontWeight: '600',
    color: variant === 'secondary' ? COLORS.primary : COLORS.text.white
  });

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} style={style} {...props}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={getButtonStyle()}
        >
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[getButtonStyle(), style]} 
      {...props}
    >
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}