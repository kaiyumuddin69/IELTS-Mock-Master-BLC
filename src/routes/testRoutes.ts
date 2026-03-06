
import { Router } from 'express';
import { getTests, getTestById, submitTest } from '../controllers/testController';
import { getMyResults, getResultById } from '../controllers/resultController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticate, getTests);
router.get('/results/me', authenticate, getMyResults);
router.get('/results/:id', authenticate, getResultById);
router.get('/:id', authenticate, getTestById);
router.post('/submit', authenticate, submitTest);

export default router;
