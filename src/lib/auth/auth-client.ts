import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { Env } from 'env';
export const authClient = createAuthClient({
  baseURL: 'http://localhost:8000/auth/api/auth',
  plugins: [
    expoClient({
      scheme: "Myexpo",
      storagePrefix: "Myexpo",
      storage: SecureStore,
    }),
  ],
});
