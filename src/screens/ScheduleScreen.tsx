import React, { useCallback, useEffect, useState } from 'react';
import { formatEvent, getDayEnd, getDayStart } from '@/util/schedule';
import Event from '@/components/schedule/event';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleHeader from '@/components/schedule/scheduleHeader';
import { CalendarBody, CalendarContainer, CalendarHeader } from '@howljs/calendar-kit';
import { Input, InputField, InputIcon, InputSlot, SearchIcon } from '@/components/ui';
import Filter from '@/components/schedule/filter';
import DatePickerPopUp from '@/components/schedule/datePickerPopUp';
import EventDetails from '@/components/schedule/eventDetails';
import SearchedEvents from '@/components/schedule/searchedEvents';

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

export default function ScheduleScreen() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [minDate, setMinDate] = useState<Date>(getDayStart(new Date()));
  const [maxDate, setMaxDate] = useState<Date>(getDayEnd(new Date()));
  const [activeModal, setActiveModal] = useState<
    null | 'filter' | 'event' | 'calendar'
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [pressedEvent, setPressedEvent] = useState<CalendarEvent>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [personalEvents, setPersonalEvents] = useState<CalendarEvent[]>([]);

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

  const fetchPersonalEvents = async () => {
    try {
      const response = await api.get(`/product/schedule/personal?dateFrom=${minDate.toISOString()}&dateTo=${maxDate.toISOString()}`);
      const data = response.data;
      console.log(data);
      setPersonalEvents(data);
    } catch (error) {
      console.error('Error fetching personal events:', error);
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await api.get(`/product/schedule?dateFrom=${minDate.toISOString()}&dateTo=${maxDate.toISOString()}`);
      const data = response.data;
      const formattedEvents = data.map((event: any) => {
        console.log(event.id);
        return formatEvent(event);
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [minDate, maxDate]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <ScheduleHeader
        setCurrentDate={setCurrentDate}
        setMinDate={setMinDate}
        setMaxDate={setMaxDate}
        setActiveModal={setActiveModal}
      />
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
      {/*<Button*/}
      {/*  variant="solid"*/}
      {/*  action="secondary"*/}
      {/*  className="m-2"*/}
      {/*  size="md"*/}
      {/*  onPress={() => console.log(events)}*/}
      {/*>*/}
      {/*  <ButtonText>Upcoming Routine Events</ButtonText>*/}
      {/*</Button>*/}
      <Input className="m-1" size="xl" variant="rounded">
        <InputSlot className="pl-2">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => setSearchVisible(true)}
        />
      </Input>

      <Filter
        visible={activeModal === 'filter'}
        onClose={() => setActiveModal(null)}
      />
      <DatePickerPopUp
        visible={activeModal === 'calendar'}
        onClose={() => setActiveModal(null)}
        setCurrentDate={setCurrentDate}
        setMinDate={setMinDate}
        setMaxDate={setMaxDate}
      />
      <EventDetails
        event={pressedEvent}
        visible={activeModal === 'event'}
        onClose={() => setActiveModal(null)}
      />
      <SearchedEvents
        events={events}
        search={searchQuery}
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        setPressedEvent={setPressedEvent}
        setActiveModal={setActiveModal}
      />
    </SafeAreaView>
  );
}
