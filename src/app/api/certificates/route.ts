import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCourseCode, generateSerialNumber } from '@/lib/certificate';
import { getCurrentUser } from '@/lib/auth';

// GET: List certificates (optional ?student_id=...)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('student_id');

    const certs = await prisma.certificateRecord.findMany({
      where: studentId ? { studentId: Number(studentId) } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(certs);
  } catch (error: any) {
    console.error('Fetch certs error:', error);
    return NextResponse.json({ error: 'Failed to retrieve certificates.' }, { status: 500 });
  }
}

// POST: Issue Certificate
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin privilege required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      student_id,
      student_name,
      course_id,
      course_name,
      instructor_name,
      duration,
      start_date,
      completion_date,
      issued_by,
    } = body;

    if (!student_id || !student_name || !course_name) {
      return NextResponse.json({ error: 'Missing required student or course fields.' }, { status: 400 });
    }

    const courseCode = getCourseCode(course_id || course_name);
    const count = await prisma.certificateRecord.count();
    const serialNumber = generateSerialNumber(courseCode, count + 1);

    const certificate = await prisma.certificateRecord.create({
      data: {
        certificateSerialNumber: serialNumber,
        studentId: Number(student_id),
        studentNameSnapshot: student_name,
        courseId: course_id || 'course-default',
        courseNameSnapshot: course_name,
        instructorNameSnapshot: instructor_name || 'Code Mux Academic Board',
        courseDurationSnapshot: duration || '60 Days',
        enrollmentDate: start_date || new Date().toISOString().split('T')[0],
        completionDate: completion_date || new Date().toISOString().split('T')[0],
        issueDate: new Date().toISOString().split('T')[0],
        certificateStatus: 'ACTIVE',
        issuedBy: issued_by || user.email,
      },
    });

    // Write audit log
    await prisma.certificateAuditLog.create({
      data: {
        certificateSerialNumber: serialNumber,
        action: 'ISSUED',
        performedBy: user.email,
        details: `Certificate ${serialNumber} issued to ${student_name} for ${course_name}.`,
      },
    });

    return NextResponse.json(
      {
        message: 'Certificate issued successfully.',
        certificate,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Issue certificate error:', error);
    return NextResponse.json({ error: error.message || 'Failed to issue certificate.' }, { status: 500 });
  }
}

