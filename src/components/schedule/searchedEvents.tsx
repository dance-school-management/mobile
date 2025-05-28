import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, ArrowLeftIcon } from '@/components/ui/icon';
import { Alert, AlertText } from '@/components/ui/alert';
import Event from '@/components/schedule/event';
import { ScrollView } from 'react-native';


export default function SearchedEvents({ events, search, visible, onClose, setPressedEvent, setActiveModal }) {
    const filteredEvents = events.filter(event => event.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <Modal isOpen={visible} onClose={onClose} size="full">
            <ModalBackdrop />
            <ModalContent className="flex-1">
                <ModalHeader>
                    <Heading className="text-typography-950 font-semibold" size="md">
                        Search Results for "{search}"
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={ArrowLeftIcon} className="stroke-background-500" />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody className="mt-3 mb-4">
                    <ScrollView className='h-full'>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <Event
                                key={event.id}
                                event={event}
                                onPress={() => {
                                    setPressedEvent(event);
                                    setActiveModal('event');
                                }}
                                style={{ marginBottom: 5 }}
                            />
                        ))
                    ) : (
                        <Alert action="info" variant="solid" className="mt-4">
                            <AlertText>No events found for "{search}"</AlertText>
                        </Alert>
                    )}
                    </ScrollView>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" action="negative" onPress={onClose} size="md">
                        <ButtonText>Close</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}