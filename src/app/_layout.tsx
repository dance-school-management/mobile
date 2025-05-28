import { Stack } from 'expo-router';
import React from 'react';
import '../../global.css'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

export default function Layout() {
  return (
    <GluestackUIProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(drawer)" />
      </Stack>
    </GluestackUIProvider>
  );
}
