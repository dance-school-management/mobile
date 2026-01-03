import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import QRCode from 'react-qr-code';
import { Box } from '@/components/ui/box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TicketProp } from '@/util/types/ticket';

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
        <ModalHeader className="justify-center items-center">
          {ticket && (
          <Box className="flex justify-center mt-4 mb-4">
              <QRCode value={ticket.qrCodeUUID} size={256} />
          </Box>
          )}
        </ModalHeader>
        <ModalBody className="mt-3 mb-4">
          <Heading className="text-typography-950 font-semibold" size="2xl">
              {ticket?.name}
          </Heading>
          <Text size="sm" className="mt-2">{ticket.description}</Text>
          <Divider className="my-2" />
          <Box className="flex-row flex-wrap gap-2 mb-2">
              <Badge variant="solid" action="info" className="rounded-lg">
                  <BadgeText className="font-semibold text-sm">{ticket.danceCategoryName} - {ticket.advancementLevelName}</BadgeText>
              </Badge>
          </Box>
          <Box className="flex-row flex-wrap gap-2 mb-2">
            <Badge variant="solid" action="warning" className="rounded-lg">
              <BadgeText className="font-semibold text-sm">Date: {date}, {startHour} - {endHour}</BadgeText>
            </Badge>
          </Box>
          <Box className="flex-row flex-wrap gap-2 mb-2">
            <Badge variant="solid" action="muted" className="rounded-lg">
              <BadgeText className="font-semibold text-sm">Room: {ticket.classRoomName}</BadgeText>
            </Badge>
          </Box>
          <Box className="flex-row flex-wrap gap-2 mb-2">
            <Badge variant="solid" action="success" className="rounded-lg">
              <BadgeText className="font-semibold text-sm">Price: {ticket.price}</BadgeText>
            </Badge>
          </Box>
          <Divider className="my-2" />
          <Box className="mb-2">
            <Text className="font-semibold">Class Type: {ticket.classType}</Text>
            <Text className="font-semibold">Payment Status: {ticket.paymentStatus}</Text>
            {ticket.paymentStatus === 'PART_OF_COURSE' && (
              <Text className="font-semibold">Course Payment Status: {ticket.coursePaymentStatus}</Text>
            )}
          </Box>
          <Divider className="my-2" />
          <Box className="flex-row flex-wrap gap-2 mb-2">
            <Badge variant="solid" action={ticket.attendanceStatus === 'ABSENT' ? 'success' : 'error'} className="rounded-lg">
              <BadgeText className="font-semibold text-sm">Ticket Status: {ticket.attendanceStatus === 'ABSENT' ? 'Not used' : 'Used'}</BadgeText>
            </Badge>
          </Box>
        </ModalBody>
          <ModalFooter className="flex flex-col gap-2" style={{ paddingBottom: insets.bottom }}>
            <Text className="text-center text-sm text-gray-600">
              Please present this QR code at the entrance for verification.
            </Text>
            <Text className="text-center text-sm text-gray-600">
              QR UUID: {ticket.qrCodeUUID}
            </Text>
            <Button variant="solid" action="primary" size="lg" className="w-full" onPress={onClose}>
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  )
}