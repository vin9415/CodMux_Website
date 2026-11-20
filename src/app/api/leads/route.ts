
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// POST: Register a new early-access lead
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, interest } = await req.json();

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim()
    ) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const lead = await prisma.earlyAccessLead.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: typeof phone === 'string' ? phone.trim() || null : null,
        interest:
          typeof interest === 'string' && interest.trim()
            ? interest.trim()
            : 'Full-Stack Web & Cloud Engineering',
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      {
        message: 'Priority early access registered successfully.',
        lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);

    return NextResponse.json(
      { error: 'Failed to record registration.' },
      { status: 500 }
    );
  }
}

// GET: Retrieve all leads (ADMIN only)
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const leads = await prisma.earlyAccessLead.findMany({
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Fetch leads error:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve leads.' },
      { status: 500 }
    );
  }
}

// PATCH: Update lead status (ADMIN only)
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

    const allowedStatuses = ['PENDING', 'CONTACTED', 'ENROLLED'];

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: 'A valid lead ID is required.' },
        { status: 400 }
      );
    }

    if (
      typeof status !== 'string' ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { error: 'Invalid lead status.' },
        { status: 400 }
      );
    }

    const updatedLead = await prisma.earlyAccessLead.update({
      where: { id },
      data: { status: status as 'PENDING' | 'CONTACTED' | 'ENROLLED' },
    });

    return NextResponse.json({
      message: 'Lead status updated successfully.',
      lead: updatedLead,
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    console.error('Update lead status error:', error);

    return NextResponse.json(
      { error: 'Failed to update lead status.' },
      { status: 500 }
    );
  }
}
// DELETE: Delete an early-access lead (ADMIN only)
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: 'A valid lead ID is required.' },
        { status: 400 }
      );
    }

    const deletedLead = await prisma.earlyAccessLead.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Lead deleted successfully.',
      lead: deletedLead,
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Lead not found.' },
        { status: 404 }
      );
    }

    console.error('Delete lead error:', error);

    return NextResponse.json(
      { error: 'Failed to delete lead.' },
      { status: 500 }
    );
  }
}