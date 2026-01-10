import { Box, Button, Text } from '@/components/ui';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/server/axios';
import { API_PATHS, getApiUrl } from '@/util/endpoints';
import { CourseProp } from '@/util/types/course';
import CourseCard from '@/components/courses/CourseCard';
import { router } from 'expo-router';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import { addMonths } from '@/util/dates';

export default function PopularCoursesList({
  refreshKey,
}: {
  refreshKey?: number;
}) {
  const [loading, setLoading] = useState(true);
  const [popularCourses, setPopularCourses] = useState<CourseProp[]>([]);
  const showToast = useAppToast();

  const fetchPopularCourses = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const startDateFrom = addMonths(now, -1).toISOString();
      const startDateTo = addMonths(now, 1).toISOString();

      const response = await api.get(
        getApiUrl(API_PATHS.getMostPopularCourses, {
          startDateFrom,
          startDateTo,
          topK: 3,
        })
      );
      const data = response.data;
      setPopularCourses(data);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching popular courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularCourses();
  }, [refreshKey]);

  if (loading) {
    return (
      <Box className="mb-3">
        <Text className="text-3xl font-bold text-black mb-2">
          Popular Courses
        </Text>
        <Skeleton className="h-40 w-full mt-4 mb-4" />
        <Skeleton className="h-40 w-full mt-4 mb-4" />
        <Skeleton className="h-40 w-full mt-4 mb-4" />
      </Box>
    );
  }

  return (
    <Box className="mb-3">
      <Box className="flex-row justify-between items-center mb-2">
        <Text className="text-3xl font-bold text-black mb-2">
          Popular Courses
        </Text>
        <Button
          className="px-3 py-1 border border-gray-300 rounded-md bg-white"
          variant="outline"
          onPress={() => router.push('/courses')}
        >
          <Text className="text-sm">See All Courses</Text>
        </Button>
      </Box>
      {popularCourses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </Box>
  );
}
