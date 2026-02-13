'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { UserInvestment, Transaction } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referralStats, setReferralStats] = useState({
    referral_count: 0,
    total_bonus: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (userData && !userData.is_active) {
      router.push('/pay-activation');
      return;
    }

    if (user && userData?.is_active) {
      fetchData();
    }
  }, [user, userData, router]);

  const fetchData = async () => {
    try {
      const token = await user!.getIdToken();

      const [investmentsRes, transactionsRes, referralsRes] = await Promise.all([
        fetch('/api/investments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/transactions?limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/referrals', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [investmentsData, transactionsData, referralsData] = await Promise.all([
        investmentsRes.json(),
        transactionsRes.json(),
        referralsRes.json(),
      ]);

      setInvestments(investmentsData.investments || []);
      setTransactions(transactionsData.transactions || []);
      setReferralStats({
        referral_count: referralsData.referral_count || 0,
        total_bonus: referralsData.total_bonus || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${user?.uid}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + (inv.total_invested || 0), 0);
  const monthlyDividendEstimate = investments.reduce(
    (sum, inv: any) => sum + ((inv.project?.roi_percentage || 0) / 100) * (inv.total_invested || 0),
    0
  );

  if (loading || !userData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {userData.email.split('@')[0]}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's your investment overview
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wallet Balance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {userData.wallet_balance.toLocaleString()}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {totalInvested.toLocaleString()}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Dividends</p>
          <p className="text-2xl font-bold text-green-600">
            UGX {monthlyDividendEstimate.toLocaleString()}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Projects</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {investments.filter(inv => inv.status === 'active').length}
          </p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Referral Program
            </h2>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
              10% Bonus
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Referrals</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {referralStats.referral_count}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Earned</span>
              <span className="font-bold text-green-600">
                UGX {referralStats.total_bonus.toLocaleString()}
              </span>
            </div>
            
            <Button onClick={copyReferralLink} className="w-full">
              {copiedLink ? '✓ Link Copied!' : 'Copy Referral Link'}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/projects')}
              className="w-full"
            >
              Browse Projects
            </Button>
            <Button
              onClick={() => router.push('/projects')}
              variant="secondary"
              className="w-full"
            >
              View All Investments
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            My Investments
          </h2>
          {investments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No investments yet. Start investing to build your portfolio!
            </p>
          ) : (
            <div className="space-y-3">
              {investments.slice(0, 5).map((investment: any) => (
                <div
                  key={investment.id}
                  className="p-3 border dark:border-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {investment.project?.title || 'Unknown Project'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {investment.slots_owned} slots • UGX {investment.total_invested.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {investment.project?.roi_percentage || 0}% ROI
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h2>
          {transactions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 border dark:border-gray-700 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {tx.payment_type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`font-bold ${
                    tx.payment_type === 'referral_bonus' || tx.payment_type === 'dividend'
                      ? 'text-green-600'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {tx.payment_type === 'referral_bonus' || tx.payment_type === 'dividend' ? '+' : ''}
                    UGX {tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
