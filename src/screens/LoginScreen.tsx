import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { LoginFormData, LoginFormSchema } from '@/util/types/types';
import { router } from 'expo-router';
import { useSessionQuery } from '@/lib/auth/session';
import { useLoginMutation } from '@/lib/auth/login';
import { Button, ButtonText, Text, VStack, Box } from '@/components/ui';
import MyFormControl from '@/components/login_registration/MyFormControl';
import { Music2Icon } from 'lucide-react-native';

export default function LoginScreen() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const { data: sessionData } = useSessionQuery();
  const loginMutation = useLoginMutation();

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

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
    loginMutation.mutate(formData);
  };

  useEffect(() => {
    if (sessionData?.data?.user) {
      setTimeout(() => router.replace('/home'), 200);
    }
  }, [sessionData]);

  return (
    <SafeAreaView className="flex-1 bg-slate-250 dark:bg-slate-900" edges={['left', 'right', 'top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16, justifyContent: 'center', marginBottom: 200 }}
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
            Welcome back! Please log in to your account.
          </Text>
          <Box className="mt-3 h-[2px] w-24 bg-success-500 rounded-full" />
        </Box>
        <Box className="w-full max-w-md self-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <Text className="text-xl font-semibold mb-4 text-center">Log in</Text>

          <VStack className="w-full">
            <MyFormControl
              error={errors.email}
              field="email"
              fieldValue={formData.email}
              setFormData={setFormData}
              inputType="text"
              label="Email"
            />

            <MyFormControl
              error={errors.password}
              field="password"
              fieldValue={formData.password}
              setFormData={setFormData}
              inputType="password"
              label="Password"
            />

            <Box className="mt-2 justify-between items-center flex-row">
              <Button className="rounded-md" variant="link" onPress={() => router.push('/register')}>
                <ButtonText>Don't have an account? Sign up</ButtonText>
              </Button>
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
