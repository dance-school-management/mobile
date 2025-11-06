import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import api from 'src/lib/axios/axios';

interface ProfileProps {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  startDate: Date;
  description: string;
  photoPath: string;
  favouriteDanceCategories: number[];
  role: string
}

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<ProfileProps>();

  const fetchProfileData = async () => {
    try {
      const response = await api.get(`/profile/user/profile`);
      const data = response.data;
      setUser(data.userData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }

  useEffect(() => {
    fetchProfileData();
    setTimeout(() => setLoading(false), 200);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black" edges={['top', 'left', 'right']}>
        <Spinner size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right']}>
      <Heading className="ml-2 mt-2">Profile</Heading>
      <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Name: {user?.name} {user?.surname}</Text>
      <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Email: {user?.email}</Text>
      <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Phone: {user?.phone}</Text>
      <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Role: {user?.role}</Text>
    </SafeAreaView>
  )
}