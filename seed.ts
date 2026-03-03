import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@ielts.com';
  const adminPassword = 'adminblc123';

  console.log('Seeding database...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'System Admin',
      role: 'admin',
    },
  });

  // Create some sample tests
  const test1 = await prisma.test.upsert({
    where: { id: 'sample-reading-1' },
    update: {},
    create: {
      id: 'sample-reading-1',
      title: 'Academic Reading Practice 1',
      type: 'reading',
      timeLimit: 60,
      content: { passage: "The history of the internet..." },
      questions: [
        { id: 'q1', type: 'mcq', question: "When was the internet invented?", options: ["1960s", "1970s", "1980s", "1990s"], answer: "1960s" }
      ]
    }
  });

  const test2 = await prisma.test.upsert({
    where: { id: 'sample-writing-1' },
    update: {},
    create: {
      id: 'sample-writing-1',
      title: 'Academic Writing Practice 1',
      type: 'writing',
      timeLimit: 60,
      content: { task1: "Describe the chart...", task2: "Discuss the pros and cons..." },
      questions: []
    }
  });

  // Create some sample batches
  const batch1 = await prisma.batch.upsert({
    where: { id: 'batch-jan-2024' },
    update: {},
    create: {
      id: 'batch-jan-2024',
      name: 'IELTS Success Batch - January 2024',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-15'),
      tests: {
        connect: [{ id: test1.id }, { id: test2.id }]
      }
    }
  });

  const batch2 = await prisma.batch.upsert({
    where: { id: 'batch-feb-2024' },
    update: {},
    create: {
      id: 'batch-feb-2024',
      name: 'IELTS Intensive - February 2024',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-01'),
      tests: {
        connect: [{ id: test1.id }]
      }
    }
  });

  console.log('Sample data seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
