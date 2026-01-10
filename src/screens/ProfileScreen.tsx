import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ScrollView } from 'react-native-gesture-handler';
import api from '@/server/axios';
import { ProfileProps } from '@/util/types/profile';
import { Box } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';
import { Image, RefreshControl } from 'react-native';
import { API_PATHS } from '@/util/endpoints';
import { DanceCategory } from '@/util/types/cms';
import { Badge, BadgeText } from '@/components/ui/badge';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function ProfileScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [user, setUser] = useState<ProfileProps>();
  const [danceCategories, setDanceCategories] = useState<DanceCategory[]>([]);
  const showToast = useAppToast();

  const fetchDanceCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_PATHS.getDanceCategories);
      const data = response.data;
      setDanceCategories(data);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching dance categories');
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  }

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_PATHS.getProfile);
      const data = response.data;
      setUser(data.userData);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching profile data');
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  }

  useEffect(() => {
    fetchDanceCategories();
    fetchProfileData();
  }, []);

  const onRefresh = React.useCallback(() => {
    if (refreshing || loading) return;
    setRefreshing(true);
    fetchProfileData().then(() => setRefreshing(false));
  }, []);

  if (loading || refreshing) {
    return (
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <ScrollView contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
            <Box className="flex-row justify-center mb-4">
              <Skeleton className="w-32 h-32 rounded-full" />
            </Box>
            <Skeleton className="h-6 w-1/2 mb-2 ml-2" />
            <Skeleton className="h-6 w-1/2 mb-2 ml-2" />
            <Skeleton className="h-6 w-3/4 mb-2 ml-2" />
            <Skeleton className="h-6 w-1/2 mb-2 ml-2" />
            <Skeleton className="h-6 w-1/4 mb-2 ml-2" />
            <Skeleton className="h-6 w-1/3 mb-2 ml-2" />
          </Box>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
          <Box className="flex-row justify-center mb-4">
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/women/26.jpg" }}
              className="w-32 h-32 rounded-full"
            />
          </Box>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-1">Name: {user?.name}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-1">Surname: {user?.name}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-1">Email: {user?.email}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-1">Phone: {user?.phone}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-1">Role: {user?.role}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-1">Favourite dance categories: </Text>
          <Box className="flex-row flex-wrap gap-2">
          {danceCategories.filter(dc => user?.favouriteDanceCategories.includes(dc.id)).map(dc => (
            <Badge variant="outline" action="info" key={dc.id} className="rounded-lg">
              <BadgeText>{dc.name}</BadgeText>
            </Badge>
          ))}
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}