import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Box,
  Heading,
  Text,
  Badge,
  Divider,
  Button,
  ButtonText,
  Skeleton,
} from '@/components/ui';
import { RefreshControl, ScrollView } from 'react-native';
import { API_PATHS, getApiUrl } from '@/util/endpoints';
import { CourseProp, ClassProp } from '@/util/types/course';
import CourseClasses from '@/components/courses/CourseClasses';
import { usePayment } from '@/context/PaymentContext';
import { router } from 'expo-router';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import { useSessionQuery } from '@/lib/auth/session';

export default function CourseScreen() {
  const { courseId } = useLocalSearchParams();
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [course, setCourse] = useState<CourseProp>();
  const [classes, setClasses] = useState<ClassProp[]>([]);
  const [groupNumbers, setGroupNumbers] = useState<number[]>([]);
  const { startPayment } = usePayment();
  const showToast = useAppToast();

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(getApiUrl(API_PATHS.getScheduleCoursesClasses, { coursesIds: courseId as string }));
      setCourse(response.data[0].courseData);
      setClasses(response.data[0].classes);
      setGroupNumbers(response.data[0].classes.map((c: ClassProp) => c.groupNumber).filter((v: number, i: number, a: number[]) => a.indexOf(v) === i));
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching course details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourseDetails();
    setRefreshing(false);
  }, []);

  const handleEnroll = async () => {
    try {
      const response = await api.post(API_PATHS.postOrderCourse, {
        courseId: course?.id,
        groupNumber: groupNumbers[0],
      })
      const { sessionUrl } = response.data;
      if (!sessionUrl) return;
      startPayment(sessionUrl, () => {
        showToast({
          title: 'Enrollment Successful',
          description: `You have successfully enrolled in ${course?.name}.`,
          type: 'success',
        })
        router.replace('/courses')
      });
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error initiating enrollment');
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
            <Skeleton className="h-8 w-3/4 mb-2 rounded-lg" />
            <Skeleton className="h-4 w-full mb-2 rounded-lg" />
            <Skeleton className="h-4 w-full mb-2 rounded-lg" />
            <Skeleton className="h-4 w-1/2 mb-2 rounded-lg" />
            <Divider className="my-2" />
            <Skeleton className="h-6 w-1/3 mb-2 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg mt-4" />
          </Box>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView
          contentContainerStyle={{ padding: 8 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-2">
          <Heading className="text-2xl mb-2">{course?.name}</Heading>
          <Text className="text-gray-600 dark:text-gray-300 mb-2">{course?.description}</Text>
          <Divider className="my-2" />
          <Text className="text-md font-semibold mb-2">Instructors: {course?.instructors.map(i => `${i.name} ${i.surname}`).join(', ')}</Text>
          <Badge variant="outline" action="info" className="self-start rounded-lg mb-2">
            <Text className="text-md">{course?.courseStatus}</Text>
          </Badge>
          <Box className="flex-row flex-wrap justify-between mb-4">
            <Badge variant="outline" action="warning" className="mr-2 rounded-lg">
              <Text className="text-md">{course?.danceCategory.name}-{course?.advancementLevel.name}</Text>
            </Badge>
            <Badge variant="outline" action="success" className="mr-2 rounded-lg">
              <Text className="text-md">Price: {course?.price}</Text>
            </Badge>
          </Box>
          {role === 'STUDENT' && (
            <Button action={!(course?.courseStatus === 'SALE') ? 'secondary' : 'positive'} className="mx-4" onPress={handleEnroll} disabled={!(course?.courseStatus === 'SALE')}>
              <ButtonText>Enroll Now</ButtonText>
            </Button>
          )}
          <CourseClasses classes={classes.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).slice(0,6)} />
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}