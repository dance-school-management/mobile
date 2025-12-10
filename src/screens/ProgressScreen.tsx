import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Box, Skeleton } from '@/components/ui';
import { ScrollView } from 'react-native-gesture-handler';
import {
  LearntDanceCategoryProp,
  CourseAttendanceRatesProp,
  HoursSpentPerDanceCategoryProp,
  HoursSpentPerInstructorProp } from '@/util/types/progress';
import OnGoingCourses from '@/components/progress/OnGoingCourses';
import LearntDanceCategories from '@/components/progress/LearntDanceCategories';
import BarChartComponent from '@/components/charts/BarChartComponent';
import { API_PATHS } from '@/util/endpoints';

export default function ProgressScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [learntDanceCategories, setLearntDanceCategories] = useState<LearntDanceCategoryProp[]>([]);
  const [coursesAttendanceRates, setCoursesAttendanceRates] = useState<CourseAttendanceRatesProp[]>([]);
  const [hoursSpentPerDanceCategory, setHoursSpentPerDanceCategory] = useState<HoursSpentPerDanceCategoryProp[]>([]);
  const [hoursSpentPerInstructor, setHoursSpentPerInstructor] = useState<HoursSpentPerInstructorProp[]>([]);

  const hoursSpentTotal = hoursSpentPerDanceCategory.reduce((total, category) => total + category.spentHours, 0);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const [
        learntRes,
        coursesRes,
        hoursDanceRes,
        hoursInstructorRes
      ] = await Promise.all([
        api.get(API_PATHS.getProgressLearntDanceCategories),
        api.get(API_PATHS.getProgressCoursesAttendanceRates),
        api.get(API_PATHS.getProgressHoursSpentDanceCategories),
        api.get(API_PATHS.getProgressHoursSpentInstructors)
      ]);

      setLearntDanceCategories(learntRes.data);
      setCoursesAttendanceRates(coursesRes.data.courseAttendancesRates);
      setHoursSpentPerDanceCategory(hoursDanceRes.data.spentHoursStatsList);
      setHoursSpentPerInstructor(hoursInstructorRes.data.spentHoursStatsList);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProgress();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <ScrollView
          style={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-40 w-full mb-4 rounded-lg" />
            <Skeleton className="h-40 w-full mb-4 rounded-lg" />
          </Box>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView
        style={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
          <OnGoingCourses courses={coursesAttendanceRates} />
          <LearntDanceCategories danceCategories={learntDanceCategories} />
          <Text className="mt-4 text-lg font-semibold mb-2">{`Total Hours Spent at School: ${hoursSpentTotal.toFixed(0)}h`}</Text>
          <BarChartComponent data={
            hoursSpentPerDanceCategory.sort((a, b) => b.spentHours - a.spentHours).map(dc => (
                {value: dc.spentHours, label: dc.danceCategoryName}))} title="Hours spent per dance category (hrs)"
          />
          <BarChartComponent data={
            hoursSpentPerInstructor.sort((a, b) => b.spentHours - a.spentHours).map(i => (
                {value: i.spentHours, label: `${i.instructorFirstname?.charAt(0)}. ${i.instructorSurname}`}))} title="Hours spent per instructor (hrs)"
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
