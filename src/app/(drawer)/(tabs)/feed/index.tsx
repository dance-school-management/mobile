import React, { useEffect, useState } from 'react';
import api from 'src/lib/axios/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { router } from 'expo-router';

interface CourseProp {
  id: number;
  name: string;
  description: string;
  danceCategoryId: number;
  advancementLevelId: number;
  courseStatus: string;
  danceCategory: { id: number, name: string, description: string, photoPath: string};
  advancementLevel: { id: number, name: string, description: string };
  coursePrice: string;
  instructors: { instructorId: number, instructorName: string, instructorSurname: string}[];
}

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [popularCourses, setPopularCourses] = useState<CourseProp[]>([]);

  const fetchPopularCourses = async () => {
    try {
      const response = await api.get(`/product/pricing/most_popular_courses?startDateFrom=2025-01-01T00:00:00Z&startDateTo=2025-12-31T23:59:59Z&topK=${10}`);
      const data = response.data;
      console.log(data);
      setPopularCourses(data);
    } catch (error) {
      console.error('Error fetching popular courses:', error);
    }
  }

  useEffect(() => {
    fetchPopularCourses();
    setTimeout(() => setLoading(false), 200);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
        <Spinner size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Box className="items-center mb-3">
          <Text className="text-3xl font-bold text-black">
            Popular Courses
          </Text>
        </Box>
        {popularCourses.map((course) => (
          <Pressable
            key={course.id}
            onPress={() => router.push(`/course?id=${course.id}`)}
          >
            <Card key={course.id} className="mb-4 p-4">
              <Heading className="text-xl font-semibold mb-2">{course.name}</Heading>
              <Text className="text-gray-700 mb-2">{course.description.slice(0, 100)}...</Text>
              <Text className="text-gray-500">Category: {course.danceCategory.name}</Text>
              <Text className="text-gray-500">Level: {course.advancementLevel.name}</Text>
              <Text className="text-gray-500">Price: {course.coursePrice}</Text>
              <Text className="text-gray-500">Instructors: {course.instructors.map(instr => `${instr.instructorName} ${instr.instructorSurname}`).join(', ')}</Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}