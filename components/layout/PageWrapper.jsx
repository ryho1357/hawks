// components/layout/PageWrapper.jsx - Updated
import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/design-system';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';

export default function PageWrapper({ children, showHeader = false, showFooter = false }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background.main }}>
      <View style={{ flex: 1 }}>
        {showHeader && <Header />}
        <View style={{ flex: 1 }}>
          {children}
        </View>
        {showFooter && <Footer />}
      </View>
    </SafeAreaView>
  );
}