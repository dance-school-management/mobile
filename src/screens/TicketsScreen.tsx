import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  AlertText,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  Skeleton,
  Box,
} from '@/components/ui';
import { API_PATHS } from '@/util/endpoints';
import Ticket from '@/components/ticket/Ticket';
import TicketDetails from '@/components/ticket/TicketDetails';
import { TicketProp } from '@/util/types/ticket';
import { FlatList, View } from 'react-native';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import { Button, ButtonText } from '@/components/ui/button';
import { Checkbox, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const normalize = (v: unknown) => String(v ?? '').toLowerCase().trim();

const matchesTicket = (ticket: TicketProp, query: string) => {
  const q = normalize(query);
  if (!q) return true;

  const haystack = [
    ticket.name,
    ticket.description,
    ticket.danceCategoryName,
    ticket.advancementLevelName,
    ticket.classRoomName,
  ]
    .map(normalize)
    .filter(Boolean)
    .join(' ');

  return haystack.includes(q);
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const formatDate = (d: Date | null) => {
  if (!d) return '—';
  return d.toLocaleDateString();
};

export default function TicketsScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketProp[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUsed, setShowUsed] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');
  const [appliedShowUsed, setAppliedShowUsed] = useState<boolean>(false);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(null);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(null);
  const [displayedTickets, setDisplayedTickets] = useState<TicketProp[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketProp | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const showToast = useAppToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get(API_PATHS.getTickets);
      const data = response.data;
      const all = data.tickets as TicketProp[];
      setTickets(all);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTickets();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  }, []);

  const openFromPicker = useCallback(() => {
    DateTimePickerAndroid.open({
      value: fromDate ?? new Date(),
      mode: 'date',
      is24Hour: true,
      onChange: (_event, selected) => {
        if (!selected) return;
        const nextFrom = startOfDay(selected);
        if (toDate && nextFrom.getTime() > endOfDay(toDate).getTime()) {
          setToDate(nextFrom);
        }
        setFromDate(nextFrom);
      },
    });
  }, [fromDate, toDate]);

  const openToPicker = useCallback(() => {
    DateTimePickerAndroid.open({
      value: toDate ?? fromDate ?? new Date(),
      mode: 'date',
      is24Hour: true,
      onChange: (_event, selected) => {
        if (!selected) return;
        const nextTo = startOfDay(selected);
        if (fromDate && endOfDay(nextTo).getTime() < startOfDay(fromDate).getTime()) {
          setFromDate(nextTo);
        }
        setToDate(nextTo);
      },
    });
  }, [fromDate, toDate]);

  const filteredTickets = useMemo(() => {
    const toTime = (d?: string | number | Date | null) => {
      if (!d) return Number.POSITIVE_INFINITY;
      const t = new Date(d as any).getTime();
      return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
    };
    const fromMs = appliedFromDate ? startOfDay(appliedFromDate).getTime() : null;
    const toMs = appliedToDate ? endOfDay(appliedToDate).getTime() : null;

    return tickets
      .filter((t) => {
        const isUsed = t.attendanceStatus !== 'ABSENT';
        if (!appliedShowUsed && isUsed) return false;
        if (!matchesTicket(t, appliedSearchQuery)) return false;
        const startMs = toTime((t as any).startDate);
        if (fromMs != null && startMs < fromMs) return false;
        if (toMs != null && startMs > toMs) return false;
        return true;
      })
      .slice()
      .sort((a, b) => {
        const ta = toTime((a as any).startDate);
        const tb = toTime((b as any).startDate);
        return tb - ta;
      });
  }, [tickets, appliedSearchQuery, appliedShowUsed, appliedFromDate, appliedToDate]);

  const resetPagination = useCallback(
    (source: TicketProp[]) => {
      const first = source.slice(0, limit);
      setDisplayedTickets(first);
      setPage(1);
      setHasMore(source.length > first.length);
    },
    [limit],
  );

  useEffect(() => {
    resetPagination(filteredTickets);
  }, [filteredTickets, resetPagination]);

  const handleApplyFilters = useCallback(() => {
    setAppliedSearchQuery(searchQuery);
    setAppliedShowUsed(showUsed);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  }, [searchQuery, showUsed, fromDate, toDate]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setShowUsed(false);
    setFromDate(null);
    setToDate(null);
    setAppliedSearchQuery('');
    setAppliedShowUsed(false);
    setAppliedFromDate(null);
    setAppliedToDate(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const start = (nextPage - 1) * limit;
      const end = start + limit;
      const nextSlice = filteredTickets.slice(start, end);
      if (nextSlice.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedTickets((prev) => [...prev, ...nextSlice]);
        setPage(nextPage);
        setHasMore(filteredTickets.length > end);
      }
      setLoadingMore(false);
    }, 600);
  }, [filteredTickets, hasMore, limit, loading, loadingMore, page]);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Box className="p-2 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Input className="h-12 items-center bg-white rounded-md border border-gray-300">
          <InputSlot className="pl-2">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            className="flex-1 py-0 h-full leading-none text-base"
            style={{ textAlignVertical: 'center', paddingVertical: 0 }}
          />
        </Input>

        <Box className="mt-2">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button variant="outline" action="secondary" onPress={openFromPicker} className="flex-1 rounded-md">
              <ButtonText>From: {formatDate(fromDate)}</ButtonText>
            </Button>
            <Button variant="outline" action="secondary" onPress={openToPicker} className="flex-1 rounded-md">
              <ButtonText>To: {formatDate(toDate)}</ButtonText>
            </Button>
          </View>
        </Box>

        <Box className="mt-2 px-1">
          <Checkbox
            value="showUsed"
            isChecked={showUsed}
            onChange={(checked: boolean) => setShowUsed(checked)}
          >
            <CheckboxIndicator />
            <CheckboxLabel>Show used tickets</CheckboxLabel>
          </Checkbox>
        </Box>

        <Box className="flex-row gap-2 justify-between mt-2">
          <Button disabled={loading} onPress={handleApplyFilters} className="flex-1 rounded-md">
            <ButtonText>Apply Filters</ButtonText>
          </Button>
          <Button action="secondary" disabled={loading} onPress={handleClearFilters} className="flex-1 rounded-md">
            <ButtonText>Clear Filters</ButtonText>
          </Button>
        </Box>
      </Box>
      <FlatList
        className="flex-1 px-2"
        data={displayedTickets}
        keyExtractor={(item) => item.qrCodeUUID}
        renderItem={({ item }) => (
          <Ticket
            ticket={item}
            onPress={(ticket: TicketProp) => {
              setSelectedTicket(ticket);
              setVisible(true);
            }}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 10 }}
        ListEmptyComponent={() => {
          if (loading) return null;
          return (
            <Alert action="info" variant="outline" className="mt-4">
              <AlertText>No tickets found</AlertText>
            </Alert>
          );
        }}
        ListFooterComponent={() => {
          if (!loadingMore) return null;
          return (
            <Box className="pb-4">
              <Skeleton variant="rounded" className="h-[100px] w-full" />
              <Skeleton variant="rounded" className="h-[100px] w-full mt-2" />
            </Box>
          );
        }}
      />
      <TicketDetails
        ticket={selectedTicket}
        visible={visible}
        onClose={() => {
          setVisible(false);
          setSelectedTicket(null);
        }}
      />
    </SafeAreaView>
  );
}