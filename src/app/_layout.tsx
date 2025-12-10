import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import '../../global.css';
import { Platform } from 'react-native';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSyncQueriesExternal } from 'react-query-external-sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { storage } from '../lib/mmkv';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { PaymentProvider } from '@/context/PaymentContext'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false
  }),
});

export const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

function AppContent() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data) {
        router.push(`//(drawer)/(tabs)/notifications`)
      }
    });
    return () => subscription.remove();
  }, []);

  useSyncQueriesExternal({
    queryClient,
    socketURL: 'http://localhost:42831',
    deviceName: Platform?.OS || 'web',
    platform: Platform?.OS || 'web',
    deviceId: Platform?.OS || 'web',
    extraDeviceInfo: {
      appVersion: '1.0.0',
    },
    enableLogs: false,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
    },
    mmkvStorage: storage,
    asyncStorage: AsyncStorage,
    secureStorage: SecureStore,
    secureStorageKeys: [
      'userToken',
      'refreshToken',
      'biometricKey',
      'deviceId',
    ],
  });

  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <PaymentProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="register" />
            <Stack.Screen name="(drawer)" />
          </Stack>
        </PaymentProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
