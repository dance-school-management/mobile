import { useMutation } from '@tanstack/react-query';
import { authClient } from '../../server/auth-client';
import { queryClient } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { useAppToast } from '@/hooks/useAppToast';

type RegisterFormData = {
  email: string;
  password: string;
  name: string;
  surname: string;
};

const register = async (formData: RegisterFormData) => {
  return await authClient.signUp.email(
    {
      email: formData.email,
      password: formData.password,
      name: formData.name + ' ' + formData.surname,
      // @ts-ignore
      first_name: formData.name,
      surname: formData.surname,
      role: 'STUDENT',
    },
    {
      onError: (ctx) => {
        throw new Error(ctx.error.message || 'Sign up failed');
      },
    }
  );
};

export const useRegisterMutation = () => {
  const router = useRouter();
  const showToast = useAppToast();
  return useMutation({
    mutationKey: ['register'],
    mutationFn: register,
    onError: (ctx: any) => {
      const msg = (ctx as any)?.message ?? 'Sign up failed';
      showToast({
        title: 'Sign Up Error',
        description: msg,
        type: 'error',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['session'] });
      showToast({
        title: 'Sign up successful',
        description: 'Successfuly created your account. Now you can log in.',
        type: 'success',
      })
      router.replace('/');
    },
  });
};
