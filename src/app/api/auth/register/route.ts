
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, password, phone, age, interest } = body ?? {};

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
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

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    let parsedAge: number | null = null;

    if (age !== undefined && age !== null && age !== '') {
      parsedAge = Number(age);

      if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
        return NextResponse.json(
          { error: 'Please provide a valid age.' },
          { status: 400 }
        );
      }
    }

    const passwordHash = await hashPassword(password);

    // Public registration is always STUDENT.
    // Never accept a role supplied by the request.
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        phone:
          typeof phone === 'string' && phone.trim()
            ? phone.trim()
            : null,
        age: parsedAge,
        track:
          typeof interest === 'string' && interest.trim()
            ? interest.trim()
            : 'Full-Stack Web & Cloud Engineering (React, Node & AWS)',
        batch: 'Cohort 2026-A',
        role: 'STUDENT',
      },
    });

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
          phone: user.phone,
          track: user.track,
          batch: user.batch,
          status: user.status,
          joinedAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json(
      { error: 'Server error during registration.' },
      { status: 500 }
    );
  }
}
