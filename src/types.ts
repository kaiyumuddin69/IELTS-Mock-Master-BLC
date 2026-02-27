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
        instruction: 'Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: 'q1', type: 'form', question: 'Dining table shape: [___]', correctAnswer: 'round' },
          { id: 'q2', type: 'form', question: 'Age of table: [___] years', correctAnswer: '5' },
          { id: 'q3', type: 'form', question: 'Set of [___] chairs', correctAnswer: '6' },
          { id: 'q4', type: 'form', question: 'Seats covered in [___] material', correctAnswer: 'leather' },
          { id: 'q5', type: 'form', question: 'In [___] condition', correctAnswer: 'excellent' },
          { id: 'q6', type: 'form', question: 'Top drawer has a [___]', correctAnswer: 'lock' },
          { id: 'q7', type: 'form', question: 'Price: £[___]', correctAnswer: '45' },
        ]
      },
      {
        id: 'ls2',
        title: 'Part 2',
        instruction: 'Who is responsible for each area? Choose the correct answer for each person and move it into the gap.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: 'q11', type: 'matching', question: 'Mary Brown', correctAnswer: 'Finance' },
          { id: 'q12', type: 'matching', question: 'John Stevens', correctAnswer: 'Organisation' },
          { id: 'q13', type: 'matching', question: 'Alison Jones', correctAnswer: 'Health' },
          { id: 'q14', type: 'matching', question: 'Tim Smith', correctAnswer: 'Food' },
          { id: 'q15', type: 'matching', question: 'Jenny James', correctAnswer: 'Safety' },
          { id: 'q16', type: 'map', question: 'Map Label 16', correctAnswer: 'Sports complex' },
          { id: 'q17', type: 'map', question: 'Map Label 17', correctAnswer: 'Kitchen' },
          { id: 'q18', type: 'map', question: 'Map Label 18', correctAnswer: 'Staff accommodation' },
          { id: 'q19', type: 'map', question: 'Map Label 19', correctAnswer: 'Cookery room' },
          { id: 'q20', type: 'map', question: 'Map Label 20', correctAnswer: 'Games room' },
        ]
      },
      {
        id: 'ls3',
        title: 'Part 3',
        instruction: 'Which feature do the speakers identify for each of the following categories of fossil?',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: 'q21', type: 'matching', question: 'Impression fossils', correctAnswer: 'They are three-dimensional.' },
          { id: 'q22', type: 'matching', question: 'Cast fossils', correctAnswer: 'They do not contain any organic matter.' },
          { id: 'q23', type: 'matching', question: 'Permineralisation fossils', correctAnswer: 'They provide information about plant cells.' },
          { id: 'q24', type: 'matching', question: 'Compaction fossils', correctAnswer: 'They are found in soft, wet ground.' },
          { id: 'q25', type: 'matching', question: 'Fusain fossils', correctAnswer: 'They can be found far from normal fossil areas.' },
          { id: 'q26', type: 'flow-chart', question: 'The rover is directed to a [___] which has organic material.', correctAnswer: 'site' },
          { id: 'q27', type: 'flow-chart', question: 'It collects a sample from below the surface (in order to avoid the effects of [___]).', correctAnswer: 'radiation' },
          { id: 'q28', type: 'flow-chart', question: 'The sample is subjected to [___].', correctAnswer: 'heat' },
          { id: 'q29', type: 'flow-chart', question: 'A mass spectrometer is used to search for potential proof of life, e.g [___].', correctAnswer: 'microbes' },
          { id: 'q30', type: 'flow-chart', question: 'The [___] are compared with existing data from Earth.', correctAnswer: 'results' },
        ]
      },
      {
        id: 'ls4',
        title: 'Part 4',
        instruction: 'Complete the table and notes below.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: 'q31', type: 'mcq', question: 'Participants in the Learner Persistence study were all drawn from the same', correctAnswer: 'geographical' },
          { id: 'q32', type: 'mcq', question: 'The study showed that when starting their course, older students were most concerned about', correctAnswer: 'home-life' },
          { id: 'q33', type: 'form', question: 'Enjoyment of a [___]', correctAnswer: 'subject' },
          { id: 'q35', type: 'form', question: 'Good [___]', correctAnswer: 'support' },
          { id: 'q36', type: 'form', question: 'Many [___] in daily life', correctAnswer: 'pressures' },
          { id: 'q38', type: 'form', question: 'questionnaires to gauge their level of [___]', correctAnswer: 'motivation' },
          { id: 'q39', type: 'form', question: 'Train selected students to act as [___]', correctAnswer: 'mentors' },
          { id: 'q40', type: 'form', question: 'Outside office hours, offer [___] help.', correctAnswer: 'online' },
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

