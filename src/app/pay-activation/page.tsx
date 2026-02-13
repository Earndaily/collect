'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Payment } from '@/components/Payment';

export default function PayActivationPage() {
  const router = useRouter();
  const { user, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (userData) {
      if (userData.is_active) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    }
  }, [user, userData, router]);

  const handlePaymentSuccess = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await refreshUserData();
    router.push('/dashboard');
  };

  if (loading || !user || !userData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Activate Your Account
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Complete your registration by paying the one-time activation fee of UGX 20,000
          </p>

          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What you get:
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>✓ Full access to investment projects</li>
              <li>✓ Ability to earn monthly dividends</li>
              <li>✓ Unique referral link to earn bonuses</li>
              <li>✓ Portfolio management dashboard</li>
            </ul>
          </div>

          {userData.referrer_uid && (
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-800 dark:text-green-200">
                🎉 Your referrer will receive UGX 2,000 bonus when you activate!
              </p>
            </div>
          )}

          {/* Phone Number Input */}
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="256700000000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter your phone number in format: 256XXXXXXXXX
            </p>
          </div>

          <div className="border-t dark:border-gray-700 pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total Amount:</span>
              <span>UGX 20,000</span>
            </div>
          </div>

          <Payment
            phoneNumber={phoneNumber}
            amount={20000}
            email={userData.email}
            name={userData.email.split('@')[0]}
            metadata={{
              user_uid: user.uid,
              payment_type: 'reg_fee',
              referrer_uid: userData.referrer_uid || undefined,
            }}
            onSuccess={handlePaymentSuccess}
            onClose={() => {}}
            buttonText="Pay Activation Fee"
          />

          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            Secure payment powered by Flutterwave
          </p>
        </Card>
      </div>
    </div>
  );
}
