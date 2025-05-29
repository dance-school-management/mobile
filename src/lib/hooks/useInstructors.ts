import { useQuery } from '@tanstack/react-query';
import api from '../axios/axios';
import { Instructor } from '../../util/types/instructors';

const fetchInstructors = async (): Promise<{ instructors: Instructor[] }> => {
  const res = await api.get<{ instructors: Instructor[] }>(
    '/profile/instructors'
  );
  return res.data;
};

export const useInstructors = () =>
  useQuery<{ instructors: Instructor[] }, UniversalError>({
    queryKey: ['instructors'],
    queryFn: fetchInstructors,
    retry: 1,
    refetchOnWindowFocus: true,
  });
