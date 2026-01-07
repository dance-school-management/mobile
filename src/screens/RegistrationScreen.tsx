// src/screens/RegistrationScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { RegisterFormData, RegisterFormSchema } from '@/util/types/types';
import { Link, useRouter } from 'expo-router';
import { useRegisterMutation } from '@/lib/auth/register';
import { Button, ButtonText, Text, VStack, Box } from '@/components/ui';
import MyFormControl from '@/components/login_registration/MyFormControl';
import { Music2Icon } from 'lucide-react-native';

export default function RegistrationScreen() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
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
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-250 dark:bg-slate-900" edges={['left', 'right', 'top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'center', marginBottom: 150 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box className="w-full max-w-md self-center items-center mb-4">
          <Box className="h-12 w-12 rounded-full bg-success-600 items-center justify-center shadow-md mb-2">
            <Music2Icon size={22} color="#ffffff" />
          </Box>
          <Text className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            Dance School
          </Text>
          <Text className="mt-1 text-center text-gray-600 dark:text-gray-400">
            Join us today! Create your account to get started.
          </Text>
          <Box className="mt-3 h-[2px] w-24 bg-success-500 rounded-full" />
        </Box>

        <Box className="w-full max-w-md self-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <Text className="text-xl font-semibold mb-4 text-center">Register</Text>

          <VStack className="w-full">
            <MyFormControl
              error={errors.name}
              field="name"
              fieldValue={formData.name}
              inputType="text"
              label="Name"
              setFormData={setFormData}
            />
            <MyFormControl
              error={errors.surname}
              field="surname"
              fieldValue={formData.surname}
              inputType="text"
              label="Surname"
              setFormData={setFormData}
            />
            <MyFormControl
              error={errors.email}
              field="email"
              fieldValue={formData.email}
              inputType="text"
              label="Email"
              setFormData={setFormData}
            />
            <MyFormControl
              error={errors.password}
              field="password"
              fieldValue={formData.password}
              inputType="password"
              label="Password"
              setFormData={setFormData}
            />
            <MyFormControl
              error={errors.confirmPassword}
              field="confirmPassword"
              fieldValue={formData.confirmPassword}
              inputType="password"
              label="Confirm password"
              setFormData={setFormData}
            />

            <Box className="mt-2 justify-between items-center flex-row">
              <Link href={'/'} asChild>
                <Button className="rounded-md" variant="link">
                  <ButtonText>Already have an account? Log in</ButtonText>
                </Button>
              </Link>
              <Button className="rounded-md" size="sm" onPress={handleSubmit}>
                <ButtonText>Submit</ButtonText>
              </Button>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
