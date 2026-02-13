'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useProtectedRoute(requireActive = true, requireAdmin = false) {
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (userData) {
        if (requireActive && !userData.is_active) {
          router.push('/pay-activation');
          return;
        }

        if (requireAdmin && !userData.is_admin) {
          router.push('/dashboard');
          return;
        }
      }
    }
  }, [user, userData, loading, router, requireActive, requireAdmin]);

  return { user, userData, loading };
}
