import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';
import { CalendarEvent } from '@/util/types/schedule';
import { getRandomBgColorWithBorder } from '@/util/colors';

export default function Event({ event, onPress, style } : { event: CalendarEvent, onPress: (event: any) => void, style?: object }) {
  const startHour = new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endHour = new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Pressable style={style} onPress={() => onPress(event)}>
      <Box className={`p-2 h-full ${getRandomBgColorWithBorder()}`}>
        <Heading size="md" className="mb-1" numberOfLines={1} ellipsizeMode="tail">
          {event.title}
        </Heading>
        <Text size="sm">Room: {event.classroom.name}</Text>
        <Text size="sm">
          {startHour} - {endHour}
        </Text>
      </Box>
    </Pressable>
  );
}