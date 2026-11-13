import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const track = searchParams.get('track');
    const batch = searchParams.get('batch');

    const classes = await prisma.classSchedule.findMany({
      where: {
        ...(track ? { track } : {}),
        ...(batch ? { batch } : {}),
      },
      include: {
        mentor: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(classes);
  } catch (error: any) {
    console.error('Fetch classes error:', error);
    return NextResponse.json({ error: 'Failed to retrieve classes.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MENTOR')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { track, batch, topic, description, date, timeSlot, roomLink, pptTitle, pptUrl } = await req.json();

    if (!track || !batch || !topic || !date || !timeSlot || !roomLink) {
      return NextResponse.json({ error: 'Required class scheduling fields missing.' }, { status: 400 });
    }

    const newClass = await prisma.classSchedule.create({
      data: {
        track,
        batch,
        topic,
        description,
        mentorId: user.id,
        date: new Date(date),
        timeSlot,
        roomLink,
        pptTitle,
        pptUrl,
      },
    });

    return NextResponse.json(
      { message: 'Class session scheduled successfully.', class: newClass },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Schedule class error:', error);
    return NextResponse.json({ error: 'Failed to schedule class.' }, { status: 500 });
  }
}

