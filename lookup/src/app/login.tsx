import { useRouter } from 'expo-router';
import React from 'react';

import type { LoginFormProps } from 'lookup/src/components/login-form';
import { LoginForm } from 'lookup/src/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui2';
import { useAuth } from '@/lib';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log(data);
    signIn({ access: 'access-token', refresh: 'refresh-token' });
    router.push('/');
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
