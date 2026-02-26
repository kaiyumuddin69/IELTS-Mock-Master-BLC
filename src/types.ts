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
        instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '1', type: 'form', question: 'Item lost: [___]', correctAnswer: 'bag' },
          { id: '2', type: 'form', question: 'Color: black with thin [___] stripes', correctAnswer: 'Central' },
          { id: '3', type: 'form', question: 'Contents: a set of [___] keys', correctAnswer: 'address' },
          { id: '4', type: 'form', question: 'Journey details: Date: [___]', correctAnswer: '15th May' },
          { id: '5', type: 'form', question: 'Time: [___] pm', correctAnswer: '2.30' },
          { id: '6', type: 'form', question: 'Route: from the [___] to Highbury', correctAnswer: 'station' },
          { id: '7', type: 'form', question: 'Caller\'s name: [___]', correctAnswer: 'John Smith' },
          { id: '8', type: 'form', question: 'Phone number: [___]', correctAnswer: '0123456789' },
          { id: '9', type: 'form', question: 'Address: [___] Road', correctAnswer: 'Green' },
          { id: '10', type: 'form', question: 'Postcode: [___]', correctAnswer: 'NW1 4BT' },
        ]
      },
      {
        id: 'ls2',
        title: 'Listening Part 2',
        instruction: 'Choose the correct letter, A, B or C.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '11', type: 'mcq', question: 'The new community center will be located...', options: ['Near the library', 'In the city park', 'Opposite the station'], correctAnswer: 'In the city park' },
          { id: '12', type: 'mcq', question: 'What is the main feature of the new building?', options: ['A large auditorium', 'A rooftop garden', 'A modern gym'], correctAnswer: 'A rooftop garden' },
          { id: '13', type: 'mcq', question: 'The project was funded by...', options: ['The local council', 'A private donation', 'A national lottery grant'], correctAnswer: 'A private donation' },
          { id: '14', type: 'mcq', question: 'When is the expected completion date?', options: ['August', 'October', 'December'], correctAnswer: 'October' },
          { id: '15', type: 'mcq', question: 'What will happen to the old center?', options: ['It will be demolished', 'It will become a museum', 'It will be used for storage'], correctAnswer: 'It will become a museum' },
          { id: '16', type: 'mcq', question: 'Visitors are encouraged to...', options: ['Cycle to the center', 'Use the new car park', 'Take the shuttle bus'], correctAnswer: 'Cycle to the center' },
          { id: '17', type: 'mcq', question: 'The cafe will serve...', options: ['Only vegetarian food', 'Locally sourced produce', 'International cuisine'], correctAnswer: 'Locally sourced produce' },
          { id: '18', type: 'mcq', question: 'Membership for the gym is...', options: ['Free for students', 'Discounted for seniors', 'Available on a daily basis'], correctAnswer: 'Discounted for seniors' },
          { id: '19', type: 'mcq', question: 'The first event will be...', options: ['A photography exhibition', 'A live music concert', 'A community meeting'], correctAnswer: 'A photography exhibition' },
          { id: '20', type: 'mcq', question: 'How can people volunteer?', options: ['By calling the office', 'By visiting the website', 'By signing up at the desk'], correctAnswer: 'By visiting the website' },
        ]
      },
      {
        id: 'ls3',
        title: 'Listening Part 3',
        instruction: 'What does each student say about the following aspects of their research project?',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '21', type: 'matching', question: 'Data collection methods', options: ['Needs more detail', 'Well organized', 'Too time consuming'], correctAnswer: 'Needs more detail' },
          { id: '22', type: 'matching', question: 'Literature review', options: ['Needs more detail', 'Well organized', 'Too time consuming'], correctAnswer: 'Well organized' },
          { id: '23', type: 'matching', question: 'Statistical analysis', options: ['Needs more detail', 'Well organized', 'Too time consuming'], correctAnswer: 'Too time consuming' },
          { id: '24', type: 'matching', question: 'Conclusion section', options: ['Needs more detail', 'Well organized', 'Too time consuming'], correctAnswer: 'Needs more detail' },
          { id: '25', type: 'matching', question: 'Overall presentation', options: ['Needs more detail', 'Well organized', 'Too time consuming'], correctAnswer: 'Well organized' },
          { id: '26', type: 'mcq', question: 'What do they agree to do next?', options: ['Consult their tutor', 'Redesign the survey', 'Start the final draft'], correctAnswer: 'Consult their tutor' },
          { id: '27', type: 'mcq', question: 'The main problem with the survey was...', options: ['The wording of questions', 'The small sample size', 'The lack of responses'], correctAnswer: 'The wording of questions' },
          { id: '28', type: 'mcq', question: 'They decide to focus their research on...', options: ['Urban areas only', 'Rural communities', 'Both urban and rural'], correctAnswer: 'Urban areas only' },
          { id: '29', type: 'mcq', question: 'The deadline for the project is...', options: ['Next Friday', 'In two weeks', 'End of the month'], correctAnswer: 'In two weeks' },
          { id: '30', type: 'mcq', question: 'They will meet again on...', options: ['Monday morning', 'Tuesday afternoon', 'Wednesday evening'], correctAnswer: 'Tuesday afternoon' },
        ]
      },
      {
        id: 'ls4',
        title: 'Listening Part 4',
        instruction: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
        content: 'https://ia601708.us.archive.org/10/items/mix-27m-28s-audio-joiner.com-copy-copy-copy-copy-copy-copy-copy/mix_27m28s%20%28audio-joiner.com%29%20-%20CopyCopyCopyCopyCopyCopyCopy.mp3',
        questions: [
          { id: '31', type: 'form', question: 'Urbanization has led to a decrease in [___] for many species.', correctAnswer: 'habitat' },
          { id: '32', type: 'form', question: 'Animals are forced to adapt to [___] environments.', correctAnswer: 'human' },
          { id: '33', type: 'form', question: 'The presence of [___] can disrupt natural behaviors.', correctAnswer: 'noise' },
          { id: '34', type: 'form', question: 'Some species have successfully moved into [___] areas.', correctAnswer: 'residential' },
          { id: '35', type: 'form', question: 'The availability of [___] is a major factor in survival.', correctAnswer: 'food' },
          { id: '36', type: 'form', question: 'Light pollution affects the [___] patterns of birds.', correctAnswer: 'migration' },
          { id: '37', type: 'form', question: 'Urban wildlife can help control [___] populations.', correctAnswer: 'pest' },
          { id: '38', type: 'form', question: 'Public [___] is essential for conservation efforts.', correctAnswer: 'awareness' },
          { id: '39', type: 'form', question: 'Creating green [___] can provide safe passages.', correctAnswer: 'corridors' },
          { id: '40', type: 'form', question: 'Future research should focus on [___] term impacts.', correctAnswer: 'long' },
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

