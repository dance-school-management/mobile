import { View, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { ScrollView } from 'react-native-gesture-handler';
import api from 'src/lib/axios/axios';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { BarChart } from 'react-native-gifted-charts'
import { Spinner } from '@/components/ui';

interface LearntDanceCategoryProp {
  courseId: number;
  danceCategoryId: number;
  danceCategoryName: string;
  advancementLevelId: number;
  advancementLevelName: string;
  finishedDate: Date;
  instructorsNames: string[];
}

interface CourseAttendanceRatesProp {
  courseId: number;
  courseName: string;
  hasStarted: boolean;
  instructorsNames: string[];
  attendedCount: number;
  allCount: number;
}

interface HoursSpentPerDanceCategoryProp {
  danceCategoryName: string;
  spentHours: number;
}

interface HoursSpentPerInstructorProp {
  instructorFirstname: string;
  instructorSurname: string;
  spentHours: number;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [learntDanceCategories, setLearntDanceCategories] = useState<LearntDanceCategoryProp[]>([]);
  const [coursesAttendanceRates, setCoursesAttendanceRates] = useState<CourseAttendanceRatesProp[]>([]);
  const [hoursSpentPerDanceCategory, setHoursSpentPerDanceCategory] = useState<HoursSpentPerDanceCategoryProp[]>([]);
  const [hoursSpentPerInstructor, setHoursSpentPerInstructor] = useState<HoursSpentPerInstructorProp[]>([]);

  const hoursSpentTotal = hoursSpentPerDanceCategory.reduce((total, category) => total + category.spentHours, 0);
  const screenWidth = Dimensions.get('window').width;

  const fetchLearntDanceCategories = async () => {
    try {
      const response = await api.get(`/enroll/progress/learnt-dance-categories`);
      const data = response.data;
      setLearntDanceCategories(data);
    } catch (error) {
      console.error('Error fetching learnt dance categories:', error);
    }
  }

  const fetchCoursesAttendanceRates = async () => {
    try {
      const response = await api.get(`/enroll/progress/courses-attendance-rates`);
      const data = response.data;
      setCoursesAttendanceRates(data.courseAttendancesRates);
    } catch (error) {
      console.error('Error fetching courses attendance rates:', error);
    }
  }

  const fetchHoursSpentPerDanceCategory = async () => {
    try {
      const response = await api.get(`/enroll/progress/hours-spent/dance-categories`);
      const data = response.data;
      setHoursSpentPerDanceCategory(data.spentHoursStatsList);
    } catch (error) {
      console.error('Error fetching hours spent per dance category:', error);
    }
  }

  const fetchHoursSpentPerInstructor = async () => {
    try {
      const response = await api.get(`/enroll/progress/hours-spent/instructors`);
      const data = response.data;
      setHoursSpentPerInstructor(data.spentHoursStatsList);
    } catch (error) {
      console.error('Error fetching hours spent per instructor:', error);
    }
  }

  useEffect(() => {
    fetchLearntDanceCategories();
    fetchCoursesAttendanceRates();
    fetchHoursSpentPerDanceCategory();
    fetchHoursSpentPerInstructor();
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
        {/*<ScrollView className="flex-1 p-4">*/}
        {/*  <Heading size="lg" className="m-2">Ongoing Courses:</Heading>*/}
        {/*  <View className="mb-4">*/}
        {/*    <Skeleton className="h-8 w-1/2 mb-4" />*/}
        {/*  </View>*/}
        {/*  <Heading size="lg" className="m-2">Mastered Styles:</Heading>*/}
        {/*  <View className="mb-4">*/}
        {/*    <Skeleton className="h-8 w-1/2 mb-4" />*/}
        {/*  </View>*/}
        {/*  <SkeletonText _lines={4} className="mb-6" />*/}
        {/*</ScrollView>*/}
        <Spinner size='large' />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
      <ScrollView className="flex-1 p-4">
        <Heading size="lg" className="ml-2">Ongoing Courses:</Heading>
        <View className="mb-4">
          {coursesAttendanceRates && coursesAttendanceRates.length !== 0 ? (
            coursesAttendanceRates
              .filter((c: CourseAttendanceRatesProp) => c.hasStarted && c.attendedCount < c.allCount)
              .map((c: CourseAttendanceRatesProp) => (
                <Card key={c.courseId} size="md" variant="filled" className="m-1">
                  <Heading size="md" className="mb-1">{c.courseName}</Heading>
                  <Text size="sm">Attendance: {c.attendedCount}/{c.allCount}</Text>
                  <Text size="sm">Instructors: {c.instructorsNames.join(', ')}</Text>
                </Card>
              ))
          ) : (
            <Text size="sm" className="m-2">No ongoing courses</Text>
          )}
        </View>
        <Heading size="lg" className="ml-2">Mastered Styles:</Heading>
        <View className="mb-4">
          {learntDanceCategories && learntDanceCategories.length !== 0 ? (
            learntDanceCategories.sort((a, b) => new Date(b.finishedDate).getTime() - new Date(a.finishedDate).getTime()).map((c: LearntDanceCategoryProp) => (
              <Card key={c.courseId} size="md" variant="filled" className="m-1">
                <Heading size="md" className="mb-1">{c.danceCategoryName} - {c.advancementLevelName}</Heading>
                <Text size="sm">Mastered at: {new Date(c.finishedDate).toLocaleDateString()}</Text>
                <Text size="sm">Instructors: {c.instructorsNames.length > 0 ? c.instructorsNames.join(', ') : 'N/A'}</Text>
              </Card>
            ))
          ) : (
            <Text size="sm" className="m-2">No mastered styles</Text>
          )}
        </View>
        <Heading size="md" className="ml-2 mb-2">{`Hours spent at school: ${hoursSpentTotal.toFixed(0)}h`}</Heading>
        <Heading size="lg" className="ml-2">Hours spent per dance category:</Heading>
        <View style={{ marginLeft: -50, height: hoursSpentPerDanceCategory.length * 60, marginBottom: 20 }}>
          <BarChart
            data={hoursSpentPerDanceCategory.sort((a, b) => b.spentHours - a.spentHours).map(dc => (
              {value: dc.spentHours, label: dc.danceCategoryName}
            ))}
            width={screenWidth - 50}
            horizontal
            barWidth={22}
            barBorderRadius={4}
            frontColor="#8888FF"
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisAtTop
            disablePress
            initialSpacing={0}
            xAxisLabelTextStyle={
              { color: 'black', fontSize: 14, width: 150, includeFontPadding: false, textAlign: 'left', marginLeft: 40 }
            }
          />
        </View>
        <Heading size="lg" className="ml-2">Hours spent per Instructor:</Heading>
        <View style={{ marginLeft: -50, height: hoursSpentPerInstructor.length * 60, marginBottom: 20 }}>
          <BarChart
            data={hoursSpentPerInstructor.sort((a, b) => b.spentHours - a.spentHours).map(i => (
              {value: i.spentHours, label: `${i.instructorFirstname?.charAt(0)}. ${i.instructorSurname}`}
            ))}
            width={screenWidth - 50}
            horizontal
            barWidth={22}
            barBorderRadius={4}
            frontColor="#FF6F61"
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisAtTop
            disablePress
            initialSpacing={0}
            xAxisLabelTextStyle={
              { color: 'black', fontSize: 14, width: 150, includeFontPadding: false, textAlign: 'left', marginLeft: 40 }
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
