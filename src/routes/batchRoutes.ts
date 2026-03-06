
import { Router } from 'express';
import { getPublicBatches, createBatch } from '../controllers/batchController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Public route for landing page
router.get('/public/batches', getPublicBatches);

// Protected routes for admin
router.post('/', authenticate, createBatch);

export default router;
