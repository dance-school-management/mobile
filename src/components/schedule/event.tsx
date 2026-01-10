import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';
import { CalendarEvent } from '@/util/types/schedule';
import { getRandomBgColorWithBorder } from '@/util/colors';

export default function Event({
  event,
  onPress,
  style,
}: {
  event: CalendarEvent;
  onPress: (event: any) => void;
  style?: object;
}) {
  const startHour = new Date(event.start.dateTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endHour = new Date(event.end.dateTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const classStatus = event.scheduleItem.classStatus;
  const isCancelled = classStatus === 'CANCELLED';

  const containerClassName = isCancelled
    ? 'p-2 h-full bg-gray-200 border border-gray-400 opacity-60'
    : `p-2 h-full ${getRandomBgColorWithBorder()}`;

  return (
    <Pressable
      style={style}
      onPress={() => onPress(event)}
    >
      <Box className={containerClassName}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Heading
            size="md"
            className="mb-1 flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={
              isCancelled
                ? ({ textDecorationLine: 'line-through' } as any)
                : undefined
            }
          >
            {event.title}
          </Heading>

          {isCancelled ? (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 999,
                backgroundColor: '#6B7280',
              }}
            >
              <Text
                size="sm"
                style={{ color: '#FFFFFF', fontWeight: '700' } as any}
              >
                Cancelled
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          size="sm"
          style={
            isCancelled
              ? ({ textDecorationLine: 'line-through' } as any)
              : undefined
          }
        >
          Room: {event.classroom.name}
        </Text>

        <Text
          size="sm"
          style={
            isCancelled
              ? ({ textDecorationLine: 'line-through' } as any)
              : undefined
          }
        >
          {startHour} - {endHour}
        </Text>
      </Box>
    </Pressable>
  );
}
