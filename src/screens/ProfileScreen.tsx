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
import { Button, ButtonIcon } from '@/components/ui/button';
import { EditIcon } from '@/components/ui/icon'

export default function ProfileScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [user, setUser] = useState<ProfileProps>();
  const [danceCategories, setDanceCategories] = useState<DanceCategory[]>([]);

  const fetchDanceCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_PATHS.getDanceCategories);
      console.log(response);
      const data = response.data;
      console.log('Dance Categories:', data);
      setDanceCategories(data);
    } catch (error) {
      console.error('Error fetching dance categories:', error);
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  }

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profile/user/profile`);
      const data = response.data;
      setUser(data.userData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
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
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Name: {user?.name}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Surname: {user?.name}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Email: {user?.email}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Phone: {user?.phone}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Role: {user?.role}</Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 m-2">Favourite dance categories: </Text>
          {danceCategories.filter(dc => user?.favouriteDanceCategories.includes(dc.id)).map(dc => (
            <Badge variant="outline" action="info" key={dc.id} className="m-2">
              <BadgeText>{dc.name}</BadgeText>
            </Badge>
          ))}
          <Box className="flex-row justify-end mt-6">
            <Button size="lg" className="rounded-full p-3.5">
              <ButtonIcon as={EditIcon} />
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}