
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
    const user = (req as any).user;
    
    const result = await prisma.result.findFirst({
      where: user.role === 'ADMIN' ? { id } : { id, studentId: user.id },
      include: { 
        test: { include: { questions: true } },
        student: { select: { name: true, email: true } }
      }
    });
    
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminSubmissions = async (req: Request, res: Response) => {
  try {
    if ((req as any).user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const submissions = await prisma.result.findMany({
      include: { 
        test: { select: { title: true, type: true } },
        student: { select: { name: true, email: true } }
      },
      orderBy: { submittedAt: 'desc' }
    });
    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubmission = async (req: Request, res: Response) => {
  try {
    if ((req as any).user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { id } = req.params;
    const { score, bandScore, feedback, status } = req.body;
    
    const updated = await prisma.result.update({
      where: { id },
      data: {
        score: score !== undefined ? parseFloat(score) : undefined,
        bandScore: bandScore !== undefined ? parseFloat(bandScore) : undefined,
        feedback,
        status
      }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
