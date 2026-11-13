import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentIdParam = searchParams.get('student_id');
    const studentId = user.role === 'STUDENT' ? user.id : studentIdParam ? Number(studentIdParam) : undefined;

    const records = await prisma.attendanceRecord.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        class: true,
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: { markedAt: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error: any) {
    console.error('Fetch attendance error:', error);
    return NextResponse.json({ error: 'Failed to retrieve attendance.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'MENTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Mentor or Admin required.' }, { status: 403 });
    }

    const { classId, studentId, status, remarks } = await req.json();

    if (!classId || !studentId) {
      return NextResponse.json({ error: 'classId and studentId are required.' }, { status: 400 });
    }

    const numClassId = Number(classId);
    const numStudentId = Number(studentId);

    const record = await prisma.attendanceRecord.upsert({
      where: {
        classId_studentId: { classId: numClassId, studentId: numStudentId },
      },
      update: {
        status: status || 'PRESENT',
        remarks,
        markedBy: user.name || user.email,
        markedAt: new Date(),
      },
      create: {
        classId: numClassId,
        studentId: numStudentId,
        status: status || 'PRESENT',
        remarks,
        markedBy: user.name || user.email,
      },
    });

    return NextResponse.json({ message: 'Attendance recorded successfully.', record });
  } catch (error: any) {
    console.error('Record attendance error:', error);
    return NextResponse.json({ error: 'Failed to record attendance.' }, { status: 500 });
  }
}
