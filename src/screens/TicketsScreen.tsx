import React, { useCallback, useEffect, useState } from 'react';
import api from '@/server/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  AlertText,
  Button,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
  Text,
  Skeleton,
} from '@/components/ui';
import { API_PATHS } from '@/util/endpoints';
import Ticket from '@/components/ticket/ticket';
import TicketDetails from '@/components/ticket/ticketDetails';
import { TicketProp } from '@/util/types/ticket';
import { RefreshControl, ScrollView } from 'react-native';

export default function TicketsScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketProp[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketProp[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketProp | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_PATHS.getTickets);
      const data = response.data;
      setTickets(data.tickets);
      setFilteredTickets(data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <ScrollView style={{ padding: 8 }}>
          <Skeleton className="h-12 w-full mt-4 mb-4" />
          <Skeleton className="h-30 w-full mt-4 mb-4" />
          <Skeleton className="h-30 w-full mt-4 mb-4" />
          <Skeleton className="h-30 w-full mt-4 mb-4" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView
        style={{ padding: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Input className="m-1" size="xl" variant="rounded">
          <InputSlot className="pl-2">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => {
              setFilteredTickets(
                tickets.filter((ticket) =>
                  ticket.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
              );
            }}
          />
        </Input>
        {filteredTickets.length === 0 ? (
          <Alert action="info" variant="outline" className="mt-4">
            <AlertText>No tickets found</AlertText>
          </Alert>
        ) : (
          filteredTickets
            .sort(
              (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            )
            .slice(0, 10)
            .map((ticket) => (
              <Ticket
                key={ticket.classId}
                ticket={ticket}
                onPress={(ticket: TicketProp) => {
                  setSelectedTicket(ticket);
                  setVisible(true);
                }}
              />
            ))
        )}
        <TicketDetails
          ticket={selectedTicket}
          visible={visible}
          onClose={() => {
            setVisible(false);
            setSelectedTicket(null);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}