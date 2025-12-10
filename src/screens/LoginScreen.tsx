import React, { useState, useEffect } from 'react';
import { LoginFormData, LoginFormSchema } from '@/util/types/types';
import { Link, router } from 'expo-router';
import { useSessionQuery } from '@/lib/auth/session';
import { useLoginMutation } from '@/lib/auth/login';
import { View } from 'react-native';
import { Button, ButtonText, Text, VStack } from '@/components/ui';
import MyFormControl from '@/components/login_registration/MyFormControl';

export default function LoginScreen() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const {
    data: sessionData,
  } = useSessionQuery();

  const loginMutation = useLoginMutation();

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
    loginMutation.mutate(formData);
    console.log('Form submitted:', formData);
  };

  useEffect(() => {
    if (sessionData?.data?.user) {
      setTimeout(() => router.replace('/home'), 200);
    }
  }, [sessionData]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text className="text-xl py-4">Log in</Text>
      <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
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

        <Button
          className="w-fit self-end mt-4"
          size="sm"
          onPress={handleSubmit}
        >
          <ButtonText>Submit</ButtonText>
        </Button>
      </VStack>

      <Link href={'/register'} asChild>
        <Button className="my-4">
          <ButtonText>Register</ButtonText>
        </Button>
      </Link>
    </View>
  );
}
