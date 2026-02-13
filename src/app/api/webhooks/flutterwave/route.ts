import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { PaymentMetadata } from '@/types';

const FLUTTERWAVE_SECRET = process.env.FLUTTERWAVE_SECRET_KEY!;
const REGISTRATION_FEE = 20000;
const REFERRAL_BONUS_PERCENTAGE = 0.1;

function verifyWebhookSignature(signature: string, payload: string): boolean {
  const hash = crypto
    .createHmac('sha256', FLUTTERWAVE_SECRET)
    .update(payload)
    .digest('hex');
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('verif-hash');
    const rawBody = await request.text();
    
    if (!signature || !verifyWebhookSignature(signature, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    if (event !== 'charge.completed' || data.status !== 'successful') {
      return NextResponse.json({ message: 'Event ignored' });
    }

    const { tx_ref, amount, customer, meta } = data;
    const metadata: PaymentMetadata = meta;

    const txDoc = await adminDb.collection('transactions').doc(tx_ref).get();
    if (txDoc.exists) {
      return NextResponse.json({ message: 'Transaction already processed' });
    }

    const batch = adminDb.batch();

    const transactionRef = adminDb.collection('transactions').doc(tx_ref);
    batch.set(transactionRef, {
      tx_ref,
      user_uid: metadata.user_uid,
      amount,
      payment_type: metadata.payment_type,
      status: 'completed',
      created_at: Date.now(),
      flutterwave_id: data.id,
      project_id: metadata.project_id || null,
    });

    if (metadata.payment_type === 'reg_fee') {
      const userRef = adminDb.collection('users').doc(metadata.user_uid);
      batch.update(userRef, { is_active: true });

      if (metadata.referrer_uid) {
        const bonusAmount = REGISTRATION_FEE * REFERRAL_BONUS_PERCENTAGE;
        const referrerRef = adminDb.collection('users').doc(metadata.referrer_uid);
        
        batch.update(referrerRef, {
          wallet_balance: admin.firestore.FieldValue.increment(bonusAmount),
        });

        const bonusRef = adminDb.collection('transactions').doc();
        batch.set(bonusRef, {
          tx_ref: `bonus_${tx_ref}`,
          user_uid: metadata.referrer_uid,
          amount: bonusAmount,
          payment_type: 'referral_bonus',
          status: 'completed',
          created_at: Date.now(),
        });
      }
    } else if (metadata.payment_type === 'investment' && metadata.project_id) {
      const projectRef = adminDb.collection('projects').doc(metadata.project_id);
      const projectDoc = await projectRef.get();
      
      if (!projectDoc.exists) {
        throw new Error('Project not found');
      }

      const project = projectDoc.data()!;
      const slotsToDeduct = metadata.slots || 1;

      if (project.slots_available < slotsToDeduct) {
        throw new Error('Not enough slots available');
      }

      batch.update(projectRef, {
        slots_available: admin.firestore.FieldValue.increment(-slotsToDeduct),
        amount_raised: admin.firestore.FieldValue.increment(amount),
      });

      const investmentRef = adminDb.collection('user_investments').doc();
      batch.set(investmentRef, {
        user_uid: metadata.user_uid,
        project_id: metadata.project_id,
        slots_owned: slotsToDeduct,
        investment_date: Date.now(),
        status: 'active',
        total_invested: amount,
      });
    }

    await batch.commit();

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
