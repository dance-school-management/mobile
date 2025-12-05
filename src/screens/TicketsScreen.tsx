import React, { useEffect, useState } from 'react';
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
  Spinner,
  Text,
} from '@/components/ui';
import { ScrollView } from 'react-native-gesture-handler';
import { API_PATHS } from '@/util/endpoints';
import Ticket from '@/components/ticket/ticket';
import TicketDetails from '@/components/ticket/ticketDetails';

interface TicketProp {
  classId: number;
  qrCodeUUID: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  classRoomName: string;
  danceCategoryName: string;
  advancementLevelName: string;
  price: number;
  paymentStatus: string;
  attendaceStatus: string;
  attendaceLastUpdated: Date;
}

export default function TicketsScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<TicketProp[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketProp[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketProp | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTickets = async () => {
    try {
      const response = await api.get(API_PATHS.getTickets);
      const data = response.data;
      console.log(data.tickets);
      setTickets(data.tickets);
      setFilteredTickets(data.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  }

  useEffect(() => {
    fetchTickets();
    setTimeout(() => setLoading(false), 200);
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView className="flex-1 pt-2">
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