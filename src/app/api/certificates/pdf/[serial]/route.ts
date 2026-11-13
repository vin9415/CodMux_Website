import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderCertificatePDF } from '@/lib/certificate';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ serial: string }> }
) {
  try {
    const { serial } = await params;
    if (!serial || !serial.trim()) {
      return new NextResponse('Certificate serial number is required.', { status: 400 });
    }

    const cleanSerial = serial.trim().toUpperCase();

    const cert = await prisma.certificateRecord.findUnique({
      where: { certificateSerialNumber: cleanSerial },
    });

    if (!cert) {
      return new NextResponse('Certificate not found in official Code Mux registry.', { status: 404 });
    }

    const pdfBuffer = renderCertificatePDF({
      serialNumber: cert.certificateSerialNumber,
      studentName: cert.studentNameSnapshot,
      courseName: cert.courseNameSnapshot,
      instructorName: cert.instructorNameSnapshot,
      courseDuration: cert.courseDurationSnapshot,
      enrollmentDate: cert.enrollmentDate,
      completionDate: cert.completionDate,
      status: cert.certificateStatus,
    });

    const cleanStudent = (cert.studentNameSnapshot || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
    const cleanCourse = (cert.courseNameSnapshot || 'Course').slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `CodeMux_Certificate_${cleanStudent}_${cleanCourse}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error: any) {
    console.error('PDF export error:', error);
    return new NextResponse('Failed to generate certificate PDF.', { status: 500 });
  }
}
