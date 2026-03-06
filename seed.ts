
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

  // 2. Create Sample Reading Test
  const readingTest = await prisma.test.upsert({
    where: { id: 'sample-reading-1' },
    update: {},
    create: {
      id: 'sample-reading-1',
      title: 'Academic Reading: The Future of Urban Transport',
      type: 'READING',
      duration: 60,
      content: { 
        passages: [
          { 
            title: "The Evolution of Urban Mobility", 
            text: "Cities around the world are facing unprecedented challenges in managing the movement of people and goods. As urban populations continue to swell, traditional transport systems are reaching their breaking point. The rise of autonomous vehicles, electric micro-mobility, and integrated transit platforms promises to revolutionize how we navigate the urban landscape.\n\nHistorically, cities were designed around the needs of the automobile. Wide boulevards and extensive parking lots dominated urban planning in the mid-20th century. However, this car-centric approach has led to chronic congestion, air pollution, and a decline in public health. Today, planners are shifting their focus towards 'human-centric' design, prioritizing pedestrians, cyclists, and efficient public transit.\n\nOne of the most significant developments is the emergence of Mobility as a Service (MaaS). This concept integrates various forms of transport services into a single mobility service accessible on demand. By using a digital platform, commuters can plan, book, and pay for multiple modes of transport, such as buses, trains, bike-sharing, and ride-hailing, all in one place."
          }
        ] 
      },
    }
  });

  // Questions for Reading
  const readingQuestions = [
    {
      id: 'rq1',
      testId: readingTest.id,
      type: 'MCQ',
      order: 1,
      structure: {
        prompt: "What is the main focus of modern urban planners according to the text?",
        options: ["Expanding parking facilities", "Human-centric design", "Increasing car speed", "Building more boulevards"]
      },
      correctAnswers: "Human-centric design"
    },
    {
      id: 'rq2',
      testId: readingTest.id,
      type: 'TRUE_FALSE',
      order: 2,
      structure: {
        prompt: "Mobility as a Service (MaaS) requires users to pay for each transport mode separately."
      },
      correctAnswers: "FALSE"
    },
    {
      id: 'rq3',
      testId: readingTest.id,
      type: 'FILL_GAPS',
      order: 3,
      structure: {
        prompt: "In the mid-20th century, urban planning was dominated by a ______ approach."
      },
      correctAnswers: "car-centric"
    }
  ];

  for (const q of readingQuestions) {
    await prisma.question.upsert({ where: { id: q.id }, update: {}, create: q });
  }

  // 3. Create Sample Listening Test
  const listeningTest = await prisma.test.upsert({
    where: { id: 'sample-listening-1' },
    update: {},
    create: {
      id: 'sample-listening-1',
      title: 'Listening Practice: Library Orientation',
      type: 'LISTENING',
      duration: 30,
      content: {
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Dummy audio
        instruction: "You will hear a library manager giving an orientation to new students."
      }
    }
  });

  const listeningQuestions = [
    {
      id: 'lq1',
      testId: listeningTest.id,
      type: 'FILL_GAPS',
      order: 1,
      structure: {
        prompt: "The library is open until ______ PM on weekdays."
      },
      correctAnswers: "9"
    },
    {
      id: 'lq2',
      testId: listeningTest.id,
      type: 'MCQ',
      order: 2,
      structure: {
        prompt: "Where is the quiet study area located?",
        options: ["First floor", "Second floor", "Basement", "Attic"]
      },
      correctAnswers: "Second floor"
    }
  ];

  for (const q of listeningQuestions) {
    await prisma.question.upsert({ where: { id: q.id }, update: {}, create: q });
  }

  // 4. Create Writing Test
  await prisma.test.upsert({
    where: { id: 'sample-writing-1' },
    update: {},
    create: {
      id: 'sample-writing-1',
      title: 'Academic Writing Task 2: Technology and Society',
      type: 'WRITING',
      duration: 40,
      content: {
        instruction: "You should spend about 40 minutes on this task. Write at least 250 words.",
        prompt: "Some people believe that technology has made our lives more complex and stressful, while others argue that it has made life easier and more convenient. Discuss both views and give your own opinion."
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
