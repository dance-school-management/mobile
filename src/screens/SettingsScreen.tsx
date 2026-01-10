import React, { useEffect, useState } from 'react';
import api from '@/server/axios';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Spinner, Switch, Text, VStack } from '@/components/ui';
import { RefreshControl, ScrollView, Linking } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import Constants from 'expo-constants';
import { useCameraPermissions } from 'expo-camera';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import { API_PATHS } from '@/util/endpoints';
import AlertDialogDelete from '@/components/alert/AlertDialogDelete';
import { useLogoutMutation } from '@/lib/auth/logout';
import PasswordChangeModal from '@/components/settings/PasswordChangeModal';
import { useFocusEffect } from 'expo-router';
import { useSessionQuery } from '@/lib/auth/session';
import { isBiometryEnabled, setBiometryEnabled } from '@/server/auth-client';

export default function SettingsScreen() {
  const [enabledNotifications, setEnabledNotifications] = useState<boolean>(false);
  const [enabledPushNotifications, setEnabledPushNotifications] = useState<boolean>(false);
  const [enableBiometrics, setEnableBiometrics] = useState<boolean>(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const showToast = useAppToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const logoutMutation = useLogoutMutation();
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';

  const cameraEnabled = cameraPermission?.granted ?? false;

  const fetchNotificationSettings = async () => {
    try {
      const response = await api.get(API_PATHS.getNotificationRegistrationStatus);
      const data = response.data;
      setEnabledNotifications(data.hasEnabledNotifications);
      setEnabledPushNotifications(data.isRegisteredForPushNotifications);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching notification settings');
    } finally {
      setLoading(false);
    }
  };

  const updateNotifications = async () => {
    try {
      await api.post(API_PATHS.postToggleNotifications, { enable: !enabledNotifications });
      if (enabledPushNotifications && enabledNotifications) {
        updatePushNotifications();
      }
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error updating notification settings');
    } finally {
      fetchNotificationSettings();
    }
  };

  const updatePushNotifications = async () => {
    if (enabledPushNotifications) {
      try {
        await api.put(API_PATHS.putUnregisterPushNotifications);
      } catch (error) {
        showToastErrorAxiosMessage(showToast, error, 'Error unregistering for push notifications');
      }
    } else {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        showToast({
          title: 'Push notification permission denied',
          description: 'Cannot register for push notifications without permission.',
          type: 'warning',
        });
        return;
      }
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.EAS_PROJECT_ID,
        })
      ).data;
      try {
        await api.post(API_PATHS.postRegisterPushNotifications, { pushToken: token });
      } catch (error) {
        showToastErrorAxiosMessage(showToast, error, 'Error registering for push notifications');
      }
    }
    fetchNotificationSettings();
  };

  const updateBiometrics = async (nextValue: boolean) => {
    setEnableBiometrics(nextValue);
    try {
      await setBiometryEnabled(nextValue);

      showToast({
        title: 'Biometrics updated',
        description: nextValue ? 'Biometric login enabled.' : 'Biometric login disabled.',
        type: 'success',
      });
    } catch (error) {
      setEnableBiometrics(!nextValue);
      showToast({
        title: 'Error updating biometrics',
        description: 'Could not save biometric preference.',
        type: 'error',
      });
    }
  };

  const handleCameraPermission = async (enable: boolean) => {
    if (enable) {
      try {
        const res = await requestCameraPermission();
        if (res?.status !== 'granted') {
          showToast({
            title: 'No access to camera',
            description: 'Camera permission is required to enable camera features.',
            type: 'warning',
          });
        }
      } catch (err) {
        showToast({
          title: 'Error requesting camera permission',
          type: 'error',
        });
      }
    } else {
      await Linking.openSettings();
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.post(API_PATHS.deleteUser, {});
      logoutMutation.mutate();
      setTimeout(() => {
        showToast({
          title: 'Successfully deleted user',
          description: 'User deleted',
          type: 'success',
        });
      }, 200);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error deleting user');
    }
  };

  const loadBiometricsState = async () => {
    try {
      const enabled = await isBiometryEnabled();
      setEnableBiometrics(enabled);
    } catch {
      setEnableBiometrics(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchNotificationSettings();
      await loadBiometricsState();
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      void (async () => {
        await fetchNotificationSettings();
        await loadBiometricsState();
      })();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    if (refreshing || loading) return;
    setRefreshing(true);
    fetchNotificationSettings().then(() => setRefreshing(false));
  }, [refreshing, loading]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black" edges={['left', 'right']}>
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView
        className="flex-1 my-4 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
          <Box className="mb-2">
            <Text className="text-lg font-medium mb-2">Notifications Settings</Text>
            <Divider />
            <Box className="mt-2">
              <VStack className="flex-row justify-between items-center">
                <Text className="text-base">Enable Notifications</Text>
                <Switch value={enabledNotifications} onValueChange={updateNotifications} />
              </VStack>
              <VStack className="flex-row justify-between items-center">
                <Text className="text-base">Enable Push Notifications</Text>
                <Switch
                  value={enabledPushNotifications}
                  onValueChange={updatePushNotifications}
                  disabled={!enabledNotifications}
                />
              </VStack>
            </Box>
          </Box>

          <Box className="mb-2">
            <Text className="text-lg font-medium mb-2">Biometrics Settings</Text>
            <Divider />
            <Box className="mt-2">
              <VStack className="flex-row justify-between items-center">
                <Text className="text-base">Enable Biometric Log in</Text>
                <Switch value={enableBiometrics} onValueChange={updateBiometrics} />
              </VStack>
            </Box>
          </Box>

          {role !== 'STUDENT' && (
            <Box className="mb-2">
              <Text className="text-lg font-medium mb-2">Camera Settings</Text>
              <Divider />
              <Box className="mt-2">
                <VStack className="flex-row justify-between items-center">
                  <Text className="text-base">Enable Camera</Text>
                  <Switch value={cameraEnabled} onValueChange={handleCameraPermission} />
                </VStack>
              </Box>
            </Box>
          )}

          <Box className="mb-2">
            <Text className="text-lg font-medium mb-2">Profile Settings</Text>
            <Divider />
            <Box className="mt-2">
              <Button size="sm" action="secondary" className="my-1" onPress={() => setShowPasswordDialog(true)}>
                <ButtonText>Change Password</ButtonText>
              </Button>
              <Button size="sm" action="negative" className="my-1" onPress={() => setShowDeleteDialog(true)}>
                <ButtonText>Delete Profile</ButtonText>
              </Button>
            </Box>
          </Box>
        </Box>
      </ScrollView>

      <AlertDialogDelete
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteUser}
        title="Delete Profile"
        description="Are you sure you want to delete your profile? This action cannot be undone."
      />
      <PasswordChangeModal isOpen={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} />
    </SafeAreaView>
  );
}
