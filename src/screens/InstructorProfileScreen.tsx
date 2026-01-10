import {
  Mail,
  Phone,
} from 'lucide-react-native';
import React, { useCallback, useState, useEffect } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Box,
  Badge,
  Skeleton
} from '@/components/ui';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';
import { Instructor } from '@/util/types/instructors';
import BarChartComponent from '@/components/charts/BarChartComponent';
import { getDateYearsAfter } from '@/util/dates';
import { ScheduleItem } from '@/util/types/schedule';
import InstructorClasses from '@/components/instructor/InstructorClasses'
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function InstructorProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { instructorId } = useLocalSearchParams();
  const [instructor, setInstructor] = useState<Instructor>();
  const [instructorClasses, setInstructorClasses] = useState<ScheduleItem[]>([]);
  const showToast = useAppToast();

  const fetchInstructorClasses = async () => {
    try {
      const response = await api.get(`${API_PATHS.getSchedule}?dateFrom=${new Date().toISOString()}&dateTo=${getDateYearsAfter(new Date(), 1).toISOString()}`);
      const data = response.data as ScheduleItem[];
      setInstructorClasses(data.filter(item => item.instructors.some(instr => instr.id === instructorId)));
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching instructor classes');
    }
  }

  const fetchInstructor = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_PATHS.getInstructors}/${instructorId}`);
      setInstructor(response.data);
      await fetchInstructorClasses();
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching instructor details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructor();
  }, [instructorId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInstructor();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
            <Box className="items-center mb-4">
              <Skeleton className="w-32 h-32 rounded-full" />
              <Skeleton className="h-8 w-48 mt-4" />
              <Skeleton className="h-4 w-64 mt-2" />
              <Skeleton className="h-4 w-48 mt-2" />
            </Box>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-2" />
          </Box>
        </ScrollView>
      </SafeAreaView>
    );
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
            <Box className="items-center mb-4">
              <Image
                source={{ uri: `https://randomuser.me/api/portraits/men/${instructorId}.jpg` }}
                className="w-32 h-32 rounded-full"
              />
              <Text className="text-2xl font-bold text-black dark:text-white mt-4">
                {instructor?.name} {instructor?.surname}
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 mr-4">
                <Mail size={16} className="inline-block mr-1" />
                {instructor?.email}
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                <Phone size={16} className="inline-block mr-2" />
                {instructor?.phone}
              </Text>
            </Box>
            <Text className="text-black dark:text-white">
              {instructor?.description}
            </Text>
            <Text className="text-black dark:text-white mt-4 font-semibold">
              Specializations:
            </Text>
            <Box className="flex-row flex-wrap mt-2">
              {instructor?.favouriteDanceCategories.map((spec) => (
                <Badge
                  key={spec}
                  variant="outline"
                  action="info"
                  className="mr-2 mb-2 rounded-lg"
                >
                  <Text className="text-sm">{spec}</Text>
                </Badge>
              ))}
            </Box>
            <InstructorClasses classes={instructorClasses.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).slice(0,4)} />
            <BarChartComponent data={instructor?.experience?.map((exp) => ({
              label: `${exp.danceCategoryName}`,
              value: exp.spentHours,
            })).sort((a, b) => b.value - a.value) ?? []} title="Time Spent on Classes (hrs)" />
          </Box>
        </ScrollView>
    </SafeAreaView>
  );
}
