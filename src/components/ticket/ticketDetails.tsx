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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TicketProp {
  classId: number;
  qrCodeUUID: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  classRoomName: string;
  danceCategoryName: string;
  advancementLevelName: string;
  price: number;
  paymentStatus: string;
  attendaceStatus: string;
  attendaceLastUpdated: Date;
}

export default function TicketDetails({ ticket, visible, onClose } : { ticket: TicketProp | null; visible: boolean; onClose: () => void}) {
  const insets = useSafeAreaInsets();

  if (!ticket) return null;

  const date = new Date(ticket.startDate).toLocaleDateString();
  const startHour = new Date(ticket.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endHour = new Date(ticket.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
        <Modal isOpen={visible} onClose={onClose} size="full">
            <ModalBackdrop />
            <ModalContent className="flex-1 h-full flex-start" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
                <ModalCloseButton>
                        <Icon size='xl' as={ArrowLeftIcon} className="stroke-background-500" />
                </ModalCloseButton>
                <ModalHeader className="justify-center items-center">
                    {ticket && (
                    <Box className="flex justify-center mt-4 mb-4">
                        <QRCode value={ticket.qrCodeUUID} size={256} />
                    </Box>
                    )}
                </ModalHeader>
                <ModalBody className="mt-3 mb-4">
                    <Heading className="text-typography-950 font-semibold mb-4 mt-4" size="2xl">
                        {ticket?.name}
                    </Heading>
                    <Heading size="lg">{`${ticket.danceCategoryName} - ${ticket.advancementLevelName}`}</Heading>
                    <Text size="sm" className="mt-2">{ticket.description}</Text>
                    <Text size="sm" className="mt-2 mb-2">{date}, {startHour} - {endHour}</Text>
                    <Text className="mb-4">{ticket.classRoomName}</Text>
                </ModalBody>
                        <ModalFooter className="flex flex-col gap-2" style={{ paddingBottom: insets.bottom }}>
                            {/*<Button*/}
                            {/*    variant="outline"*/}
                            {/*    action="secondary"*/}
                            {/*    size="md"*/}
                            {/*    className="w-full"*/}
                            {/*>*/}
                            {/*    <ButtonText>Exchange your ticket</ButtonText>*/}
                            {/*</Button>*/}
                            <Button
                                variant="solid"
                                action="secondary"
                                size="md"
                                className="w-full mt-2"
                            >
                                <ButtonText>Invoice</ButtonText>
                            </Button>
                        </ModalFooter>
            </ModalContent>
        </Modal>
    )
}