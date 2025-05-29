import { useMutation, useQuery } from '@tanstack/react-query';
import { authClient } from './auth-client';
import { queryClient } from '@/app/_layout';
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
    },
  });
};
