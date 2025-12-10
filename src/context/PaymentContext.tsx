import React, { createContext, useContext, useState, ReactNode } from 'react';
import StripeWebviewModal from "@/components/payments/StripeWebviewModal";

interface PaymentContextType {
  startPayment: (sessionUrl: string, onPaymentSuccess?: () => void) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [successCallback, setSuccessCallback] = useState<(() => void) | null>(null);

  const startPayment = (url: string, onSuccess?: () => void) => {
    setCurrentUrl(url);
    if (onSuccess) setSuccessCallback(() => onSuccess);
    setIsVisible(true);
  }

  const handleClose = () => {
    setIsVisible(false);
    setCurrentUrl('');
    setSuccessCallback(null);
  }

  const handleSuccess = () => {
    if (successCallback) successCallback();
    handleClose();
  }

  return (
    <PaymentContext.Provider value={{ startPayment }}>
      {children}
      <StripeWebviewModal
        isVisible={isVisible}
        sessionUrl={currentUrl}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}