import { Type } from "@google/genai";

export type QuestionType = 
  | 'mcq' 
  | 'form' 
  | 'note' 
  | 'matching' 
  | 'map' 
  | 'sentence' 
  | 'tfng' 
  | 'heading' 
  | 'summary' 
  | 'table';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  placeholder?: string;
  group?: string; // For grouping questions like 1-5
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

export const MOCK_TEST_DATA: Record<string, TestModule> = {
  listening: {
    id: 'l1',
    title: 'Listening Practice Test 1',
    type: 'listening',
    duration: 30,
    sections: [
      {
        id: 'ls1',
        title: 'Part 1',
        instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '1', type: 'form', question: 'Company name: [___] Hotel Chains', correctAnswer: 'Central' },
          { id: '2', type: 'form', question: 'Letters of the [___] should be bigger.', correctAnswer: 'address' },
          { id: '3', type: 'form', question: 'The information of the [___] should be removed.', correctAnswer: 'pool' },
        ]
      }
    ]
  },
  reading: {
    id: 'r1',
    title: 'Reading Practice Test 1',
    type: 'reading',
    duration: 60,
    sections: [
      {
        id: 'rs1',
        title: 'Part 1',
        instruction: 'Read the text and answer questions 1-7.',
        content: `
          <h2 class="text-2xl font-bold mb-4">The Green Revolution in China</h2>
          <p class="mb-4">A couple of weeks ago, China's highest government body published their conclusions from the second research session on continental climate change over a period of twelve months...</p>
          <p class="mb-4">It should be highlighted that the Chinese central government also had a similar meeting and that China is a rapidly industrializing country with new coal-fueled power plants opening every week...</p>
        `,
        questions: [
          { id: '1', type: 'tfng', question: 'The Central Government of China concluded the second research scheme of climate change is less than one year.', correctAnswer: 'YES' },
          { id: '2', type: 'tfng', question: 'The main topic of the G8 Meeting in Japan was to discuss greenhouse gas emissions.', correctAnswer: 'NO' },
        ]
      }
    ]
  },
  writing: {
    id: 'w1',
    title: 'Writing Practice Test 1',
    type: 'writing',
    duration: 60,
    sections: [
      {
        id: 'ws1',
        title: 'Task 1',
        instruction: 'You should spend about 20 minutes on this task. Write at least 150 words.',
        content: 'The table below shows the number of cars made in Argentina, Australia and Thailand from 2003 to 2009. Summarise the information by selecting and reporting the main features.',
        questions: []
      },
      {
        id: 'ws2',
        title: 'Task 2',
        instruction: 'You should spend about 40 minutes on this task. Write at least 250 words.',
        content: 'The animal species are becoming extinct due to human activities on land and in sea. What are the reasons and solutions?',
        questions: []
      }
    ]
  },
  speaking: {
    id: 's1',
    title: 'Speaking Practice Test 1',
    type: 'speaking',
    duration: 15,
    sections: [
      {
        id: 'ss1',
        title: 'Part 1',
        instruction: 'Introduction and Interview',
        content: 'Let\'s talk about your hometown. Where is your hometown? What do you like about it?',
        questions: []
      }
    ]
  }
};

