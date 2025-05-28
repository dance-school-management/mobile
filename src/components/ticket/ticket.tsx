import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';


export default function Ticket({ ticket, onPress }) {
    const date = new Date(ticket.startDate).toLocaleDateString();
    const startHour = new Date(ticket.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endHour = new Date(ticket.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Pressable onPress={() => onPress(ticket)}>
            <Card size="lg" variant="elevated" className='m-2 border-2 border-solid border-slate-800'>
                <Heading size="md" className="mb-1">{ticket.name}</Heading>
                <Text size="sm" className="mb-2">{date}, {startHour} - {endHour}, {ticket.classroom}</Text>
            </Card>
        </Pressable>
    )
}