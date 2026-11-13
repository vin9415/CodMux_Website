import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const [total, active, revoked] = await Promise.all([
      prisma.certificateRecord.count(),
      prisma.certificateRecord.count({ where: { certificateStatus: 'ACTIVE' } }),
      prisma.certificateRecord.count({ where: { certificateStatus: 'REVOKED' } }),
    ]);

    return NextResponse.json({
      total,
      active,
      revoked,
    });
  } catch (error: any) {
    console.error('Fetch cert stats error:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats.' }, { status: 500 });
  }
}
