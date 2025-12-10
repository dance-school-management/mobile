import React from 'react';
import { Modal, Button, ButtonText, Box, ModalContent, ModalBackdrop } from '@/components/ui';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';

interface Props {
  isVisible: boolean;
  sessionUrl: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StripeWebviewModal({ isVisible, sessionUrl, onClose, onSuccess }: Props) {
  const isSuccessUrl = (url?: string) =>
    !!url && (url.includes('payment-success') || url.includes('/payment/success') || url.includes('success=true'));

  const isCancelUrl = (url?: string) =>
    !!url && (url.includes('payment-cancel') || url.includes('/payment/cancel'));

  const handleNavigationStateChange = (navState: any) => {
    if (isSuccessUrl(navState?.url)) {
      onSuccess();
    } else if (isCancelUrl(navState?.url)) {
      onClose();
    }
  };

  const handleError = (event: WebViewErrorEvent) => {
    const failingUrl = event?.nativeEvent?.url;
    if (isSuccessUrl(failingUrl)) {
      onSuccess();
    } else if (isCancelUrl(failingUrl)) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="flex-1 w-full max-w-none p-0 m-0 rounded-none" style={{ width: '100%', height: '100%' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Box className="flex-1 bg-white w-full">
            <WebView
              style={{ flex: 1 }}
              source={{ uri: sessionUrl }}
              onNavigationStateChange={handleNavigationStateChange}
              onError={handleError}
              startInLoadingState
              javaScriptEnabled
              domStorageEnabled
            />
            <Box className="p-4 border-t border-gray-200 bg-white">
              <Button action="negative" onPress={onClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </Box>
          </Box>
        </SafeAreaView>
      </ModalContent>
    </Modal>
  )
}