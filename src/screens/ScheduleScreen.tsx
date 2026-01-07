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
import EventDetails from '@/components/schedule/EventDetails';
import SearchedEvents from '@/components/schedule/searchedEvents';
import { CalendarEvent, ScheduleItemPersonal, ScheduleItem } from '@/util/types/schedule';
import { API_PATHS } from '@/util/endpoints';


export default function ScheduleScreen() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [minDate, setMinDate] = useState<Date>(getDayStart(new Date()));
  const [maxDate, setMaxDate] = useState<Date>(getDayEnd(new Date()));
  const [activeModal, setActiveModal] = useState<
    null | 'filter' | 'event' | 'calendar'
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [pressedEvent, setPressedEvent] = useState<CalendarEvent | null>(null);
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

  const fetchEvents = async () => {
    try {
      const response = await api.get(`${API_PATHS.getSchedule}?dateFrom=${minDate.toISOString()}&dateTo=${maxDate.toISOString()}`);
      const data = response.data;
      const formattedEvents = data.map((event: any) => {
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
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
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
      {/*<Filter*/}
      {/*  visible={activeModal === 'filter'}*/}
      {/*  onClose={() => setActiveModal(null)}*/}
      {/*/>*/}
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
      {/*<SearchedEvents*/}
      {/*  events={events}*/}
      {/*  search={searchQuery}*/}
      {/*  visible={searchVisible}*/}
      {/*  onClose={() => setSearchVisible(false)}*/}
      {/*  setPressedEvent={setPressedEvent}*/}
      {/*  setActiveModal={setActiveModal}*/}
      {/*/>*/}
    </SafeAreaView>
  );
}
