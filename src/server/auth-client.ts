import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import Constants from 'expo-constants';

const STORAGE_PREFIX = 'Myexpo';
const BIOMETRY_ENABLED_KEY = `${STORAGE_PREFIX}_biometry_enabled`;
const HAS_SESSION_KEY = `${STORAGE_PREFIX}_has_session`;

async function hasStoredSession(): Promise<boolean> {
  const v = await SecureStore.getItemAsync(HAS_SESSION_KEY);
  return v === '1';
}

export async function isBiometryEnabled(): Promise<boolean> {
  const v = await SecureStore.getItemAsync(BIOMETRY_ENABLED_KEY);
  return v === '1';
}

async function requireBiometry(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!hasHardware || !isEnrolled) return false;

  const res = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate',
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
  });

  return res.success === true;
}

export async function canAutoLoginWithBiometry(): Promise<boolean> {
  const enabled = await isBiometryEnabled();
  if (!enabled) return false;

  const sessionExists = await hasStoredSession();
  if (!sessionExists) return false;

  return await requireBiometry();
}

export async function setBiometryEnabled(enabled: boolean): Promise<void> {
  if (enabled) {
    await SecureStore.setItemAsync(BIOMETRY_ENABLED_KEY, '1');
  } else {
    await SecureStore.deleteItemAsync(BIOMETRY_ENABLED_KEY);
  }
}

export async function setHasSessionMarker(hasSession: boolean): Promise<void> {
  if (hasSession) {
    await SecureStore.setItemAsync(HAS_SESSION_KEY, '1');
  } else {
    await SecureStore.deleteItemAsync(HAS_SESSION_KEY);
  }
}

export const authClient = createAuthClient({
  baseURL: Constants.expoConfig?.extra?.AUTH_URL,
  plugins: [
    expoClient({
      scheme: 'Myexpo',
      storagePrefix: STORAGE_PREFIX,
      storage: SecureStore,
    }),
  ],
});
