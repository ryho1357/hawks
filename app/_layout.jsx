// app/_layout.jsx - Updated to work with left sidebar
import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import Header from '../components/navigation/Header';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
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
                <Stack.Screen name="portal" />
                <Stack.Screen name="evaluations" />
              </Stack>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
