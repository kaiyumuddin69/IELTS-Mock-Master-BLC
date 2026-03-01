import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { User, Batch, Test, Result } from './models';

dotenv.config();

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
    const user = new User({ name, email, password: hashedPassword, batchId });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('batchId');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role, batchId: user.batchId?._id }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, batchId: user.batchId } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Tests (Batch-Filtered)
app.get('/api/tests', authenticate, async (req: any, res) => {
  try {
    if (req.user.role === 'admin') {
      const tests = await Test.find();
      return res.json(tests);
    }
    const batch = await Batch.findById(req.user.batchId).populate('assignedTests');
    res.json(batch?.assignedTests || []);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Results
app.post('/api/results', authenticate, async (req: any, res) => {
  try {
    const result = new Result({ ...req.body, userId: req.user.id });
    await result.save();
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/results/me', authenticate, async (req: any, res) => {
  try {
    const results = await Result.find({ userId: req.user.id }).populate('testId').sort({ timestamp: -1 });
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Manage Tests
app.post('/api/tests', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const test = new Test(req.body);
    await test.save();
    res.status(201).json(test);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/tests/:id', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Manage Batches
app.get('/api/batches', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const batches = await Batch.find().populate('assignedTests');
    res.json(batches);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/batches', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/api/batches/:id', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(batch);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/admin/submissions', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const results = await Result.find().populate('userId').populate('testId').sort({ timestamp: -1 });
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/admin/submissions/:id', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/admin/clear-all', authenticate, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    await Test.deleteMany({});
    await Result.deleteMany({});
    await Batch.deleteMany({});
    res.json({ message: 'All data cleared' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// --- Vite Integration ---

async function startServer() {
  console.log('Starting server...');
  console.log('Environment variables present:', Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('PASSWORD')));
  try {
    if (process.env.MONGODB_URI) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // 5s timeout
      });
      console.log('Connected to MongoDB');
    } else {
      console.warn('MONGODB_URI not found. Running without DB.');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
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
