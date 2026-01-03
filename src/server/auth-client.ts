import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export const authClient = createAuthClient({
  baseURL: Constants.expoConfig?.extra.AUTH_URL,
  plugins: [
    expoClient({
      scheme: "Myexpo",
      storagePrefix: "Myexpo",
      storage: SecureStore,
    }),
  ],
});
