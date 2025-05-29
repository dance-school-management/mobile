import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalBackdrop,
    ModalCloseButton
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import React from 'react';
import { Calendar } from 'react-native-calendars';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { getMondaySunday, getDayStart, getDayEnd } from '@/util/schedule';

export default function DatePickerPopUp({ visible, onClose, setCurrentDate, setMinDate, setMaxDate }) {
    return (
        <Modal isOpen={visible} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading className="text-typography-950 font-semibold" size="md">
                        Select Week
                    </Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} className="stroke-background-500" />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody className="mt-3 mb-4" contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar
                    style={{
                        width: 300,
                    }}
                    onDayPress={(day) => {
                        const selected = new Date(day.dateString);
                        const { monday, sunday } = getMondaySunday(selected);
                        setCurrentDate(selected);
                        setMinDate(getDayStart(monday));
                        setMaxDate(getDayEnd(sunday));
                        onClose();
                    }}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}