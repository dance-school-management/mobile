import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CalendarBody, CalendarContainer, CalendarHeader } from '@howljs/calendar-kit';
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

export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [minDate, setMinDate] = useState(getDayStart(new Date()));
  const [maxDate, setMaxDate] = useState(getDayEnd(new Date()));
  const [activeModal, setActiveModal] = useState<null | 'filter' | 'event' | 'calendar'>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [pressedEvent, setPressedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const renderEvent = useCallback(
    (event) => {
      return (
        <Event event={event} style={{ height: '100%' }} onPress={(event) => {
          setPressedEvent(event);
          setActiveModal('event');
        }} />
      );
    },
    []
  );

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:8000/product/schedule?dateFrom=${minDate.toISOString()}&dateTo=${maxDate.toISOString()}`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      const formattedEvents = data.map(event => console.log(event.id) || formatEvent(event));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [minDate, maxDate]);

  return (
    <View className='flex-1 bg-white'>
      <ScheduleHeader
        setCurrentDate={setCurrentDate}
        setMinDate={setMinDate}
        setMaxDate={setMaxDate}
        setActiveModal={setActiveModal}
      />
      <CalendarContainer className='grow'
      events={events}
      numberOfDays={1} 
      scrollByDay={true}
      minDate={minDate}
      maxDate={maxDate}
      initialDate={currentDate}
      start={360}
      >
        <CalendarHeader />
        <CalendarBody
        renderEvent={renderEvent}
        />
      </CalendarContainer>
      <Button variant='solid' action='secondary' className='m-2' size='md' onPress={() => console.log(events)}>
        <ButtonText>Upcoming Routine Events</ButtonText>
      </Button>
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
    </View>
  );
}