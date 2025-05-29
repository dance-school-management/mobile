import { useMutation } from '@tanstack/react-query';
import { authClient } from './auth-client';
import { queryClient } from '@/app/_layout';
import { useRouter } from 'expo-router';

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
    },
    {
      onError: (ctx) => {
        alert(ctx.error.message || 'Registration failed');
        throw new Error(ctx.error.message || 'Registration failed');
      },
    }
  );
};

export const useRegisterMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['register'],
    mutationFn: register,
    onError: (ctx: any) => {
      //alert(ctx.error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['session'] });
      router.push('/(drawer)/(tabs)/feed');
    },
  });
};
