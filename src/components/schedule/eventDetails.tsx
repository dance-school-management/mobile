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
import React from 'react';
import { Icon, CloseIcon } from '@/components/ui/icon';


export default function EventDetails({ event, visible, onClose }) {
    return (
        <Modal isOpen={visible} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading className="text-typography-950 font-semibold" size="md">
                        {event?.name}
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} className="stroke-background-500" />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody className="mt-3 mb-4">
                    <Text className="font-bold mb-1">Date & Time</Text>
                    <Text className="mb-4">
                        {new Date(event?.start.dateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })} -{' '}
                        {new Date(event?.end.dateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>

                    <Text className="font-bold mb-1">Location</Text>
                    <Text className="mb-4">{event?.classroom}</Text>

                    <Text className="font-bold mb-1">Dance Category</Text>
                    <Text className="mb-4">{event?.danceCategory.name}</Text>

                    <Text className="font-bold mb-1">Advancement Level</Text>
                    <Text className="mb-4">{event?.advancementLevel.name}</Text>

                    <Text className="font-bold mb-1">Description</Text>
                    <Text className="mb-4">{event?.description}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" action="positive" onPress={onClose} size="md">
                        <ButtonText>Buy: {event?.price} {event?.currency}</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}