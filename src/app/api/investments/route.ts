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

    const investmentsSnapshot = await adminDb
      .collection('user_investments')
      .where('user_uid', '==', userId)
      .orderBy('investment_date', 'desc')
      .get();

    const investments = await Promise.all(
      investmentsSnapshot.docs.map(async (doc) => {
        const investment = doc.data();
        const projectDoc = await adminDb
          .collection('projects')
          .doc(investment.project_id)
          .get();

        return {
          id: doc.id,
          ...investment,
          project: projectDoc.exists ? projectDoc.data() : null,
        };
      })
    );

    return NextResponse.json({ investments });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
