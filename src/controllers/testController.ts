
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { QuestionEngine } from '../services/questionEngine';

export const getTests = async (req: Request, res: Response) => {
  try {
    const tests = await prisma.test.findMany({
      include: { _count: { select: { questions: true } } }
    });
    res.json(tests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const test = await prisma.test.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: 'asc' } } }
    });
    
    if (!test) return res.status(404).json({ message: 'Test not found' });
    
    // Remove correct answers if student is taking the test
    if ((req as any).user?.role !== 'ADMIN') {
      test.questions = test.questions.map((q: any) => {
        const { correctAnswers, ...rest } = q;
        return rest as any;
      });
    }
    
    res.json(test);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitTest = async (req: Request, res: Response) => {
  try {
    const { testId, answers } = req.body;
    const studentId = (req as any).user.id;

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { questions: true }
    });

    if (!test) return res.status(404).json({ message: 'Test not found' });

    const rawScore = QuestionEngine.calculateTotalScore(test.questions, answers);
    const totalQuestions = test.questions.reduce((acc, q) => {
      if (typeof q.correctAnswers === 'object' && q.correctAnswers !== null) {
        return acc + Object.keys(q.correctAnswers as object).length;
      }
      return acc + 1;
    }, 0);

    const bandScore = QuestionEngine.mapToBandScore(rawScore, totalQuestions);

    const result = await prisma.result.create({
      data: {
        testId,
        studentId,
        answers,
        score: rawScore,
        bandScore,
        status: 'COMPLETED'
      }
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
