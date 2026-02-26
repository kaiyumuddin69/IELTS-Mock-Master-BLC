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
        title: 'Listening Part 1',
        instruction: 'Listen to the audio and answer questions 1-40.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '1', type: 'form', question: 'black with thin [___] stripes', correctAnswer: 'Central' },
          { id: '2', type: 'form', question: 'a set of [___] keys', correctAnswer: 'address' },
          { id: '3', type: 'form', question: 'a [___] in a box', correctAnswer: 'pool' },
          { id: '4', type: 'form', question: 'a blue [___]', correctAnswer: 'pool' },
          { id: '5', type: 'form', question: 'Date and time: 2.00-2.30 pm on [___]', correctAnswer: 'pool' },
          { id: '6', type: 'form', question: 'Basic route: caller travelled from the [___] to Highbury', correctAnswer: 'pool' },
          { id: '7', type: 'mcq', question: 'What is the main purpose of the call?', options: ['To report a lost item', 'To book a taxi', 'To complain about a service'], correctAnswer: 'To report a lost item' },
          { id: '8', type: 'mcq', question: 'Where did the caller leave the item?', options: ['On the train', 'In the station cafe', 'On the platform'], correctAnswer: 'On the train' },
          { id: '9', type: 'form', question: 'Caller\'s name: [___]', correctAnswer: 'John Smith' },
          { id: '10', type: 'form', question: 'Phone number: [___]', correctAnswer: '0123456789' },
        ]
      },
      {
        id: 'ls2',
        title: 'Listening Part 2',
        instruction: 'Listen and answer questions 11-20.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '11', type: 'mcq', question: 'The speaker says that the new park will be...', options: ['Larger than the old one', 'In the same location', 'Open 24 hours'], correctAnswer: 'Larger than the old one' },
          { id: '12', type: 'mcq', question: 'What feature will the park include?', options: ['A swimming pool', 'A skate park', 'A library'], correctAnswer: 'A skate park' },
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

