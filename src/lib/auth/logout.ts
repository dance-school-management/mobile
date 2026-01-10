import { useMutation, useQuery } from '@tanstack/react-query';
import { authClient } from '../../server/auth-client';
import { queryClient } from '@/app/_layout';
import { router } from 'expo-router';
const Logout = async () => {
  const logutStatus = await authClient.signOut();

  return logutStatus;
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: Logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.removeQueries({ queryKey: ['session'], exact: true });
      queryClient.setQueryData(['session'], null);
      setTimeout(() => router.replace('/'), 100);
    },
  });
};
