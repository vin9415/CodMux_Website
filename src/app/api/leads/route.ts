import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, interest } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const lead = await prisma.earlyAccessLead.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        interest: interest || 'Full-Stack Web & Cloud Engineering',
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { message: 'Priority early access registered successfully.', lead },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Failed to record registration.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const leads = await prisma.earlyAccessLead.findMany({
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Fetch leads error:', error);
    return NextResponse.json({ error: 'Failed to retrieve leads.' }, { status: 500 });
  }
}

