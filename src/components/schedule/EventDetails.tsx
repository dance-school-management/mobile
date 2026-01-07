import React from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Box } from '@/components/ui/box';
import { CalendarEvent } from '@/util/types/schedule';
import { usePayment } from '@/context/PaymentContext';
import api from "@/server/axios";
import {API_PATHS} from "@/util/endpoints";
import {router} from "expo-router";

type EventDetailsProps = {
  event: CalendarEvent | null;
  visible: boolean;
  onClose: () => void;
};

export default function EventDetails({ event, visible, onClose }: EventDetailsProps) {
  if (!event) return null;

  const scheduleItem = event.scheduleItem;

  const startDate = new Date(scheduleItem.startDate);
  const endDate = new Date(scheduleItem.endDate);

  const date = startDate.toLocaleDateString();
  const startHour = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endHour = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const classTemplate = scheduleItem.classTemplate;
  const classRoom = scheduleItem.classRoom;
  const instructors = scheduleItem.instructors ?? [];
  const owned = scheduleItem.owned;
  const paymentStatus = scheduleItem.paymentStatus;

  const danceCategoryName = classTemplate?.danceCategory?.name;
  const advancementLevelName = classTemplate?.advancementLevel?.name;
  const price = classTemplate?.price;

  const title = classTemplate?.name ?? 'Class details';
  const description =
    classTemplate?.description ??
    classTemplate?.course?.description ??
    '';

  const { startPayment } = usePayment();

  const handleBuyClick = async () => {
    console.log('Initiating enrollment for class ID:', event.id);
    try {
      const response = await api.post(API_PATHS.postOrderClass, {
        classId: event.id
      });
      const { sessionUrl } = response.data;
      console.log('Starting payment with session URL:', sessionUrl);
      if (!sessionUrl) return;
      startPayment(sessionUrl, () => {
        console.log('Payment successful!');
      });
    } catch (error) {
      console.error('Error initiating enrollment:', error);
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="items-center">
          <Box className="flex-row items-center gap-2">
            <Heading className="text-typography-950 font-semibold text-center" size="lg">
              {title}
            </Heading>
            {owned && (
              <Badge variant="solid" action="success" className="rounded-lg">
                <BadgeText className="font-semibold text-xs">Owned</BadgeText>
              </Badge>
            )}
          </Box>
          <ModalCloseButton>
            <Icon as={CloseIcon} className="stroke-background-500" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody className="mt-3 mb-4">
          {description ? (
            <Text size="sm" className="mt-1">
              {description}
            </Text>
          ) : null}

          {owned && (
            <Box className="mt-3 mb-1">
              <Text className="font-semibold text-success-600">
                You already have access to this class.
              </Text>
            </Box>
          )}

          <Divider className="my-3" />

          {danceCategoryName && advancementLevelName && (
            <Box className="flex-row flex-wrap gap-2 mb-2">
              <Badge variant="solid" action="info" className="rounded-lg">
                <BadgeText className="font-semibold text-sm">
                  {danceCategoryName} - {advancementLevelName}
                </BadgeText>
              </Badge>
            </Box>
          )}

          <Box className="flex-row flex-wrap gap-2 mb-2">
            <Badge variant="solid" action="warning" className="rounded-lg">
              <BadgeText className="font-semibold text-sm">
                Date: {date}, {startHour} - {endHour}
              </BadgeText>
            </Badge>
          </Box>

          {classRoom?.name && (
            <Box className="flex-row flex-wrap gap-2 mb-2">
              <Badge variant="solid" action="muted" className="rounded-lg">
                <BadgeText className="font-semibold text-sm">
                  Room: {classRoom.name}
                </BadgeText>
              </Badge>
            </Box>
          )}

          {paymentStatus && (
            <Box className="flex-row flex-wrap gap-2 mb-2">
              <Badge variant="outline" action="info" className="rounded-lg">
                <BadgeText className="font-semibold text-sm">
                  Payment status: {paymentStatus}
                </BadgeText>
              </Badge>
            </Box>
          )}

          {instructors.length > 0 && (
            <>
              <Divider className="my-3" />
              <Text className="font-semibold mb-1">Instructors</Text>
              <Text className="mb-2">
                {instructors.map(inst => `${inst.name} ${inst.surname}`).join(', ')}
              </Text>
            </>
          )}
        </ModalBody>

        <ModalFooter className="flex flex-row gap-2 justify-end">
          {!owned && (
            <Button variant="solid" action="positive" onPress={handleBuyClick}>
              <ButtonText>Purchase ${price}</ButtonText>
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
