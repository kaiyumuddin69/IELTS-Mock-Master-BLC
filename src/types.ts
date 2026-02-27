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

export const MOCK_TEST_DATA: Record<string, TestModule> = {
  listening: {
    id: 'l1',
    title: 'IELTS Listening Practice Test',
    type: 'listening',
    duration: 30,
    sections: [
      {
        id: 'ls1',
        title: 'Part 1',
        instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '1', type: 'form', question: 'Customer Name: [___]', correctAnswer: 'Sarah Brown' },
          { id: '2', type: 'form', question: 'Destination: [___]', correctAnswer: 'Sydney' },
          { id: '3', type: 'form', question: 'Box size: [___] kg', correctAnswer: '20' },
          { id: '4', type: 'form', question: 'Contents: [___] and books', correctAnswer: 'clothes' },
          { id: '5', type: 'form', question: 'Pick-up date: [___] June', correctAnswer: '14th' },
          { id: '6', type: 'form', question: 'Dining table shape: [___]', correctAnswer: 'round' },
          { id: '7', type: 'form', question: 'Age of table: [___] years', correctAnswer: '5' },
          { id: '8', type: 'form', question: 'Chair material: [___]', correctAnswer: 'leather' },
          { id: '9', type: 'form', question: 'Condition: [___]', correctAnswer: 'excellent' },
          { id: '10', type: 'form', question: 'Price: £[___]', correctAnswer: '45' },
        ]
      },
      {
        id: 'ls2',
        title: 'Part 2',
        instruction: 'Answer the questions below.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '11', type: 'multi-mcq', question: 'Which TWO facilities are available in the library?', options: ['Quiet study area', 'Coffee shop', 'Computer lab', 'Music room', 'Art gallery'], correctAnswer: ['Quiet study area', 'Computer lab'] },
          { id: '12', type: 'multi-mcq', question: 'Which TWO items can be borrowed for more than a week?', options: ['New novels', 'Reference books', 'DVDs', 'Magazines', 'Textbooks'], correctAnswer: ['New novels', 'Textbooks'] },
          { 
            id: '13', 
            type: 'map', 
            question: 'Label the map of the town.', 
            imageUrl: 'https://picsum.photos/seed/map/600/400',
            options: ['Library', 'Post Office', 'Bank', 'Museum', 'Park'],
            labels: [
              { id: '16', x: 20, y: 30 },
              { id: '17', x: 50, y: 10 },
              { id: '18', x: 80, y: 40 },
              { id: '19', x: 30, y: 70 },
              { id: '20', x: 70, y: 80 },
            ],
            correctAnswer: ['Library', 'Bank', 'Park', 'Museum', 'Post Office']
          },
        ]
      },
      {
        id: 'ls3',
        title: 'Part 3',
        instruction: 'Answer the questions below.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '21', type: 'mcq', question: 'Judy decided to research...', options: ['Local history', 'Marine biology', 'Urban planning'], correctAnswer: 'Marine biology' },
          { id: '22', type: 'matching', question: 'Match the staff member with their responsibility:', options: ['Finance', 'Food', 'Health', 'Safety'], correctAnswer: 'Health' },
          { id: '23', type: 'matching', question: 'Alison Jones', options: ['Finance', 'Food', 'Health', 'Safety'], correctAnswer: 'Finance' },
          { id: '24', type: 'matching', question: 'Tim Smith', options: ['Finance', 'Food', 'Health', 'Safety'], correctAnswer: 'Food' },
          { id: '25', type: 'matching', question: 'Jenny James', options: ['Finance', 'Food', 'Health', 'Safety'], correctAnswer: 'Safety' },
          { id: '26', type: 'sentence', question: 'Studying with the Open University requires good [___] skills.', correctAnswer: 'organizational' },
          { id: '27', type: 'sentence', question: 'Students must complete [___] assignments per term.', correctAnswer: 'three' },
          { 
            id: '28', 
            type: 'flow-chart', 
            question: 'Procedure for detecting life on another planet', 
            options: ['Contamination', 'Vehicle', 'Heat', 'Results', 'Radiation'],
            labels: [
              { id: '28', x: 50, y: 20 },
              { id: '29', x: 50, y: 50 },
              { id: '30', x: 50, y: 80 },
            ],
            correctAnswer: ['Vehicle', 'Heat', 'Results']
          },
        ]
      },
      {
        id: 'ls4',
        title: 'Part 4',
        instruction: 'Complete the table and notes below.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '31', type: 'table', question: 'Learner Persistence Study: Factor - Support, Importance - [___]', correctAnswer: 'High' },
          { id: '32', type: 'table', question: 'Factor - Motivation, Importance - [___]', correctAnswer: 'Medium' },
          { id: '33', type: 'table', question: 'Factor - Resources, Importance - [___]', correctAnswer: 'Low' },
          { id: '34', type: 'note', question: 'The clothing company talk: Focus on [___] materials.', correctAnswer: 'sustainable' },
          { id: '35', type: 'note', question: 'Company started in [___].', correctAnswer: '2010' },
          { id: '36', type: 'note', question: 'Main market is [___].', correctAnswer: 'Europe' },
          { id: '37', type: 'note', question: 'Future plans include [___] expansion.', correctAnswer: 'global' },
          { id: '38', type: 'form', question: 'Short Answer: What is the main goal? [___]', correctAnswer: 'Quality' },
          { id: '39', type: 'form', question: 'Who is the CEO? [___]', correctAnswer: 'Mark Lee' },
          { id: '40', type: 'form', question: 'Contact email: [___]', correctAnswer: 'info@clothing.com' },
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
        title: 'Reading Part 1',
        instruction: 'Read the passage and answer questions 1-13.',
        content: `
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold">Katherine Mansfield</h2>
          </div>
          <p class="italic text-center mb-6">Katherine Mansfield was a modernist writer of short fiction who was born and brought up in New Zealand.</p>
          <p class="mb-4">Katherine Mansfield was a modernist writer of short fiction who was born and brought up in New Zealand. She became one of New Zealand's best-known writers, using the pen name of Katherine Mansfield. The daughter of a banker, and born into a middle-class family, she was also a first cousin of Countess Elizabeth von Arnim, a distinguished novelist in her time. Mansfield had two older sisters and a younger brother. Her father, Harold Beauchamp, went on to become the chairman of the Bank of New Zealand. In 1893, the Mansfield family moved to Karori, a suburb of Wellington, where Mansfield would spend the happiest years of her childhood; she later used her memories of this time as an inspiration for her Pretute story.</p>
          <p class="mb-4">Her first published stories appeared in the High School Reporter and the Wellington Girls' High School magazine in 1898 and 1899. In 1902, she developed strong feelings for a musician who played the cello, Arnold Trowell, although her feelings were not, for the most part, returned. Mansfield herself was an accomplished cellist, having received lessons from Trowell's father. Mansfield wrote in her journals of felling isolated to some extent in New Zealand, and, in general terms of her interest in the Maori people (New Zealand's native people), who are often portrayed in a sympathetic light in her later stories, such as How Pearl Button Was Kidnapped. She moved to London in 1903, where she attended Queen's College, along with her two sisters. Mansfield recommended playing the cello, an occupation that she believed, during her tome at Queen's, she would take up professionally. She also began contributing to the college newspaper, with such a dedication to it that she eventually became its editor.</p>
        `,
        questions: [
          { id: '1', type: 'tfng', question: 'The name Katherine Mansfield, that appears on the writer\'s book, was exactly the same as her origin name.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'FALSE' },
          { id: '2', type: 'tfng', question: 'Mansfield won a prize for a story she wrote for Maori people for the High School Reporter.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'FALSE' },
          { id: '3', type: 'tfng', question: 'How Pearl Button Was Kidnapped portrayed Maori people in a favorable way.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'TRUE' },
          { id: '4', type: 'tfng', question: 'Mansfield moved to London to study music.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'NOT GIVEN' },
          { id: '5', type: 'tfng', question: 'Mansfield became the editor of the college newspaper.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'TRUE' },
        ]
      },
      {
        id: 'rs2',
        title: 'Reading Part 2',
        instruction: 'Read the passage and answer questions 14-26.',
        content: `
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold">The History of Glass</h2>
          </div>
          <p class="mb-4">Glass has been used for centuries... (placeholder text)</p>
        `,
        questions: [
          { id: '14', type: 'mcq', question: 'When was glass first discovered?', options: ['3000 BC', '1000 BC', '500 AD'], correctAnswer: '3000 BC' },
          { id: '15', type: 'matching', question: 'Match the period with the glass type: Ancient Egypt', options: ['Core-formed glass', 'Blown glass', 'Stained glass'], correctAnswer: 'Core-formed glass' },
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

