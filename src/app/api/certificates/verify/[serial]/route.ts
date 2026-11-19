import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ serial: string }> }
) {
  try {
    const { serial } = await params;
    if (!serial || !serial.trim()) {
      return NextResponse.json(
        { valid: false, message: 'Certificate serial number is required.' },
        { status: 400 }
      );
    }

    const cleanSerial = serial.trim().toUpperCase();

    const cert = await prisma.certificateRecord.findUnique({
      where: { certificateSerialNumber: cleanSerial },
    });

    if (!cert) {
      return NextResponse.json({
        valid: false,
        status: 'not_found',
        message: `Certificate with serial number ${cleanSerial} was not found in the official CoDMux registry.`,
      });
    }

    // Log the verification query into audit table
    await prisma.certificateAuditLog.create({
      data: {
        certificateSerialNumber: cleanSerial,
        action: 'VERIFIED',
        performedBy: req.headers.get('x-forwarded-for') || 'Public Verification Web Portal',
        details: `Certificate serial ${cleanSerial} was queried and verified.`,
      },
    });

    return NextResponse.json({
      valid: cert.certificateStatus === 'ACTIVE',
      status: cert.certificateStatus.toLowerCase(),
      certificate: {
        certificate_serial_number: cert.certificateSerialNumber,
        student_name_snapshot: cert.studentNameSnapshot,
        course_name_snapshot: cert.courseNameSnapshot,
        instructor_name_snapshot: cert.instructorNameSnapshot,
        course_duration_snapshot: cert.courseDurationSnapshot,
        enrollment_date: cert.enrollmentDate,
        completion_date: cert.completionDate,
        issue_date: cert.issueDate,
        certificate_status: cert.certificateStatus.toLowerCase(),
        revoked_reason: cert.revokedReason,
        revoked_at: cert.revokedAt,
      },
      message:
        cert.certificateStatus === 'ACTIVE'
          ? 'Certificate is authentic, valid, and officially recorded in the CoDMux registry.'
          : 'Certificate is recorded in registry but has been revoked.',
    });
  } catch (error: any) {
    console.error('Verify certificate error:', error);
    return NextResponse.json(
      { valid: false, message: 'Server error during certificate verification.' },
      { status: 500 }
    );
  }
}

