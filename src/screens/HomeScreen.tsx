import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PersonalWelcome from '@/components/home/PersonalWelcome'
import PopularCoursesList from '@/components/home/PopularCoursesList'
import PinnedBlogList from "@/components/home/PinnedBlogList";
import { RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((prevKey) => prevKey + 1);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey((prevKey) => prevKey + 1);
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-250 dark:bg-slate-900" edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <PersonalWelcome refreshKey={refreshKey} />
        <PopularCoursesList refreshKey={refreshKey} />
        <PinnedBlogList refreshKey={refreshKey} />
      </ScrollView>
    </SafeAreaView>
  )
}