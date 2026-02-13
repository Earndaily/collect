import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function verifyAuthToken(
  request: NextRequest
): Promise<{ uid: string; isAdmin: boolean } | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();
    
    return {
      uid: decodedToken.uid,
      isAdmin: userData?.is_admin === true,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  
  if (!auth) {
    throw new Error('Unauthorized');
  }
  
  return auth;
}

export async function requireAdmin(request: NextRequest) {
  const auth = await requireAuth(request);
  
  if (!auth.isAdmin) {
    throw new Error('Admin access required');
  }
  
  return auth;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+256[0-9]{9}$/;
  return phoneRegex.test(phone);
}
