
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';

export async function GET(_req: NextRequest) {
  try {
    // Only authenticated administrators can view the user directory.
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator access required.' },
        { status: 403 }
      );
    }

    // Fetch real users from PostgreSQL.
    // Never return passwordHash or other authentication secrets.
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        track: true,
        batch: true,
        status: true,
        createdAt: true,
      },
    });

    // Match the existing frontend AuthUser format.
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      phone: user.phone,
      track: user.track,
      batch: user.batch,
      status: user.status.toLowerCase(),
      joinedAt: user.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({
      users: formattedUsers,
      total: formattedUsers.length,
    });
  } catch (error) {
    console.error('Admin users API error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch users.' },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    // 1. Verify that the requester is an authenticated admin
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator access required.' },
        { status: 403 }
      );
    }

    // 2. Read form data
    const body = await req.json();

    const {
      name,
      email,
      password,
      role,
      phone,
      track,
      batch,
    } = body ?? {};

    // 3. Validate required fields
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: 'Name, email and password are required.' },
        { status: 400 }
      );
    }

    // 4. Only allow Student and Mentor accounts
    if (role !== 'STUDENT' && role !== 'MENTOR') {
      return NextResponse.json(
        { error: 'Only Student and Mentor accounts can be created.' },
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 5. Check whether email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // 6. Hash password before saving
    const passwordHash = await hashPassword(password);

    // 7. Create account in PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role,
        phone:
          typeof phone === 'string' && phone.trim()
            ? phone.trim()
            : null,
        track:
          typeof track === 'string' && track.trim()
            ? track.trim()
            : null,
        batch:
          role === 'STUDENT' &&
          typeof batch === 'string' &&
          batch.trim()
            ? batch.trim()
            : null,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        track: true,
        batch: true,
        status: true,
        createdAt: true,
      },
    });

    // 8. Return account details (never return password/hash)
    return NextResponse.json(
      {
       message: `${role === 'STUDENT' ? 'Student' : 'Mentor'} account created successfully.`,
        user: {
          ...newUser,
          role: newUser.role.toLowerCase(),
          status: newUser.status.toLowerCase(),
          joinedAt: newUser.createdAt.toISOString().split('T')[0],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin create user error:', error);

    return NextResponse.json(
      { error: 'Failed to create user account.' },
      { status: 500 }
    );
  }
}
