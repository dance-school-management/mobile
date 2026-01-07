import { useAppToast } from '@/hooks/useAppToast';

export type ShowToastFunction = ReturnType<typeof useAppToast>;

export function showToastErrorAxiosMessage(showToast: ShowToastFunction, error: any, defaultMessage = 'An unexpected error occurred') {
  const errors = (error as any).response.data.errors;
  showToast({
    title: 'Error',
    description: errors ? errors.map((err: any) => err.message).join('\n') : defaultMessage,
    type: 'error',
  });
}