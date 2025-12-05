import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
    CalendarBody,
    CalendarContainer,
    CalendarHeader,
} from '@howljs/calendar-kit';
import { useCallback } from 'react';
import EventDetails from '@/components/schedule/eventDetails';
import DatePickerPopUp from '@/components/schedule/datePickerPopUp';
import ScheduleHeader from '@/components/schedule/scheduleHeader';
import Filter from '@/components/schedule/filter';
import Event from '@/components/schedule/event';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { formatEvent, getDayStart, getDayEnd } from '@/util/schedule';
import SearchedEvents from '@/components/schedule/searchedEvents';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EventProp {
    id: number;
    instructors: {
        id: number;
        name: string;
        surname: string;
    }
    owned: boolean;
    paymentStatus: string | null;
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
        danceCategory: {
            id: number;
            name: string;
            description: string;
            photoPath: string;
        }
        advancementLevel: {
            id: number;
            name: string;
            description: string;
        }
        course: {
            id: number;
            name: string;
            description: string;
            danceCategoryId: number;
            advancementLevelId: number;
            courseStatus: string;
            customPrice: string;
        }
    }
}

interface CalendarEvent {
    id: number | string;
    start: Date;
    end: Date;
    title: string;
    color?: string;
    bgColor?: string;
    name: string;
    classroom: string;
    danceCategory?: { id: number; name: string; description?: string; photoPath?: string };
    advancementLevel?: { id: number; name: string; description?: string };
    description?: string;
    price?: string;
    currency?: string;
};

export default function CourseSchedule() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [minDate, setMinDate] = useState<Date>(getDayStart(new Date()));
    const [maxDate, setMaxDate] = useState<Date>(getDayEnd(new Date()));
    const [activeModal, setActiveModal] = useState<
        null | 'filter' | 'event' | 'calendar'
    >(null);
    const [pressedEvent, setPressedEvent] = useState<CalendarEvent>();
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const renderEvent = useCallback((event) => {
        return (
            <Event
                event={event}
                style={{ height: '100%' }}
                onPress={(event : CalendarEvent) => {
                    setPressedEvent(event);
                    setActiveModal('event');
                }}
            />
        );
    }, []);

    const fetchCourseEvents = async () => {
        try {
            const response = await api.get(`/product/schedule/courses/classes?coursesIds=1&coursesIds=2`);
            const data = response.data;
            console.log(data);
            const formattedEvents = data.map((course: any) => {
                return formatEvent(course.classes);
            });
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchCourseEvents();
    }, [minDate, maxDate]);

    if (!events) {
        return <View />;
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
            <CalendarContainer
                className="grow"
                events={events}
                numberOfDays={1}
                scrollByDay={true}
                minDate={minDate}
                maxDate={maxDate}
                initialDate={currentDate}
                start={360}
            >
                <CalendarHeader />
                <CalendarBody renderEvent={renderEvent} />
            </CalendarContainer>
            <EventDetails
                event={pressedEvent}
                visible={activeModal === 'event'}
                onClose={() => setActiveModal(null)}
            />
        </SafeAreaView>
    );
}
