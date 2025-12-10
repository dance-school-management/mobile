import { Box, Text } from '@/components/ui';
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import api from '@/server/axios';
import { API_PATHS, getApiUrl } from '@/util/endpoints';
import { CourseProp } from '@/util/types/course'
import CourseCard from '@/components/courses/CourseCard';

export default function PopularCoursesList({ refreshKey } : { refreshKey?: number }) {
    const [loading, setLoading] = useState(true);
    const [popularCourses, setPopularCourses] = useState<CourseProp[]>([]);

    const fetchPopularCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get(getApiUrl(API_PATHS.getMostPopularCourses, { 'startDateFrom': '2025-01-01T00:00:00Z', 'startDateTo': '2025-12-31T23:59:59Z', 'topK': 3 }));
            const data = response.data;
            setPopularCourses(data)
        } catch (error) {
            console.error('Error fetching popular courses:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPopularCourses();
    }, [refreshKey]);

    if (loading) {
        return (
            <Box className="items-center mb-3">
                <Text className="text-3xl font-bold text-black mb-2">
                    Popular Courses
                </Text>
                <Skeleton className="h-40 w-full mt-4 mb-4" />
                <Skeleton className="h-40 w-full mt-4 mb-4" />
                <Skeleton className="h-40 w-full mt-4 mb-4" />
            </Box>
        )
    }

    return (
        <Box className="items-center mb-3">
            <Text className="text-3xl font-bold text-black mb-2">
                Popular Courses
            </Text>
            {popularCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </Box>
    )
    }