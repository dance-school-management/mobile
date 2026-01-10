import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { TicketProp } from '@/util/types/ticket';
import { Badge } from '@/components/ui/badge';
import { TicketIcon } from 'lucide-react-native';

function Perforation({ length = 10 }: { length?: number }) {
  return (
    <View style={styles.perforation}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[styles.dot]} />
      ))}
    </View>
  );
}

export default function Ticket({
  ticket,
  onPress,
}: {
  ticket: TicketProp;
  onPress: (ticket: TicketProp) => void;
}) {
  const date = new Date(ticket.startDate).toLocaleDateString();
  const startHour = new Date(ticket.startDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endHour = new Date(ticket.endDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isAbsent = ticket.attendanceStatus === 'ABSENT';

  const contentBg = isAbsent ? '#ffffff' : '#f9fafb';
  const sideColor = isAbsent ? '#6b21a8' : '#dc2626';

  return (
    <Pressable onPress={() => onPress(ticket)}>
      <Card
        size="md"
        variant="elevated"
        className="my-1 mx-3"
        style={styles.cardWrapper}
      >
        <View style={[styles.notch, styles.notchLeft]} />
        <View style={[styles.notch, styles.notchRight]} />

        <View style={[styles.row, { opacity: !isAbsent ? 0.55 : 1 }]}>
          <View
            style={[
              styles.sideStrip,
              { backgroundColor: sideColor, opacity: !isAbsent ? 0.8 : 1 },
            ]}
          >
            <TicketIcon size={32} color="white" />
            <Text className="text-white text-xs mt-1 text-center">{date}</Text>
          </View>

          <Perforation length={12} />

          <View style={[styles.content, { backgroundColor: contentBg }]}>
            <Heading size="md" className="mb-1">
              {ticket.name}
            </Heading>

            <Badge
              className="mb-2 rounded self-start px-2 py-1"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <Text
                size="sm"
                className={
                  !isAbsent ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'
                }
              >
                {ticket.danceCategoryName} - {ticket.advancementLevelName}
              </Text>
            </Badge>

            <View style={styles.rowBetween}>
              <Text
                size="sm"
                className={
                  !isAbsent ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'
                }
              >
                {startHour} - {endHour}
              </Text>
              <Text
                size="sm"
                className={!isAbsent ? 'text-gray-400' : 'text-gray-500'}
              >
                {ticket.classRoomName}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const NOTCH_SIZE = 20;

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 14,
    overflow: 'visible',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  sideStrip: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  perforation: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  dot: {
    width: 3,
    height: 3,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
    marginVertical: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  notch: {
    position: 'absolute',
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    backgroundColor: '#f3f4f6',
    borderRadius: NOTCH_SIZE / 2,
    top: '50%',
    marginTop: -NOTCH_SIZE / 2,
    zIndex: 2,
  },
  notchLeft: {
    left: -NOTCH_SIZE / 2,
  },
  notchRight: {
    right: -NOTCH_SIZE / 2,
  },
});
