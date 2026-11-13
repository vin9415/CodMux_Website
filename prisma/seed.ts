import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial Code Mux database...');

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codemux.in' },
    update: {},
    create: {
      name: 'Admin Console Manager',
      email: 'admin@codemux.in',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+91 98000 00001',
      track: 'Full-Stack Web & Cloud Engineering (React, Node & AWS)',
      batch: 'Management',
    },
  });

  // 2. Create Mentors
  const mentorPriya = await prisma.user.upsert({
    where: { email: 'priya.mentor@codemux.in' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'priya.mentor@codemux.in',
      passwordHash: defaultPasswordHash,
      role: 'MENTOR',
      phone: '+91 98765 11001',
      track: 'Full-Stack Web & Cloud Engineering (React, Node & AWS)',
      batch: 'Cohort 2026-A',
    },
  });

  const mentorKunal = await prisma.user.upsert({
    where: { email: 'kunal.mentor@codemux.in' },
    update: {},
    create: {
      name: 'Kunal Deshmukh',
      email: 'kunal.mentor@codemux.in',
      passwordHash: defaultPasswordHash,
      role: 'MENTOR',
      phone: '+91 98765 11002',
      track: 'Data Analytics & Global Business Intelligence (Power BI & Tableau)',
      batch: 'Cohort 2026-A',
    },
  });

  // 3. Create Sample Student
  const studentVinit = await prisma.user.upsert({
    where: { email: 'xyz@gmail.com' },
    update: {},
    create: {
      name: 'Vinit Sharma',
      email: 'xyz@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      phone: '+91 98111 22334',
      track: 'Full-Stack Web & Cloud Engineering (React, Node & AWS)',
      batch: 'Cohort 2026-A',
    },
  });

  // 4. Create Initial Certificate
  await prisma.certificateRecord.upsert({
    where: { certificateSerialNumber: 'CMX-2026-MERN-000001' },
    update: {},
    create: {
      certificateSerialNumber: 'CMX-2026-MERN-000001',
      studentId: studentVinit.id,
      studentNameSnapshot: 'Vinit Sharma',
      courseId: 'webdev',
      courseNameSnapshot: 'Full-Stack Web & Cloud Engineering (React, Node & AWS)',
      instructorNameSnapshot: 'Priya Sharma',
      courseDurationSnapshot: '60 Days',
      enrollmentDate: '2026-02-15',
      completionDate: '2026-04-15',
      issueDate: '2026-04-16',
      certificateStatus: 'ACTIVE',
      issuedBy: 'admin@codemux.in',
    },
  });

  // 5. Create Sample Project
  await prisma.project.create({
    data: {
      track: 'Full-Stack Web & Cloud Engineering (React, Node & AWS)',
      title: 'Full-Stack Production SaaS Dashboard',
      description: 'Architect a secure, production-grade Next.js + PostgreSQL multi-tier application with auth and Stripe.',
      difficulty: 'ADVANCED',
      deliverables: ['GitHub Repository', 'Live Vercel Demo URL', 'Architecture Diagram'],
      evaluationCriteria: ['TypeScript strict typing', 'JWT security & RBAC', 'Prisma relational modeling'],
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Default credentials:');
  console.log('  Admin:   admin@codemux.in / Admin@123456');
  console.log('  Mentor:  priya.mentor@codemux.in / Password@123');
  console.log('  Student: xyz@gmail.com / Password@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

