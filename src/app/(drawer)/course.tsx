import { useEffect, useState } from 'react';
import api from 'src/lib/axios/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, Spinner } from '@/components/ui';
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text';
import { ScrollView } from 'react-native-gesture-handler';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {View} from "react-native";

interface CourseDataProp {
  id: number;
  name: string;
  description: string;
  danceCategoryId: number;
  advancementLevelId: number;
  courseStatus: string;
  danceCategory: {
    id: number;
    name: string;
    description: string;
    photoPath: string;
  };
  advancementLevel: {
    id: number;
    name: string;
    description: string;
  };
  coursePrice: number;
  instructors: { id: number; name: string; surname: string }[];
}

interface ClassProp {
    id: number;
    classTemplateId: number;
    groupNumber: number;
    startDate: Date;
    endDate: Date;
    peopleLimit: number;
    classRoomId: number;
    classStatus: string;
    classTemplate: {
        id: number;
        courseId: number;
        name: string;
        description: string;
        price: string;
        currency: string;
        danceCategoryId: number;
        advancementLevelId: number;
        classType: string;
        scheduleTileColor: string;
        course: {
            id: number;
            name: string;
            description: string;
            danceCategoryId: number;
            advancementLevelId: number;
            courseStatus: string;
            customPrice: string;
            danceCategory: {
                id: number;
                name: string;
                description: string;
                photoPath: string;
            },
            advancementLevel: {
                id: number;
                name: string;
                description: string;
            }
        }
    },
    instructors: [
        {
            id: string;
            name: string;
            surname: string;
        }
    ]
}

interface CourseDetailsProp {
    courseData: CourseDataProp;
    classes: ClassProp[];
}

function formatDateRange(start: Date, end: Date) {
    const dateOpts: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
    const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const day = start.toLocaleDateString(undefined, dateOpts);
    const startTime = start.toLocaleTimeString([], timeOpts);
    const endTime = end.toLocaleTimeString([], timeOpts);
    return { day, startTime, endTime };
}

export default function Page() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [courseDetails, setCourseDetails] = useState<CourseDetailsProp>();
    const navigation = useNavigation();


    const fetchCourseDetails = async () => {
        try {
            const response = await api.get(`/product/schedule/courses/classes?coursesIds=${id}`);
            const data = response.data;
            console.log(data);
            setCourseDetails(data[0]);
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    }

    const handleBack = () => {
        // const navAny = navigation as any;
        // if (navAny?.canGoBack && navAny?.canGoBack()) {
            // navAny.goBack();
        // } else {
            router.push('/feed');
        // }
    }

    useEffect(() => {
        setLoading(true);
        fetchCourseDetails();
        setTimeout(() => setLoading(false), 400);
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
                <Spinner size='large' />
            </SafeAreaView>
        )
    }

    if (!courseDetails) {
        return (
            <SafeAreaView className="flex-1" edges={['left', 'right', 'bottom']}>
                <Text>No data</Text>
            </SafeAreaView>
        )
    }

    const course = courseDetails.courseData;
    const upcoming = (courseDetails.classes || [])
        .map(c => ({ ...c, startDate: new Date(c.startDate), endDate: new Date(c.endDate) }))
        .sort((a, b) => (a.startDate as Date).getTime() - (b.startDate as Date).getTime())
        .slice(0, 10);

    return (
        <SafeAreaView className="flex-1 bg-white p-4" edges={['left', 'right', 'bottom']}>
            <Pressable
                onPress={handleBack}
                accessibilityLabel="Back"
                style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 20,
                    padding: 8,
                    borderRadius: 20,
                }}
            >
                <Text style={{ fontSize: 20 }}>←</Text>
            </Pressable>

            <Heading size="lg" className="mb-2">{course.name}</Heading>
            <Text className="mb-2">{course.description}</Text>

            <Box className="mb-3">
                <View style={{ marginBottom: 6 }}>
                    <Text className="font-semibold">Dance Category</Text>
                    <Text>{course.danceCategory?.name ?? '—'}</Text>
                </View>
                <View style={{ marginBottom: 6 }}>
                    <Text className="font-semibold">Advancement</Text>
                    <Text>{course.advancementLevel?.name ?? '—'}</Text>
                </View>
                <View style={{ marginBottom: 6 }}>
                    <Text className="font-semibold">Price</Text>
                    <Text>{course.coursePrice ?? '—'}</Text>
                </View>
                <View>
                    <Text className="font-semibold">Instructors</Text>
                    <Text>{(course.instructors || []).map(i => `${i.name} ${i.surname}`).join(', ') || '—'}</Text>
                </View>
            </Box>

            <Heading size="md" className="mb-2">Upcoming classes</Heading>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {upcoming.length === 0 && <Text>No upcoming classes</Text>}

                {upcoming.map((c) => {
                    const start = c.startDate as Date;
                    const end = c.endDate as Date;
                    const { day, startTime, endTime } = formatDateRange(start, end);
                    const color = c.classTemplate?.scheduleTileColor || '#4f46e5';
                    const bgColor = (color.startsWith('#') ? color + '20' : color);
                    return (
                        <Card
                            key={c.id}
                            size="md"
                            variant="outline"
                            style={{
                                marginBottom: 12,
                                backgroundColor: bgColor,
                                borderColor: color,
                                padding: 12,
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text className="font-semibold">{c.classTemplate?.name ?? 'Event'}</Text>
                                <Text>{day}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text>{startTime} - {endTime}</Text>
                                <Text>Room: {c.classRoomId ?? '—'}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Group: {c.groupNumber ?? '—'}</Text>
                                <Text>{(c.instructors || []).map(i => i.name).join(', ') || '—'}</Text>
                            </View>
                        </Card>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    )
}