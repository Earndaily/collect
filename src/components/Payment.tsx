'use client';
import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { PaymentMetadata } from '@/types';

interface PaymentProps {
  amount: number;
  email: string;
  name: string;
  phoneNumber: string; // Add this
  metadata: PaymentMetadata;
  onSuccess: () => void;
  onClose: () => void;
  buttonText?: string;
}

export const Payment: React.FC<PaymentProps> = ({
  amount,
  email,
  name,
  phoneNumber, // Add this
  metadata,
  onSuccess,
  onClose,
  buttonText = 'Pay Now',
}) => {
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency: 'UGX',
    payment_options: 'mobilemoneyuganda,card',
    customer: {
      email,
      name,
      phone_number: phoneNumber, // Add this
    },
    meta: metadata,
    customizations: {
      title: 'Collective Advantage',
      description: metadata.payment_type === 'reg_fee' ? 'Registration Fee' : 'Investment Payment',
      logo: '',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <button
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            console.log('Payment response:', response);
            closePaymentModal();
            if (response.status === 'successful') {
              onSuccess();
            }
          },
          onClose: () => {
            closePaymentModal();
            onClose();
          },
        });
      }}
      className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all"
    >
      {buttonText}
    </button>
  );
};
