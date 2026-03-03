import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import prisma from './src/lib/prisma';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'ielts-super-secret-key';

// --- Middleware ---

app.use(cors());
app.use(express.json());

const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// --- API Routes ---

// Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, batchId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        batchId: batchId || null,
      },
    });
    res.status(201).json({ message: 'User registered' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { batch: true },
    });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, batchId: user.batchId }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, batch: user.batch } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tests (Batch-Filtered)
app.get('/api/tests', authenticate, async (req: any, res) => {
  try {
    if (req.user.role === 'admin') {
      const tests = await prisma.test.findMany();
      return res.json(tests);
    }
    
    if (!req.user.batchId) {
      return res.json([]);
    }

    const batch = await prisma.batch.findUnique({
      where: { id: req.user.batchId },
      include: { tests: true },
    });
    
    res.json(batch?.tests || []);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Results
app.post('/api/results', authenticate, async (req: any, res) => {
  try {
    const result = await prisma.result.create({
      data: {
        ...req.body,
        studentId: req.user.id,
      },
    });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/results/me', authenticate, async (req: any, res) => {
  try {
    const results = await prisma.result.findMany({
      where: { studentId: req.user.id },
      include: { test: true },
      orderBy: { submittedAt: 'desc' },
    });
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Manage Tests
app.post('/api/tests', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const test = await prisma.test.create({
      data: req.body,
    });
    res.status(201).json(test);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/tests/:id', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    await prisma.test.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Test deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Public: Get Batches for Landing Page
app.get('/api/public/batches', async (req, res) => {
  try {
    const batches = await prisma.batch.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
      },
      orderBy: { startDate: 'asc' },
    });
    res.json(batches);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Manage Batches
app.get('/api/batches', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const batches = await prisma.batch.findMany({
      include: { tests: true },
    });
    res.json(batches);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/batches', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const { name, assignedTestIds, endDate } = req.body;
    const batch = await prisma.batch.create({
      data: {
        name,
        endDate: endDate ? new Date(endDate) : null,
        tests: {
          connect: assignedTestIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: { tests: true },
    });
    res.status(201).json(batch);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/api/batches/:id', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const { name, assignedTestIds, endDate } = req.body;
    const batch = await prisma.batch.update({
      where: { id: req.params.id },
      data: {
        name,
        endDate: endDate ? new Date(endDate) : null,
        tests: {
          set: assignedTestIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: { tests: true },
    });
    res.json(batch);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/admin/submissions', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const results = await prisma.result.findMany({
      include: { student: true, test: true },
      orderBy: { submittedAt: 'desc' },
    });
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/admin/submissions/:id', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const result = await prisma.result.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/admin/clear-all', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    await prisma.result.deleteMany({});
    await prisma.test.deleteMany({});
    await prisma.batch.deleteMany({});
    res.json({ message: 'All data cleared' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// --- Vite Integration ---

async function startServer() {
  console.log('Starting server...');
  
  const dbUrl = process.env.DATABASE_URL || '';
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`DATABASE_URL: ${maskedUrl}`);

  try {
    await prisma.$connect();
    console.log('✅ Database Connected Successfully');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    // In production, we might want to exit, but in dev we might want to see the error
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing Vite middleware...');
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware initialized');
    } catch (err) {
      console.error('Vite initialization error:', err);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
