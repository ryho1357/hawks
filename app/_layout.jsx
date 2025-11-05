// app/_layout.jsx - Updated to work with left sidebar
import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import SmoothNavigator from '../components/navigation/SmoothNavigator';
import Header from '../components/navigation/Header';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          
          <View style={{ flex: 1 }}> 
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 300,
              }}
            >
              <Stack.Screen name="index" />
            </Stack>
          </View>
        </View>

        <SmoothNavigator />
      </View>
    </GestureHandlerRootView>
  );
}