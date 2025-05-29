import { useMutation } from '@tanstack/react-query';
import { authClient } from './auth-client';
import { queryClient } from '@/app/_layout';
import { useRouter } from 'expo-router';

type LoginFormData = {
  email: string;
  password: string;
};

const login = async (formData: LoginFormData) => {
  return await authClient.signIn.email(
    {
      email: formData.email,
      password: formData.password,
    },
    {
      onError(context) {
        throw new Error(context.error.message || 'Login failed');
      },
    }
  );
};

export const useLoginMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onError(error, variables, context) {
      alert(error.message || 'Login failed');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['session'] });
      router.push('/(drawer)/(tabs)/feed');
    },
  });
};
