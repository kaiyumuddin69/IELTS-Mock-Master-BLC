import { Type } from "@google/genai";

export type QuestionType = 
  | 'mcq' 
  | 'multi-mcq'
  | 'form' 
  | 'note' 
  | 'matching' 
  | 'map' 
  | 'sentence' 
  | 'tfng' 
  | 'heading' 
  | 'summary' 
  | 'table'
  | 'flow-chart';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  placeholder?: string;
  group?: string; // For grouping questions like 1-5
  imageUrl?: string; // For map labelling
  labels?: { id: string; x: number; y: number }[]; // For map/flow-chart positions
}

export interface Section {
  id: string;
  title: string;
  instruction: string;
  content: string; // Passage text or Audio URL
  questions: Question[];
}

export interface TestModule {
  id: string;
  title: string;
  type: 'listening' | 'reading' | 'writing' | 'speaking';
  duration: number; // in minutes
  sections: Section[];
}

export interface WritingTest {
  id: string;
  title: string;
  task1Prompt: string;
  task2Prompt: string;
  duration: number;
  createdAt: any;
  createdBy: string;
}

export interface WritingSubmission {
  id: string;
  testId: string;
  testTitle: string;
  studentId: string;
  studentEmail: string;
  studentName: string;
  task1Answer: string;
  task2Answer: string;
  status: 'pending' | 'marked';
  score?: number;
  feedback?: string;
  submittedAt: any;
  markedAt?: any;
}

export const MOCK_TEST_DATA: Record<string, TestModule> = {};

