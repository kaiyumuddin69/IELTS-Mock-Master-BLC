
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getPublicBatches = async (req: Request, res: Response) => {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { startDate: 'asc' }
    });
    res.json(batches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBatch = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, type } = req.body;
    const batch = await prisma.batch.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        type
      }
    });
    res.status(201).json(batch);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
