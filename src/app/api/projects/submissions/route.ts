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
    const projectIdParam = searchParams.get('project_id');
    const projectId = projectIdParam ? Number(projectIdParam) : undefined;

    const submissions = await prisma.studentProjectSubmission.findMany({
      where: {
        ...(user.role === 'STUDENT' ? { studentId: user.id } : {}),
        ...(projectId ? { projectId } : {}),
      },
      include: {
        project: true,
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: 'Failed to retrieve submissions.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { projectId, githubUrl, liveDemoUrl, notes } = await req.json();

    if (!projectId || !githubUrl) {
      return NextResponse.json({ error: 'Project ID and GitHub URL are required.' }, { status: 400 });
    }

    const submission = await prisma.studentProjectSubmission.create({
      data: {
        projectId: Number(projectId),
        studentId: user.id,
        githubUrl: githubUrl.trim(),
        liveDemoUrl: liveDemoUrl?.trim() || null,
        notes: notes?.trim() || null,
        status: 'PENDING_REVIEW',
      },
    });

    return NextResponse.json(
      { message: 'Capstone project submitted for mentor evaluation.', submission },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit project error:', error);
    return NextResponse.json({ error: 'Failed to submit project.' }, { status: 500 });
  }
}
