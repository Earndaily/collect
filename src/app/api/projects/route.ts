import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

async function verifyAdmin(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  try {
    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    return userDoc.exists && userDoc.data()?.is_admin === true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = adminDb.collection('projects').orderBy('created_at', 'desc').limit(limit);

    if (status) {
      query = query.where('status', '==', status) as any;
    }

    const snapshot = await query.get();
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const isAdmin = await verifyAdmin(authHeader);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const {
      title,
      description,
      location,
      target_amount,
      slots_available,
      slot_price,
      roi_percentage,
      image_url,
    } = await request.json();

    if (!title || !description || !location || !target_amount || !slots_available || !slot_price || !roi_percentage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const projectData = {
      title,
      description,
      location,
      target_amount,
      amount_raised: 0,
      slots_available,
      slot_price,
      roi_percentage,
      status: 'open',
      created_at: Date.now(),
      admin_verified: true,
      image_url: image_url || null,
    };

    const projectRef = await adminDb.collection('projects').add(projectData);

    return NextResponse.json({
      success: true,
      project: { id: projectRef.id, ...projectData },
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const isAdmin = await verifyAdmin(authHeader);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    await adminDb.collection('projects').doc(id).update(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
