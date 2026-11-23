
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Read and validate request body
    const body = await req.json();

    const { email, password, role } = body ?? {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Validate optional role
    const allowedRoles = ['STUDENT', 'MENTOR', 'ADMIN'];

    let requestedRole: string | undefined;

    if (role !== undefined && role !== null && role !== '') {
      if (typeof role !== 'string') {
        return NextResponse.json(
          { error: 'Invalid role provided.' },
          { status: 400 }
        );
      }

      requestedRole = role.trim().toUpperCase();

      if (!allowedRoles.includes(requestedRole)) {
        return NextResponse.json(
          { error: 'Invalid role provided.' },
          { status: 400 }
        );
      }
    }

    // 3. Find user in PostgreSQL database
    const user = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password credentials.' },
        { status: 401 }
      );
    }

    // 4. Check account status
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error:
            'This user account is currently deactivated. Please contact support.',
        },
        { status: 403 }
      );
    }

    // 5. Check requested role, if supplied
    if (requestedRole && user.role !== requestedRole) {
      return NextResponse.json(
        { error: `Account does not have authorization as ${requestedRole}.` },
        { status: 403 }
      );
    }

    // 6. Verify password using existing password hashing utility
    const isMatch = await comparePassword(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password credentials.' },
        { status: 401 }
      );
    }

    // 7. Create session using existing authentication utility
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // 8. Return authenticated user details
    return NextResponse.json(
      {
        message: 'Login successful.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          track: user.track,
          batch: user.batch,
          status: user.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: 'Server error during login authentication.' },
      { status: 500 }
    );
  }
}
