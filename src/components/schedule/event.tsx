import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

export default function Event({ event, onPress, style }) {
    const startHour = new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endHour = new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Pressable onPress={() => onPress(event)}>
            <Card size="md" variant="outline" style={{
                backgroundColor: event.bgColor + '20',
                borderColor: event.bgColor,
                ...(style || {})
            }}>
                <Heading size="md" className="mb-1" numberOfLines={1} ellipsizeMode="tail">{event.name}</Heading>
                <Text size="sm">Room: {event.classroom}</Text>
                <Text size="sm">{startHour} - {endHour}</Text>
            </Card>
        </Pressable>
    )
}