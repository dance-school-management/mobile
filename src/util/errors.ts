import { useAppToast } from '@/hooks/useAppToast';

export type ShowToastFunction = ReturnType<typeof useAppToast>;

export function showToastErrorAxiosMessage(showToast: ShowToastFunction, error: any, defaultMessage = 'An unexpected error occurred') {
  const errors = (error as any).response.data.errors;
  const message = (error as any).response.data.message;
  showToast({
    title: 'Error',
    description: (errors && errors.length > 0) ? errors.map((err: any) => err.message).join('\n') : (message || defaultMessage),
    type: 'error',
  });
}