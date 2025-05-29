import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter
} from '@/components/ui/modal';
import { Icon, ArrowLeftIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import QRCode from 'react-qr-code';
import { Box } from '@/components/ui/box';

export default function TicketDetails({ ticket, visible, onClose, owned }) {
    return (
        <Modal isOpen={visible} onClose={onClose} size="full">
            <ModalBackdrop />
            <ModalContent className="flex-1 h-full flex-start">
                <ModalCloseButton>
                        <Icon size='xl' as={ArrowLeftIcon} className="stroke-background-500" />
                </ModalCloseButton>
                <ModalHeader className="justify-center items-center">
                    {owned && ticket && (
                    <Box className="flex justify-center mt-4 mb-4">
                        <QRCode value={ticket?.id} size={256} />
                    </Box>
                    )}
                </ModalHeader>
                <ModalBody className="mt-3 mb-4">
                    <Heading className="text-typography-950 font-semibold mb-4 mt-4" size="2xl">
                        {ticket?.name}
                    </Heading>

                    <Text className="font-bold mb-1">Date: </Text>
                    <Text>{new Date(ticket?.startDate).toLocaleDateString()}</Text>
                    <Text className="font-bold mb-1 mt-2">Time: </Text>
                    <Text className="mb-4">
                        {new Date(ticket?.startDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })} -{' '}
                        {new Date(ticket?.endDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                    <Text className="font-bold mb-1">Location</Text>
                    <Text className="mb-4">{ticket?.classroom}</Text>
                </ModalBody>
                    {owned ? (
                        <ModalFooter className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                action="secondary"
                                size="md"
                                className="w-full"
                            >
                                <ButtonText>Exchange your ticket</ButtonText>
                            </Button>
                            <Button
                                variant="solid"
                                action="secondary"
                                size="md"
                                className="w-full mt-2"
                            >
                                <ButtonText>Faktura VAT</ButtonText>
                            </Button>
                        </ModalFooter>
                    ) : (
                        <ModalFooter className="flex flex-col gap-2">
                            <Button
                                variant="solid"
                                action="positive"
                                size="xl"
                                className="w-full"
                            >
                                <ButtonText>Buy</ButtonText>
                            </Button>
                        </ModalFooter>
                    )}
            </ModalContent>
        </Modal>
    )
}