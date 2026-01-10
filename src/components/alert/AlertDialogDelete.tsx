import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  Text,
} from '@/components/ui';
import React from "react";

interface AlertDialogDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function AlertDialogDelete({ isOpen, onClose, onConfirm, title, description } : AlertDialogDeleteProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop className="flex-1 items-center justify-center" />
      <AlertDialogContent className="opacity-100">
        <AlertDialogHeader>
          <Text className="text-black dark:text-white text-lg font-bold">{title}</Text>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text className="text-black dark:text-white">{description}</Text>
        </AlertDialogBody>
        <AlertDialogFooter className="mt-2">
          <Button variant="outline" onPress={onClose} className="mr-2">
            <Text className="text-black dark:text-white">Cancel</Text>
          </Button>
          <Button variant="solid" action="negative" onPress={onConfirm}>
            <Text className="text-white">Delete</Text>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}