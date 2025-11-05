import React from 'react';
import { View } from 'react-native';
import { getResponsiveValue } from '../../utils/responsive';

export default function Container({ children, style, maxWidth = true }) {
  const paddingHorizontal = getResponsiveValue(16, 24, 32);
  const containerMaxWidth = maxWidth ? getResponsiveValue(null, null, 1200) : null;

  return (
    <View style={[
      {
        paddingHorizontal,
        maxWidth: containerMaxWidth,
        width: '100%',
        alignSelf: 'center'
      },
      style
    ]}>
      {children}
    </View>
  );
}