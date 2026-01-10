import React, { useCallback, useEffect, useState } from 'react';
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
import { FlatList } from 'react-native';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

export default function TicketsScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketProp[]>([]);
  const [displayedTickets, setDisplayedTickets] = useState<TicketProp[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketProp | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const showToast = useAppToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get(API_PATHS.getTickets);
      const data = response.data;
      const all = data.tickets as TicketProp[];
      setTickets(all);

      const first = all.slice(0, limit);
      setDisplayedTickets(first);
      setPage(1);
      setHasMore(all.length > first.length);
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error fetching tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  }, []);

  const handleLoadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const start = (nextPage - 1) * limit;
      const end = start + limit;
      const nextSlice = tickets.slice(start, end);

      if (nextSlice.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedTickets((prev) => [...prev, ...nextSlice]);
        setPage(nextPage);
        setHasMore(tickets.length > end);
      }

      setLoadingMore(false);
    }, 600);
  };

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <FlatList
        className="flex-1 p-2"
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
        ListHeaderComponent={
          <Box className="p-1 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-2">
            <Input className="m-1" size="xl" variant="rounded">
              <InputSlot className="pl-2">
                <InputIcon as={SearchIcon} />
              </InputSlot>
              <InputField
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </Box>
        }
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
