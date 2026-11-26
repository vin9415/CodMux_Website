import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Check whether the logged-in user is an admin.
async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Admin privileges required.' },
      { status: 403 }
    );
  }

  return null;
}

// GET: Retrieve all syllabus tracks.
export async function GET() {
  try {
    const tracks = await prisma.syllabusTrack.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Syllabus GET error:', error);

    return NextResponse.json(
      { error: 'Unable to fetch syllabus tracks.' },
      { status: 500 }
    );
  }
}

// POST: Create a syllabus track (admin only).
export async function POST(req: Request) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const body = await req.json();

    const { trackName, badge, description, durationWeeks, modules } = body;

    if (
      typeof trackName !== 'string' ||
      !trackName.trim() ||
      typeof badge !== 'string' ||
      typeof description !== 'string' ||
      !Number.isInteger(durationWeeks) ||
      durationWeeks < 1 ||
      !Array.isArray(modules)
    ) {
      return NextResponse.json(
        { error: 'Invalid syllabus data.' },
        { status: 400 }
      );
    }

    const track = await prisma.syllabusTrack.create({
      data: {
        trackName: trackName.trim(),
        badge,
        description,
        durationWeeks,
        modules: modules as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error('Syllabus POST error:', error);

    return NextResponse.json(
      { error: 'Unable to create syllabus track.' },
      { status: 500 }
    );
  }
}

// PUT: Update a syllabus track (admin only).
export async function PUT(req: Request) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const body = await req.json();

    const { id, trackName, badge, description, durationWeeks, modules } = body;

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      typeof trackName !== 'string' ||
      !trackName.trim() ||
      typeof badge !== 'string' ||
      typeof description !== 'string' ||
      !Number.isInteger(durationWeeks) ||
      durationWeeks < 1 ||
      !Array.isArray(modules)
    ) {
      return NextResponse.json(
        { error: 'Invalid syllabus update data.' },
        { status: 400 }
      );
    }

    const track = await prisma.syllabusTrack.update({
      where: { id },
      data: {
        trackName: trackName.trim(),
        badge,
        description,
        durationWeeks,
        modules: modules as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error('Syllabus PUT error:', error);

    return NextResponse.json(
      { error: 'Unable to update syllabus track.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a syllabus track (admin only).
export async function DELETE(req: Request) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const body = await req.json();
    const id = body.id;

    if (typeof id !== 'string' || !id.trim()) {
      return NextResponse.json(
        { error: 'A valid syllabus ID is required.' },
        { status: 400 }
      );
    }

    await prisma.syllabusTrack.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Syllabus track deleted successfully.',
    });
  } catch (error) {
    console.error('Syllabus DELETE error:', error);

    return NextResponse.json(
      { error: 'Unable to delete syllabus track.' },
      { status: 500 }
    );
  }
}
