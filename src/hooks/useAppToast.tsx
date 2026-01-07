import React from 'react';
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from '@/components/ui/toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useAppToast = () => {
  const toast = useToast();

  const showToast = ({
                       title,
                       description,
                       type = 'info',
                     }: {
    title: string;
    description?: string;
    type?: ToastType;
  }) => {
    const actionMap: Record<ToastType, 'success' | 'error' | 'info' | 'warning'> = {
      success: 'success',
      error: 'error',
      info: 'info',
      warning: 'warning',
    };

    const prefixMap: Record<ToastType, string> = {
      success: '✅ ',
      error: '❌ ',
      info: 'ℹ️ ',
      warning: '⚠️ ',
    };

    const composedTitle = `${prefixMap[type] ?? ''}${title}`;

    toast.show({
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = `toast-${id}`;
        return (
          <Toast
            nativeID={uniqueToastId}
            action={actionMap[type]}
            variant="solid"
            className="px-5 py-3 gap-1 w-full max-w-md"
          >
            <ToastTitle className="font-bold text-white">
              {composedTitle}
            </ToastTitle>
            {description && (
              <ToastDescription className="text-white">
                {description}
              </ToastDescription>
            )}
          </Toast>
        );
      },
    });
  };

  return showToast;
};
