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


export default function Filter({ visible, onClose }) {        
    return (
        <Modal isOpen={visible} onClose={onClose} size="full">
            <ModalBackdrop />
            <ModalContent className="flex-1">
                <ModalHeader>
                    <Heading className="text-typography-950 font-semibold" size="md">
                        Filter Events
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} className="stroke-background-500" />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody className="mt-3 mb-4">
                    {/* Add filter options here */}
                    <Text>Filter options will go here.</Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" action="positive" onPress={onClose} size="md">
                        <ButtonText>Apply Filters</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}