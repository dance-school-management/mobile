import { useMutation } from '@tanstack/react-query';
import { authClient, setHasSessionMarker } from '@/server/auth-client';
import { queryClient } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { useAppToast } from '@/hooks/useAppToast';

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
  const showToast = useAppToast();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onError(error, variables, context) {
      const msg = (error as any)?.message ?? 'Login failed';
      showToast({
        title: 'Login Error',
        description: msg,
        type: 'error',
      });
    },
    onSuccess: async () => {
      await setHasSessionMarker(true);
      await queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};
