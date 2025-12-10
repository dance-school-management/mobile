import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { Env } from '../../env';
import { LOCAL_IP } from '@/server/axios'

export const authClient = createAuthClient({
  baseURL: `http://${LOCAL_IP}:8000/auth/api/auth`,
  plugins: [
    expoClient({
      scheme: "Myexpo",
      storagePrefix: "Myexpo",
      storage: SecureStore,
    }),
  ],
});
