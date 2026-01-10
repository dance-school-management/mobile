import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Box } from '@/components/ui/box';
import { CalendarEvent } from '@/util/types/schedule';
import { usePayment } from '@/context/PaymentContext';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';
import { useSessionQuery } from '@/lib/auth/session';
import AlertDialogDelete from '@/components/alert/AlertDialogDelete';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Input,
  InputField,
} from '@/components/ui';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

type EventDetailsProps = {
  event: CalendarEvent | null;
  visible: boolean;
  onClose: () => void;
};

const startOfMinute = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0, 0);

const formatDateTime = (d?: Date) => {
  if (!d) return '—';
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
};

export default function EventDetails({ event, visible, onClose }: EventDetailsProps) {
  if (!event) return null;

  const { data: sessionData } = useSessionQuery();
  // @ts-ignore
  const role = (sessionData?.data?.user?.role as Role) || 'STUDENT';

  const showToast = useAppToast();

  const scheduleItem = event.scheduleItem;

  const startDate = new Date(scheduleItem.startDate);
  const endDate = new Date(scheduleItem.endDate);

  const date = startDate.toLocaleDateString();
  const startHour = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endHour = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const classTemplate = scheduleItem.classTemplate;
  const classRoom = scheduleItem.classRoom;
  const classStatus = scheduleItem.classStatus;
  const instructors = scheduleItem.instructors ?? [];
  const owned = scheduleItem.owned;
  const paymentStatus = scheduleItem.paymentStatus;

  const danceCategoryName = classTemplate?.danceCategory?.name;
  const advancementLevelName = classTemplate?.advancementLevel?.name;
  const price = classTemplate?.price;

  const title = classTemplate?.name ?? 'Class details';
  const description = classTemplate?.description ?? classTemplate?.course?.description ?? '';

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showPostponeDialog, setShowPostponeDialog] = useState<boolean>(false);

  const [postponeReason, setPostponeReason] = useState<string>('');
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(undefined);
  const [newEndDate, setNewEndDate] = useState<Date | undefined>(undefined);

  const { startPayment } = usePayment();

  const handleBuyClick = async () => {
    try {
      const response = await api.post(API_PATHS.postOrderClass, { classId: event.id });
      const { sessionUrl } = response.data;
      if (!sessionUrl) return;

      startPayment(sessionUrl, () => {
        showToast({
          title: 'Payment Successful',
          description: 'You have successfully enrolled in the class.',
          type: 'success',
        });
      });
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error initiating enrollment');
    }
  };

  const handleCancelClass = async () => {
    try {
      await api.post(API_PATHS.cancelClass, {
        classId: event.id,
        reason: `Class ${scheduleItem.classTemplate?.name} cancelled by coordinator. You should receive a refund if you have already paid. This is an automated message.`,
        isConfirmation: true,
      });
      showToast({
        title: 'Class Cancelled',
        description: 'The class has been successfully cancelled.',
        type: 'success',
      });
      onClose();
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error cancelling class');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const openDateTimePicker = (
    current: Date | undefined,
    onChange: (next: Date) => void,
  ) => {
    const base = current ?? new Date();

    DateTimePickerAndroid.open({
      value: base,
      mode: 'date',
      is24Hour: true,
      onChange: (_e, selectedDate) => {
        if (!selectedDate) return;

        const withSameTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          base.getHours(),
          base.getMinutes(),
          0,
          0,
        );

        DateTimePickerAndroid.open({
          value: withSameTime,
          mode: 'time',
          is24Hour: true,
          onChange: (_e2, selectedTime) => {
            if (!selectedTime) return;
            onChange(startOfMinute(selectedTime));
          },
        });
      },
    });
  };

  const handleOpenPostpone = () => {
    setPostponeReason('');
    setNewStartDate(startOfMinute(startDate));
    setNewEndDate(startOfMinute(endDate));
    setShowPostponeDialog(true);
  };

  const handlePostponeClass = async () => {
    const reason = postponeReason.trim();
    if (!reason || !newStartDate || !newEndDate) {
      showToast({
        title: 'Missing data',
        description: 'Fill reason, start date and end date.',
        type: 'error',
      });
      return;
    }

    if (newEndDate.getTime() <= newStartDate.getTime()) {
      showToast({
        title: 'Invalid dates',
        description: 'End date must be after start date.',
        type: 'error',
      });
      return;
    }

    try {
      await api.post(API_PATHS.postponeClass, {
        classId: event.id,
        reason,
        newStartDate: newStartDate.toISOString(),
        newEndDate: newEndDate.toISOString(),
        isConfirmation: true
      });

      showToast({
        title: 'Class Postponed',
        description: 'The class has been successfully postponed. All enrolled students have been notified.',
        type: 'success',
      });

      setShowPostponeDialog(false);
      onClose();
    } catch (error) {
      showToastErrorAxiosMessage(showToast, error, 'Error postponing class');
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="items-center">
          <Box className="flex-row items-center gap-2 flex-wrap">
            <Box className="flex-1 min-w-0">
              <Heading
                className="text-typography-950 font-semibold text-center"
                size="lg"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {title}
              </Heading>
            </Box>

            {owned && (
              <Badge variant="solid" action="success" className="rounded-lg">
                <BadgeText className="font-semibold text-xs">Owned</BadgeText>
              </Badge>
            )}
          </Box>
        </ModalHeader>

        <ModalBody className="mt-3 mb-4">
          {description ? (
            <Text size="sm" className="mt-1">
              {description}
            </Text>
          ) : null}

          {owned && (
            <Box className="mt-3 mb-1">
              <Text className="font-semibold text-success-600">You already have access to this class.</Text>
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
                <BadgeText className="font-semibold text-sm">Room: {classRoom.name}</BadgeText>
              </Badge>
            </Box>
          )}

          <Box className="flex-row flex-wrap gap-2 mb-2">
            <Badge variant="outline" action={classStatus === 'SCHEDULED' ? 'success' : (classStatus === 'POSTPONED' ? 'warning' : 'negative')} className="rounded-lg">
              <BadgeText className="font-semibold text-sm">Status: {classStatus}</BadgeText>
            </Badge>
          </Box>

          {paymentStatus && (
            <Box className="flex-row flex-wrap gap-2 mb-2">
              <Badge variant="outline" action="info" className="rounded-lg">
                <BadgeText className="font-semibold text-sm">Payment status: {paymentStatus}</BadgeText>
              </Badge>
            </Box>
          )}

          {instructors.length > 0 && (
            <>
              <Divider className="my-3" />
              <Text className="font-semibold mb-1">Instructors</Text>
              <Text className="mb-2">{instructors.map((inst) => `${inst.name} ${inst.surname}`).join(', ')}</Text>
            </>
          )}
        </ModalBody>

        <ModalFooter className="flex flex-row gap-2 justify-end">
          {!owned && role === 'STUDENT' && (
            <Button variant="solid" action="positive" onPress={handleBuyClick}>
              <ButtonText>Purchase ${price}</ButtonText>
            </Button>
          )}

          {role === 'COORDINATOR' && (
            <Box className="flex-row gap-2">
              <Button variant="solid" action="primary" onPress={handleOpenPostpone} className="flex-1">
                <ButtonText>Postpone</ButtonText>
              </Button>
              <Button
                variant="solid"
                action="negative"
                onPress={() => setShowDeleteDialog(true)}
                className="flex-1"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
            </Box>
          )}
        </ModalFooter>
      </ModalContent>

      <AlertDialogDelete
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleCancelClass}
        title="Cancel Class"
        description="Are you sure you want to cancel this class? This action cannot be undone. All enrolled students will be notified."
      />

      <AlertDialog isOpen={showPostponeDialog} onClose={() => setShowPostponeDialog(false)}>
        <AlertDialogBackdrop className="flex-1 items-center justify-center" />
        <AlertDialogContent className="opacity-100">
          <AlertDialogHeader>
            <Text className="text-black dark:text-white text-lg font-bold">Postpone Class</Text>
          </AlertDialogHeader>

          <AlertDialogBody>
            <Box className="gap-3">
              <Box>
                <Text className="text-black dark:text-white font-semibold mb-1">Reason</Text>
                <Input variant="outline" className="rounded-md">
                  <InputField
                    value={postponeReason}
                    onChangeText={setPostponeReason}
                    placeholder="Enter reason"
                    multiline
                    style={{ textAlignVertical: 'center', paddingVertical: 0 }}
                  />
                </Input>
              </Box>

              <Box>
                <Text className="text-black dark:text-white font-semibold mb-1">New start</Text>
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={() =>
                    openDateTimePicker(newStartDate, (next) => {
                      setNewStartDate(next);
                      if (newEndDate && newEndDate.getTime() <= next.getTime()) {
                        setNewEndDate(new Date(next.getTime() + 60 * 60 * 1000));
                      }
                    })
                  }
                  className="rounded-md"
                >
                  <ButtonText>{formatDateTime(newStartDate)}</ButtonText>
                </Button>
              </Box>

              <Box>
                <Text className="text-black dark:text-white font-semibold mb-1">New end</Text>
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={() =>
                    openDateTimePicker(newEndDate ?? newStartDate, (next) => {
                      setNewEndDate(next);
                      if (newStartDate && next.getTime() <= newStartDate.getTime()) {
                        setNewStartDate(new Date(next.getTime() - 60 * 60 * 1000));
                      }
                    })
                  }
                  className="rounded-md"
                >
                  <ButtonText>{formatDateTime(newEndDate)}</ButtonText>
                </Button>
              </Box>
            </Box>
          </AlertDialogBody>

          <AlertDialogFooter className="mt-2">
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="outline" onPress={() => setShowPostponeDialog(false)}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button variant="solid" action="primary" onPress={handlePostponeClass}>
                <ButtonText>Postpone</ButtonText>
              </Button>
            </View>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Modal>
  );
}
