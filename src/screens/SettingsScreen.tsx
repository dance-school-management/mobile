import React, { useEffect, useState } from 'react';
import api from '@/server/axios';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Spinner, Switch, Text, VStack } from '@/components/ui';
import { RefreshControl, ScrollView } from 'react-native';

export default function SettingsScreen() {
  const [enabledNotifications, setEnabledNotifications] = useState(false);
  const [enabledPushNotifications, setEnabledPushNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationSettings = async () => {
    try {
      const response = await api.get(`/notification/notification/status`)
      const data = response.data;
      setEnabledNotifications(data.hasEnabledNotifications);
      setEnabledPushNotifications(data.isRegisteredForPushNotifications);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    } finally {
      setLoading(false);
    }
  }

  const updateNotifications = async () => {
    try {
      const response = await api.post(`/notification/notification/toggle`, { enable: !enabledNotifications })
      const data = response.data;
      setEnabledNotifications(data.notificationsEnabilityStatus);
      if (enabledPushNotifications && enabledNotifications) {
        updatePushNotifications();
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  const updatePushNotifications = async () => {
    if (enabledPushNotifications) {
      try {
        await api.put(`/notification/notification/push/unregister`)
      } catch (error) {
        console.error('Error unregistering from push notifications:', error);
      }
    } else {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: "eafcc134-43ac-4627-839a-9c8410352708",
      })).data;
      console.log(token);
      try {
        await api.post(`/notification/notification/register`, { pushToken: token })
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    }
  }

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const onRefresh = React.useCallback(() => {
    if (refreshing || loading) return;
    setRefreshing(true);
    fetchNotificationSettings().then(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black" edges={['top', 'left', 'right']}>
        <Spinner size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
      <ScrollView className="flex-1 my-4 px-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <VStack className="mb-2">
          <Text className="text-lg font-medium mb-2">Notifications Settings</Text>
          <Divider />
          <VStack>
            <VStack className="flex-row justify-between items-center">
              <Text className="text-base">Enable Notifications</Text>
              <Switch value={enabledNotifications} onValueChange={updateNotifications}/>
            </VStack>
            <VStack className="flex-row justify-between items-center">
              <Text className="text-base">Enable Push Notifications</Text>
              <Switch value={enabledPushNotifications} onValueChange={updatePushNotifications} disabled={!enabledNotifications}/>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
