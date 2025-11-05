import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '../ui/Container';
import { SPACING } from '../../constants/design-system';

export default function Section({ 
  children, 
  style, 
  backgroundColor, 
  gradient, 
  paddingVertical = 'large',
  containerStyle 
}) {
  const getPadding = () => {
    switch (paddingVertical) {
      case 'small': return SPACING.lg;
      case 'medium': return SPACING.xl;
      case 'large': return SPACING.xxl;
      case 'none': return 0;
      default: return SPACING.xxl;
    }
  };

  const sectionStyle = {
    paddingVertical: getPadding(),
    ...style
  };

  if (gradient) {
    return (
      <LinearGradient colors={gradient} style={sectionStyle}>
        <Container style={containerStyle}>
          {children}
        </Container>
      </LinearGradient>
    );
  }

  return (
    <View style={[{ backgroundColor }, sectionStyle]}>
      <Container style={containerStyle}>
        {children}
      </Container>
    </View>
  );
}