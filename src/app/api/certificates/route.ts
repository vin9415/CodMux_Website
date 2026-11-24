
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCourseCode, generateSerialNumber } from '@/lib/certificate';
import { getCurrentUser } from '@/lib/auth';

// GET: List certificates securely
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    if (user.role !== 'ADMIN' && user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'You are not authorized to view certificates.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const studentIdParam = searchParams.get('student_id');

    let targetStudentId: number | undefined;

    if (user.role === 'STUDENT') {
      // Students can only access their own certificates.
      targetStudentId = user.id;

      if (
        studentIdParam &&
        Number(studentIdParam) !== user.id
      ) {
        return NextResponse.json(
          { error: 'You can only view your own certificates.' },
          { status: 403 }
        );
      }
    } else if (studentIdParam) {
      // Admin can optionally filter by student ID.
      targetStudentId = Number(studentIdParam);

      if (
        !Number.isInteger(targetStudentId) ||
        targetStudentId <= 0
      ) {
        return NextResponse.json(
          { error: 'Invalid student ID.' },
          { status: 400 }
        );
      }
    }

    const certs = await prisma.certificateRecord.findMany({
      where:
        targetStudentId !== undefined
          ? { studentId: targetStudentId }
          : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(certs);
  } catch (error) {
    console.error('Fetch certificates error:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve certificates.' },
      { status: 500 }
    );
  }
}

// POST: Issue Certificate (Admin only)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin privilege required.' },
        { status: 403 }
      );
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
      return NextResponse.json(
        { error: 'Missing required student or course fields.' },
        { status: 400 }
      );
    }

    const parsedStudentId = Number(student_id);

    if (!Number.isInteger(parsedStudentId) || parsedStudentId <= 0) {
      return NextResponse.json(
        { error: 'Invalid student ID.' },
        { status: 400 }
      );
    }

    const student = await prisma.user.findUnique({
      where: { id: parsedStudentId },
      select: { id: true, name: true, role: true },
    });

    if (!student || student.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Student account not found.' },
        { status: 404 }
      );
    }

    const courseCode = getCourseCode(course_id || course_name);
    const count = await prisma.certificateRecord.count();
    const serialNumber = generateSerialNumber(courseCode, count + 1);

    const certificate = await prisma.certificateRecord.create({
      data: {
        certificateSerialNumber: serialNumber,
        studentId: parsedStudentId,
        studentNameSnapshot: student_name,
        courseId: course_id || 'course-default',
        courseNameSnapshot: course_name,
        instructorNameSnapshot:
          instructor_name || 'Code Mux Academic Board',
        courseDurationSnapshot: duration || '60 Days',
        enrollmentDate:
          start_date || new Date().toISOString().split('T')[0],
        completionDate:
          completion_date || new Date().toISOString().split('T')[0],
        issueDate: new Date().toISOString().split('T')[0],
        certificateStatus: 'ACTIVE',
        issuedBy: issued_by || user.email,
      },
    });

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
  } catch (error) {
    console.error('Issue certificate error:', error);

    return NextResponse.json(
      { error: 'Failed to issue certificate.' },
      { status: 500 }
    );
  }
}
