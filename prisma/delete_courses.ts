import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const result = await prisma.course.deleteMany();
  console.log('Deleted courses count:', result.count);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
