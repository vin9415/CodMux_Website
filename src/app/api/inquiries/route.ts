import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, interest, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject || 'Admissions Inquiry',
        interest: interest || 'General Information',
        message: message.trim(),
        status: 'NEW',
      },
    });

    return NextResponse.json(
      { message: 'Inquiry received. An admissions counselor will respond soon.', inquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact inquiry error:', error);
    return NextResponse.json({ error: 'Failed to record inquiry.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(inquiries);
  } catch (error: any) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json({ error: 'Failed to retrieve inquiries.' }, { status: 500 });
  }
}

