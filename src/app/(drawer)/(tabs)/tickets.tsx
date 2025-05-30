import { Heading } from '@/components/ui/heading';
import { View, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import Ticket from '@/components/ticket/ticket';
import { ScrollView } from 'react-native-gesture-handler';
import TicketDetails from '@/components/ticket/ticketDetails';
import { Alert, AlertText } from '@/components/ui/alert';

const mockTickets = [
  {
    id: '1',
    name: 'Beginner Salsa Class',
    startDate: '2024-06-10T18:00:00Z',
    endDate: '2024-06-10T19:30:00Z',
    classroom: 'Studio A',
  },
  {
    id: '2',
    name: 'Intermediate Bachata Workshop',
    startDate: '2024-06-12T20:00:00Z',
    endDate: '2024-06-12T21:30:00Z',
    classroom: 'Studio B',
  },
  {
    id: '3',
    name: 'Advanced Hip-Hop Session',
    startDate: '2024-06-14T17:00:00Z',
    endDate: '2024-06-14T18:30:00Z',
    classroom: 'Studio C',
  },
  {
    id: '4',
    name: 'Contemporary Dance Class',
    startDate: '2024-06-16T16:00:00Z',
    endDate: '2024-06-16T17:30:00Z',
    classroom: 'Studio D',
  },
  {
    id: '5',
    name: 'Zumba Fitness',
    startDate: '2024-06-18T19:00:00Z',
    endDate: '2024-06-18T20:00:00Z',
    classroom: 'Studio E',
  },
  {
    id: '6',
    name: 'Latin Fusion Night',
    startDate: '2024-06-20T21:00:00Z',
    endDate: '2024-06-20T23:00:00Z',
    classroom: 'Main Hall',
  },
  {
    id: '7',
    name: 'Kids Ballet Class',
    startDate: '2024-06-22T15:00:00Z',
    endDate: '2024-06-22T16:00:00Z',
    classroom: 'Studio F',
  },
  {
    id: '8',
    name: 'Jazz Funk Jam',
    startDate: '2024-06-24T18:30:00Z',
    endDate: '2024-06-24T20:00:00Z',
    classroom: 'Studio G',
  },
];

const mockRecommendedTickets = [
  {
    id: '9',
    name: 'Salsa Social Night',
    startDate: '2024-06-11T20:00:00Z',
    endDate: '2024-06-11T23:00:00Z',
    classroom: 'Main Hall',
  },
  {
    id: '10',
    name: 'Bachata Masterclass',
    startDate: '2024-06-13T19:00:00Z',
    endDate: '2024-06-13T21:00:00Z',
    classroom: 'Studio B',
  },
  {
    id: '11',
    name: 'Street Jazz Workshop',
    startDate: '2024-06-15T17:30:00Z',
    endDate: '2024-06-15T19:00:00Z',
    classroom: 'Studio H',
  },
  {
    id: '12',
    name: 'Afrobeat Dance Party',
    startDate: '2024-06-17T20:00:00Z',
    endDate: '2024-06-17T22:00:00Z',
    classroom: 'Main Hall',
  },
];

export default function Page() {
  const [tickets, setTickets] = useState(mockTickets);
  const [recommendedTickets, setRecommendedTickets] = useState(mockRecommendedTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [visible, setVisible] = useState(false);
  const [ownedTicket, setOwnedTicket] = useState(true);

  useEffect(() => {
    setTickets(mockTickets);
    setRecommendedTickets(mockRecommendedTickets);
  }, []);

  return (
    <SafeAreaView className="flex-1">
    <View className="flex-1 p-4">
      <Heading size="xl" className="text-primary-700 tracking-wide">Your Tickets:</Heading>
      <ScrollView className="flex-1">
        {tickets.length === 0 ? (
          <Alert action="info" variant="outline" className="mt-4">
            <AlertText>You don't have any tickets.</AlertText>
          </Alert>
        ) : (
          tickets.map(ticket => (
            <Ticket
              key={ticket.id}
              ticket={ticket}
              onPress={(ticket) => {
                setSelectedTicket(ticket);
                setOwnedTicket(true);
                setVisible(true);
              }}
            />
          ))
        )}
      </ScrollView>
      <Heading size="xl" className="text-primary-700 tracking-wide mt-4">Recommended: </Heading>
      <ScrollView className="flex-1">
        {recommendedTickets.length === 0 ? (
          <Alert action="info" variant="outline" className="mt-4">
            <AlertText>No recommedations</AlertText>
          </Alert>
        ) : (
          recommendedTickets.map((ticket: typeof mockRecommendedTickets[number]) => (
            <Ticket
              key={ticket.id}
              ticket={ticket}
              onPress={(ticket: typeof mockRecommendedTickets[number]) => {
                setSelectedTicket(ticket);
                setOwnedTicket(false);
                setVisible(true);
              }}
            />
          ))
        )}
      </ScrollView>
      <TicketDetails
        ticket={selectedTicket}
        visible={visible}
        onClose={() => {
          setVisible(false);
          setSelectedTicket(null);
        }}
        owned={ownedTicket}
      />
    </View>
    </SafeAreaView>
  );
}