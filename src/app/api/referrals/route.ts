import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

async function verifyUser(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = await verifyUser(authHeader);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const referralsSnapshot = await adminDb
      .collection('users')
      .where('referrer_uid', '==', userId)
      .get();

    const bonusSnapshot = await adminDb
      .collection('transactions')
      .where('user_uid', '==', userId)
      .where('payment_type', '==', 'referral_bonus')
      .get();

    const totalBonus = bonusSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().amount || 0),
      0
    );

    return NextResponse.json({
      referral_count: referralsSnapshot.size,
      total_bonus: totalBonus,
      referrals: referralsSnapshot.docs.map(doc => ({
        uid: doc.id,
        email: doc.data().email,
        joined_at: doc.data().joined_at,
        is_active: doc.data().is_active,
      })),
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
