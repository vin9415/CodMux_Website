
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// POST: Save a new contact inquiry
export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, interest, message } = await req.json();

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof message !== 'string' ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject:
          typeof subject === 'string' && subject.trim()
            ? subject.trim()
            : 'Admissions Inquiry',
        interest:
          typeof interest === 'string' && interest.trim()
            ? interest.trim()
            : 'General Information',
        message: message.trim(),
        status: 'NEW',
      },
    });

    return NextResponse.json(
      {
        message: 'Inquiry received. An admissions counselor will respond soon.',
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact inquiry error:', error);

    return NextResponse.json(
      { error: 'Failed to record inquiry.' },
      { status: 500 }
    );
  }
}

// GET: Retrieve all inquiries (ADMIN only)
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Fetch inquiries error:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve inquiries.' },
      { status: 500 }
    );
  }
}

// PATCH: Update inquiry status (ADMIN only)
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const id = Number(body.id);
    const status = body.status;

    const allowedStatuses = ['NEW', 'RESPONDED'];

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: 'A valid inquiry ID is required.' },
        { status: 400 }
      );
    }

    if (
      typeof status !== 'string' ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { error: 'Invalid inquiry status.' },
        { status: 400 }
      );
    }

    const updatedInquiry = await prisma.contactInquiry.update({
      where: { id },
      data: { status: status as 'NEW' | 'RESPONDED' },
    });

    return NextResponse.json({
      message: 'Inquiry status updated successfully.',
      inquiry: updatedInquiry,
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Inquiry not found.' },
        { status: 404 }
      );
    }

    console.error('Update inquiry status error:', error);

    return NextResponse.json(
      { error: 'Failed to update inquiry status.' },
      { status: 500 }
    );
  }
}
