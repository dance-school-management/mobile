import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  VStack,
  Text,
} from '@/components/ui';
import { AlertCircleIcon } from '@/components/ui/icon';
import { z } from 'zod';
import { LoginFormData, LoginFormSchema } from '@/util/types/types';
import MyFormControl from '@/components/login_registration/MyFormControl';
import { authClient } from '@/lib/auth/auth-client';
import * as cookie from 'cookie';

export default function Page() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const router = useRouter();
  setTimeout(() => {
    const cookies = cookie.parse(authClient.getCookie());
    if (cookies['better-auth.session_token']) {
      // authClient.signOut();
      router.push('/(drawer)/(tabs)/feed');
    }
  }, 0);

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  const handleSubmit = () => {
    const result = LoginFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const err of result.error.errors) {
        const field = err.path[0] as keyof LoginFormData;
        fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    console.log('Form submitted:', formData);
    // dalsza logika, np. zapytanie do API
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text className="text-xl py-4">Log in</Text>
      <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
        {/* Email */}
        <MyFormControl
          error={errors.email}
          field="email"
          fieldValue={formData.email}
          setFormData={setFormData}
          inputType="text"
          label="Email"
        />

        {/* Password */}
        <MyFormControl
          error={errors.password}
          field="password"
          fieldValue={formData.password}
          setFormData={setFormData}
          inputType="password"
          label="Password"
        />

        {/* Submit button */}
        <Button
          className="w-fit self-end mt-4"
          size="sm"
          onPress={handleSubmit}
        >
          <ButtonText>Submit</ButtonText>
        </Button>
      </VStack>

      {/* Navigation */}
      <Link href={'/register'} asChild>
        <Button>
          <ButtonText>Register</ButtonText>
        </Button>
      </Link>
      <Link href={'/(drawer)/(tabs)/feed'} asChild>
        <Button>
          <ButtonText>Go to app</ButtonText>
        </Button>
      </Link>
    </View>
  );
}
