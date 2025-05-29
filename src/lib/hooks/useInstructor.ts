import { useQuery } from '@tanstack/react-query';
import api from '../axios/axios';
import { Instructor } from '../../util/types/instructors';

const fetchInstructor = async (id: string): Promise<Instructor> => {
  const res = await api.get<Instructor>(`/profile/instructors/${id}`);
  return res.data;
};
export const useInstructor = (id: string) =>
  useQuery<Instructor, UniversalError>({
    queryKey: [`instructor-${id}`],
    queryFn: () => fetchInstructor(id),
    retry: 1,
    refetchOnWindowFocus: true,
  });
