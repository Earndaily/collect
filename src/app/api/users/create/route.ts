import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, phone, referrer_uid } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const userData = {
      uid,
      email,
      phone: phone || null,
      referrer_uid: referrer_uid || null,
      is_active: false,
      wallet_balance: 0,
      joined_at: Date.now(),
      is_admin: false,
    };

    await adminDb.collection('users').doc(uid).set(userData);

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
