import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal'
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon'
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';
import api from '@/server/axios';
import { API_PATHS } from '@/util/endpoints';

export default function PasswordChangeModal({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  const handlePasswordChange = async () => {
    if (!isVisible) return;
    if (newPassword !== confirmNewPassword) {
      console.error("New passwords do not match");
      return;
    }
    try {
      await api.post(API_PATHS.changePassword, {
        currentPassword,
        newPassword,
        revokeOtherSessions: true
      })
      console.log("Password changed successfully");
      onClose();
    } catch (error) {
      console.error("Error changing password:", error);
    }
  }

  return (
    <Modal visible={isVisible} onClose={onClose} title="Change Password">
      <Box className="space-y-4">
        <Box>
          <Heading size="sm" className="mb-2">Current Password</Heading>
          <Input>
            <InputField type='password'} />
          </Input>
        </Box>
        <Box>
          <Heading size="sm" className="mb-2">New Password</Heading>
          <Input>
            <InputField type='password'} />
          </Input>
        </Box>
        <Box>
          <Heading size="sm" className="mb-2">Confirm New Password</Heading>
          <Input>
            <InputField type='password'} />
          </Input>
        </Box>
        <Button onPress={() => { /* Handle password change logic here */ }}>
          <Text className="text-white">Update Password</Text>
        </Button>
      </Box>
    </Modal>
  )
}