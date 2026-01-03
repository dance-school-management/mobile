import { Card } from '@/components/ui/card';
import { Pressable } from '@/components/ui/pressable';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { NotificationProp } from '@/util/types/notification';

export default function Notification({ notification, onPress }: { notification: NotificationProp, onPress: (notification: NotificationProp) => void }) {
    return (
        <Pressable onPress={() => onPress(notification)}>
            <Card
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md my-1 mx-2"
                size="lg"
                variant={notification.hasBeenRead ? "outline" : "elevated"}
                style={notification.hasBeenRead ? { opacity: 0.5 } : undefined}
            >
                <Heading size="lg" className="mb-1">{notification.title}</Heading>
                <Text size="sm" className="mb-2">
                {new Date(notification.sendDate).toLocaleDateString([])}{' '}
                {new Date(notification.sendDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                </Text>
            </Card>
        </Pressable>
    )
}
