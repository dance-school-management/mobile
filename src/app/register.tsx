import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { RegisterFormData, RegisterFormSchema } from '@/util/types/types';
import MyFormControl from '@/components/login_registration/MyFormControl';
import { authClient } from '@/lib/auth/auth-client';
import { queryClient } from './_layout';
import { useRegisterMutation } from '@/lib/auth/register';

export default function Page() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const registerMutation = useRegisterMutation();

  const handleSubmit = async () => {
    const result = RegisterFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      for (const err of result.error.errors) {
        const field = err.path[0] as keyof RegisterFormData;
        fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    registerMutation.mutate(formData);
    console.log('Form submitted:', formData);
    // dalsza logika, np. zapytanie do API
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text className="text-xl py-4">Register</Text>
      <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
        {/* Name */}
        <MyFormControl
          error={errors.name}
          field="name"
          fieldValue={formData.name}
          inputType="text"
          label="Name"
          setFormData={setFormData}
        />
        {/* Surname */}
        <MyFormControl
          error={errors.surname}
          field="surname"
          fieldValue={formData.surname}
          inputType="text"
          label="Surname"
          setFormData={setFormData}
        />

        {/* Email */}
        <MyFormControl
          error={errors.email}
          field="email"
          fieldValue={formData.email}
          inputType="text"
          label="Email"
          setFormData={setFormData}
        />

        {/* Password */}
        <MyFormControl
          error={errors.password}
          field="password"
          fieldValue={formData.password}
          inputType="password"
          label="Password"
          setFormData={setFormData}
        />

        {/* Confirm password */}
        <MyFormControl
          error={errors.confirmPassword}
          field="confirmPassword"
          fieldValue={formData.confirmPassword}
          inputType="password"
          label="Confirm password"
          setFormData={setFormData}
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
      <Link href={'/'} asChild>
        <Button className="my-4">
          <ButtonText>Login</ButtonText>
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
