import React, { useState } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';
import { useAppToast } from '@/hooks/useAppToast';
import { showToastErrorAxiosMessage } from '@/util/errors';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PasswordChangeModal({ isOpen, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const showToast = useAppToast();

  const handlePasswordChange = async () => {
    if (!isOpen) return;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showToast({
        title: 'Error',
        description: 'Fill in all password fields.',
        type: 'error',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast({
        title: 'Error',
        description: 'New password and confirmation do not match.',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await api.post(API_PATHS.changePassword, {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      showToast({
        title: 'Password changed',
        description: 'Your password has been successfully changed.',
        type: 'success',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      onClose();
    } catch (err: any) {
      showToastErrorAxiosMessage(showToast, err, 'Error changing password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Change Password</Heading>
        </ModalHeader>

        <ModalBody>
          <Box className="space-y-4">
            <Box>
              <Heading size="sm" className="mb-2">
                Current Password
              </Heading>
              <Input>
                <InputField
                  type="password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </Input>
            </Box>

            <Box>
              <Heading size="sm" className="mb-2">
                New Password
              </Heading>
              <Input>
                <InputField
                  type="password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </Input>
            </Box>

            <Box>
              <Heading size="sm" className="mb-2">
                Confirm New Password
              </Heading>
              <Input>
                <InputField
                  type="password"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
              </Input>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Box className="w-full flex justify-end gap-2">
            <Button variant="outline" onPress={onClose} disabled={loading}>
              <Text>Cancel</Text>
            </Button>
            <Button onPress={handlePasswordChange} disabled={loading}>
              <Text className="text-white">
                {loading ? 'Updating...' : 'Update Password'}
              </Text>
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
