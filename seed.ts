
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@ielts.com';
  const adminPassword = 'adminblc123';

  console.log('Seeding database...');

  // 1. Create Admin
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'System Admin',
      role: 'ADMIN',
    },
  });

  // 2. Create Sample Test
  const test = await prisma.test.upsert({
    where: { id: 'sample-reading-1' },
    update: {},
    create: {
      id: 'sample-reading-1',
      title: 'Academic Reading Practice 1',
      type: 'READING',
      duration: 60,
      content: { 
        passages: [
          { title: "The History of the Internet", text: "The internet began in the 1960s as a way for government researchers to share information..." }
        ] 
      },
    }
  });

  // 3. Create Sample Questions
  await prisma.question.upsert({
    where: { id: 'q1' },
    update: {},
    create: {
      id: 'q1',
      testId: test.id,
      type: 'MCQ',
      order: 1,
      structure: {
        prompt: "When did the internet begin?",
        options: ["1950s", "1960s", "1970s", "1980s"]
      },
      correctAnswers: "1960s"
    }
  });

  await prisma.question.upsert({
    where: { id: 'q2' },
    update: {},
    create: {
      id: 'q2',
      testId: test.id,
      type: 'FILL_GAPS',
      order: 2,
      structure: {
        prompt: "The internet was created for ______ researchers."
      },
      correctAnswers: "government"
    }
  });

  // 4. Create Writing Test
  await prisma.test.upsert({
    where: { id: 'sample-writing-1' },
    update: {},
    create: {
      id: 'sample-writing-1',
      title: 'General Writing Task 1',
      type: 'WRITING',
      duration: 60,
      content: {
        instruction: "You should spend about 20 minutes on this task. Write at least 150 words.",
        prompt: "You recently stayed at a hotel and were unhappy with the service. Write a letter to the manager to complain."
      }
    }
  });

  // 5. Create Sample Batches
  await prisma.batch.upsert({
    where: { id: 'batch-1' },
    update: {},
    create: {
      id: 'batch-1',
      name: 'Academic Mastery - April 2026',
      description: 'Intensive academic preparation for high band scores.',
      startDate: new Date('2026-04-01'),
      type: 'ACADEMIC'
    }
  });

  await prisma.batch.upsert({
    where: { id: 'batch-2' },
    update: {},
    create: {
      id: 'batch-2',
      name: 'General Training - May 2026',
      description: 'Comprehensive general training for immigration and work.',
      startDate: new Date('2026-05-15'),
      type: 'GENERAL'
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
