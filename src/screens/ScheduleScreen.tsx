import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatEvent, getDayEnd, getDayStart } from '@/util/schedule';
import Event from '@/components/schedule/event';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleHeader from '@/components/schedule/scheduleHeader';
import { CalendarBody, CalendarContainer, CalendarHeader } from '@howljs/calendar-kit';
import DatePickerPopUp from '@/components/schedule/datePickerPopUp';
import EventDetails from '@/components/schedule/EventDetails';
import type { CalendarEvent } from '@/util/types/schedule';
import { API_PATHS } from '@/util/endpoints';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import { View, Text, Pressable } from 'react-native';
import type { EventItem, PackedEvent, SizeAnimation } from '@howljs/calendar-kit';
import { useSessionQuery } from '@/lib/auth/session';
import { useFocusEffect } from 'expo-router';

type Scope = 'owned' | 'all';

type CalendarEventWithOwner = CalendarEvent & {
  ownerId?: string | number | null;
  owned?: boolean | null;
};

const toStringId = (id: string | number) => String(id);

export default function ScheduleScreen() {
  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [minDate, setMinDate] = useState<Date>(getDayStart(new Date()));
  const [maxDate, setMaxDate] = useState<Date>(getDayEnd(new Date()));
  const [activeModal, setActiveModal] = useState<null | 'filter' | 'event' | 'calendar'>(null);

  const [scope, setScope] = useState<Scope>(role === 'COORDINATOR' ? 'all' : 'owned');

  const [allEvents, setAllEvents] = useState<CalendarEventWithOwner[]>([]);

  const [eventById, setEventById] = useState<Record<string, CalendarEventWithOwner>>({});
  const [pressedEvent, setPressedEvent] = useState<CalendarEventWithOwner | null>(null);

  const isEventModalOpen = activeModal === 'event' && !!pressedEvent;

  const showToast = useAppToast();

  const isOwnedEvent = useCallback((ev: CalendarEventWithOwner) => {
    if (typeof ev.owned === 'boolean') return ev.owned;
    if (ev.ownerId !== undefined && ev.ownerId !== null) return true;
    const anyEv = ev as any;
    if (typeof anyEv?.scheduleItem?.owned === 'boolean') return anyEv.scheduleItem.owned;
    if (anyEv?.scheduleItem?.ownerId !== undefined && anyEv?.scheduleItem?.ownerId !== null) return true;
    return false;
  }, []);

  const visibleEvents = useMemo(() => {
    if (scope === 'all') return allEvents;
    return allEvents.filter(isOwnedEvent);
  }, [allEvents, isOwnedEvent, scope]);

  const calendarItems: EventItem[] = useMemo(() => {
    return visibleEvents.map((ev) => ({ ...(ev as unknown as EventItem), id: toStringId((ev as any).id) }));
  }, [visibleEvents]);

  const renderEvent = useCallback(
    (packed: PackedEvent, _size: SizeAnimation) => {
      const id = toStringId(packed.id as any);
      const full = eventById[id];

      if (!full) return null;

      return (
        <Event
          event={full}
          style={{ height: '100%' }}
          onPress={() => {
            setPressedEvent(full);
            setActiveModal('event');
          }}
        />
      );
    },
    [eventById],
  );

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams({
        dateFrom: minDate.toISOString(),
        dateTo: maxDate.toISOString(),
      });

      const response = await api.get(`${API_PATHS.getSchedule}?${params.toString()}`);

      const data = response.data as unknown[];
      console.log(data)
      const formatted = data.map((raw) => formatEvent(raw as any) as CalendarEventWithOwner);

      const nextMap: Record<string, CalendarEventWithOwner> = {};
      for (const ev of formatted) {
        nextMap[toStringId((ev as any).id)] = ev;
      }

      setAllEvents(formatted);
      setEventById(nextMap);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching events');
    }
  };

  useEffect(() => {
    void fetchEvents();
  }, [minDate, maxDate]);

  useFocusEffect(
    useCallback(() => {
      void fetchEvents();
    }, [minDate, maxDate]),
  )

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      <ScheduleHeader
        setCurrentDate={setCurrentDate}
        setMinDate={setMinDate}
        setMaxDate={setMaxDate}
        setActiveModal={setActiveModal}
      />
      {role !== 'COORDINATOR' && (
        <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6, flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => setScope('owned')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: scope === 'owned' ? '#111827' : '#D1D5DB',
              backgroundColor: scope === 'owned' ? '#111827' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: scope === 'owned' ? '#FFFFFF' : '#111827', fontWeight: '600' }}>Personal</Text>
          </Pressable>

          <Pressable
            onPress={() => setScope('all')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: scope === 'all' ? '#111827' : '#D1D5DB',
              backgroundColor: scope === 'all' ? '#111827' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: scope === 'all' ? '#FFFFFF' : '#111827', fontWeight: '600' }}>School</Text>
          </Pressable>
        </View>
      )}

      <CalendarContainer
        className="grow"
        events={calendarItems}
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

      <DatePickerPopUp
        visible={activeModal === 'calendar'}
        onClose={() => setActiveModal(null)}
        setCurrentDate={setCurrentDate}
        setMinDate={setMinDate}
        setMaxDate={setMaxDate}
      />

      {isEventModalOpen ? (
        <EventDetails
          event={pressedEvent as any}
          visible={true}
          onClose={() => {
            setActiveModal(null);
            setPressedEvent(null);
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}
