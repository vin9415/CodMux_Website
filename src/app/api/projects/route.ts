import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const track = searchParams.get('track');

    const projects = await prisma.project.findMany({
      where: track ? { track } : undefined,
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Failed to retrieve projects.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { track, title, description, difficulty, deliverables, starterCodeUrl } = await req.json();

    if (!track || !title || !description) {
      return NextResponse.json({ error: 'Track, title, and description are required.' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        track,
        title,
        description,
        difficulty: difficulty || 'INTERMEDIATE',
        deliverables: deliverables || [],
        starterCodeUrl,
      },
    });

    return NextResponse.json({ message: 'Project created successfully.', project }, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project.' }, { status: 500 });
  }
}

