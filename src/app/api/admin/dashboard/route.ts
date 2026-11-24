
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    // Verify that the requester is an authenticated administrator.
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Administrator access required.' },
        { status: 403 }
      );
    }

    // Calculate the current week using India Standard Time.
    const now = new Date();
    const IST_OFFSET = 330 * 60 * 1000;

    const indiaNow = new Date(now.getTime() + IST_OFFSET);

    const day = indiaNow.getUTCDay();
    const daysSinceMonday = (day + 6) % 7;

    const monday = new Date(
      Date.UTC(
        indiaNow.getUTCFullYear(),
        indiaNow.getUTCMonth(),
        indiaNow.getUTCDate() - daysSinceMonday
      ) - IST_OFFSET
    );

    const nextMonday = new Date(
      monday.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    // Fetch all four statistics directly from PostgreSQL.
    const [
      totalStudents,
      totalMentors,
      upcomingClasses,
      pendingSubmissions,
    ] = await Promise.all([
      // Active student accounts
      prisma.user.count({
        where: {
          role: 'STUDENT',
          status: 'ACTIVE',
        },
      }),

      // Registered mentors
      prisma.user.count({
        where: {
          role: 'MENTOR',
        },
      }),

      // Upcoming classes scheduled during this week
      prisma.classSchedule.count({
        where: {
          status: 'UPCOMING',
          date: {
            gte: monday,
            lt: nextMonday,
          },
        },
      }),

      // Submissions awaiting grading
      prisma.studentProjectSubmission.count({
        where: {
          status: 'PENDING_REVIEW',
        },
      }),
    ]);

    return NextResponse.json({
      totalStudents,
      totalMentors,
      upcomingClasses,
      pendingSubmissions,
    });
  } catch (error) {
    console.error('Admin dashboard statistics error:', error);

    return NextResponse.json(
      { error: 'Failed to load dashboard statistics.' },
      { status: 500 }
    );
  }
}
