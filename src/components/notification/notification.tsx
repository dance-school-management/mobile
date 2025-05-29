import { Card } from '@/components/ui/card';
import { Pressable } from '@/components/ui/pressable';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';


export default function Notification({ notification, onPress }) {
    return (
        <Pressable onPress={() => onPress(notification)}>
            <Card
                size="lg"
                variant={notification.hasBeenRead ? "outline" : "elevated"}
                className="m-2 border-2 border-solid border-slate-800"
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
