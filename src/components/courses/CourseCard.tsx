import React from 'react';
import { CourseProp } from '@/util/types/course';
import { Box, Text, Pressable, Badge } from '@/components/ui';
import { router } from 'expo-router';

export default function CourseCard({ course }: { course: CourseProp }) {
    return (
        <Pressable onPress={() => {router.push(`/course/${course.id}`)}}>
            <Box className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-1 mb-1">
                <Text className="text-xl font-bold mb-1">{course.name}</Text>
                <Text className="text-gray-600 mb-1">{course.description.slice(0, 200)}...</Text>
                <Box className="flex-row flex-wrap justify-between mb-2">
                    <Badge variant="outline" action={course.courseStatus === 'SALE' ? 'success' : (course.courseStatus === 'ONGOING' ? 'warning' : 'muted')} className="mr-2 rounded-lg">
                        <Text className="text-sm">{course.courseStatus}</Text>
                    </Badge>
                </Box>
                <Box className="flex-row flex-wrap justify-between">
                    <Badge variant="outline" action="info" className="mr-2 mb-2 rounded-lg">
                        <Text className="text-sm">{course.danceCategory.name} - {course.advancementLevel.name}</Text>
                    </Badge>
                    <Badge variant="outline" action="success" className="mr-2 mb-2 rounded-lg">
                        <Text className="text-sm">{course.price}</Text>
                    </Badge>
                </Box>
            </Box>
        </Pressable>
    )
}