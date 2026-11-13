import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, age, interest, role = 'STUDENT' } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const parsedAge = age ? parseInt(String(age), 10) : null;

    const userRole = role === 'ADMIN' ? 'ADMIN' : role === 'MENTOR' ? 'MENTOR' : 'STUDENT';

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        phone: phone?.trim() || null,
        age: isNaN(Number(parsedAge)) ? null : parsedAge,
        track: interest || 'Full-Stack Web & Cloud Engineering (React, Node & AWS)',
        batch: 'Cohort 2026-A',
        role: userRole,
      },
    });

    // Auto sign-in on registration
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json(
      {
        message: 'Account registered successfully.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          track: user.track,
          batch: user.batch,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Server error during registration.' },
      { status: 500 }
    );
  }
}

