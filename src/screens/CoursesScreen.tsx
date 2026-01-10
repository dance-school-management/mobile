import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native';
import { Text, Skeleton } from '@/components/ui';
import api from '@/server/axios';
import { API_PATHS, getApiUrl } from '@/util/endpoints';
import { CourseProp } from '@/util/types/course';
import CourseCard from '@/components/courses/CourseCard';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function CoursesScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<CourseProp[]>([]);
  const showToast = useAppToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get(getApiUrl(API_PATHS.getScheduleCourses));
      setCourses(response.data);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Skeleton className="h-40 w-full mb-4 rounded-lg" />
          <Skeleton className="h-40 w-full mb-4 rounded-lg" />
          <Skeleton className="h-40 w-full mb-4 rounded-lg" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {courses.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">
            No courses available at the moment.
          </Text>
        ) : (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
