import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin privilege required.' }, { status: 403 });
    }

    const { serial, reason } = await req.json();
    if (!serial || !reason) {
      return NextResponse.json({ error: 'Serial number and revocation reason are required.' }, { status: 400 });
    }

    const cleanSerial = serial.trim().toUpperCase();

    const cert = await prisma.certificateRecord.update({
      where: { certificateSerialNumber: cleanSerial },
      data: {
        certificateStatus: 'REVOKED',
        revokedReason: reason,
        revokedAt: new Date(),
        revokedBy: user.email,
      },
    });

    await prisma.certificateAuditLog.create({
      data: {
        certificateSerialNumber: cleanSerial,
        action: 'REVOKED',
        performedBy: user.email,
        details: `Certificate revoked by ${user.email}. Reason: ${reason}`,
        reason,
      },
    });

    return NextResponse.json({
      message: `Certificate ${cleanSerial} successfully revoked.`,
      certificate: cert,
    });
  } catch (error: any) {
    console.error('Revoke cert error:', error);
    return NextResponse.json({ error: 'Failed to revoke certificate.' }, { status: 500 });
  }
}

