import { useQuery } from '@tanstack/react-query';
import { authClient } from './auth-client';
const fetchSession = async () => {
  const session = await authClient.getSession();
  return session;
};

export const useSessionQuery = () =>
  useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    retry: false,
  });
