import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('DATABASE_URL is not defined in environment variables');
      process.exit(1);
    }

    console.log('Connecting to Database for seeding...');
    await prisma.$connect();
    console.log('Connected to Database');

    const adminEmail = 'admin@ielts.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      },
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@ielts.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
