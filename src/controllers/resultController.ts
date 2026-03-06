
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getMyResults = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;
    const results = await prisma.result.findMany({
      where: { studentId },
      include: { test: { select: { title: true, type: true } } },
      orderBy: { submittedAt: 'desc' }
    });
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getResultById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studentId = (req as any).user.id;
    const result = await prisma.result.findFirst({
      where: { id, studentId },
      include: { test: { include: { questions: true } } }
    });
    
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
