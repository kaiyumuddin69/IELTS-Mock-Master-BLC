import React from 'react';
import { Input } from './Input';

interface PartProps {
  answers: Record<string, any>;
  onAnswerChange: (id: string, value: any) => void;
}

export default function Part4({ answers, onAnswerChange }: PartProps) {
  return (
    <div className="max-w-[1200px] mx-auto p-8 font-sans text-[#1a1a1a]">
      <div className="bg-[#f2f2f2] p-4 rounded mb-8">
        <h2 className="font-bold mb-1">Part 4</h2>
        <p>Listen and answer questions 31–40.</p>
      </div>

      <div className="mb-12">
        <h3 className="font-bold text-lg mb-1">Questions 31–34</h3>
        <p className="mb-6">
          Choose the correct letter, <strong>A</strong>, <strong>B</strong> or <strong>C</strong>.
        </p>

        <div className="space-y-8">
          <div id="question-q31">
            <p className="mb-4 font-bold">31. What is the speaker's main point about the use of technology in the classroom?</p>
            <div className="space-y-2 ml-4">
              {['A. It is often used in ways that are not effective.', 'B. It is more useful for some subjects than others.', 'C. It should be used to replace traditional teaching methods.'].map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="q31"
                    value={option[0]}
                    checked={answers.q31 === option[0]}
                    onChange={(e) => onAnswerChange('q31', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-[14px] group-hover:text-blue-600 transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div id="question-q32">
            <p className="mb-4 font-bold">32. The speaker mentions a study which found that students who used tablets in class</p>
            <div className="space-y-2 ml-4">
              {['A. performed better in exams than those who did not.', 'B. were more likely to be distracted by other things.', 'C. found it easier to collaborate with their peers.'].map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="q32"
                    value={option[0]}
                    checked={answers.q32 === option[0]}
                    onChange={(e) => onAnswerChange('q32', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-[14px] group-hover:text-blue-600 transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div id="question-q33">
            <p className="mb-4 font-bold">33. According to the speaker, what is the most important factor in the successful use of technology?</p>
            <div className="space-y-2 ml-4">
              {['A. the quality of the hardware and software', 'B. the level of training provided to teachers', 'C. the way in which the technology is integrated into the curriculum'].map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="q33"
                    value={option[0]}
                    checked={answers.q33 === option[0]}
                    onChange={(e) => onAnswerChange('q33', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-[14px] group-hover:text-blue-600 transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div id="question-q34">
            <p className="mb-4 font-bold">34. What does the speaker suggest about the future of technology in education?</p>
            <div className="space-y-2 ml-4">
              {['A. It will become increasingly difficult for schools to afford.', 'B. It will lead to a more personalised learning experience for students.', 'C. It will eventually make traditional schools obsolete.'].map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="q34"
                    value={option[0]}
                    checked={answers.q34 === option[0]}
                    onChange={(e) => onAnswerChange('q34', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-[14px] group-hover:text-blue-600 transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="font-bold text-lg mb-1">Questions 35–37</h3>
        <p className="mb-6">
          Complete the table below. Write <strong>ONE WORD ONLY</strong> for each answer.
        </p>

        <div className="overflow-hidden border border-slate-300 rounded-lg max-w-3xl">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-300">
                <th className="p-4 text-left border-r border-slate-300 font-bold text-slate-700">Type of technology</th>
                <th className="p-4 text-left border-r border-slate-300 font-bold text-slate-700">Advantages</th>
                <th className="p-4 text-left font-bold text-slate-700">Disadvantages</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="p-4 border-r border-slate-300">Interactive whiteboards</td>
                <td className="p-4 border-r border-slate-300">Can make lessons more engaging</td>
                <td className="p-4">
                  <div className="flex items-center gap-2" id="question-q35">
                    <span>Often used for simple </span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q35 || ''}
                        onChange={(e) => onAnswerChange('q35', e.target.value)}
                        className="w-32 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">35</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-4 border-r border-slate-300">Virtual Learning Environments</td>
                <td className="p-4 border-r border-slate-300">
                  <div className="flex items-center gap-2" id="question-q36">
                    <span>Allow for better </span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q36 || ''}
                        onChange={(e) => onAnswerChange('q36', e.target.value)}
                        className="w-32 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">36</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">Can be difficult to set up and maintain</td>
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-300">Educational apps</td>
                <td className="p-4 border-r border-slate-300">Can provide instant feedback</td>
                <td className="p-4">
                  <div className="flex items-center gap-2" id="question-q37">
                    <span>May not always be </span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q37 || ''}
                        onChange={(e) => onAnswerChange('q37', e.target.value)}
                        className="w-32 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">37</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-1">Questions 38–40</h3>
        <p className="mb-6">
          Complete the notes below. Write <strong>NO MORE THAN TWO WORDS</strong> for each answer.
        </p>

        <div className="bg-slate-50 p-8 border border-slate-200 rounded-lg max-w-3xl">
          <h4 className="font-bold text-lg mb-6 border-b border-slate-300 pb-2">Teacher Training</h4>
          <ul className="space-y-6">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <div className="flex flex-wrap items-center gap-2">
                Teachers need to be shown how to use technology to support
                <div className="relative" id="question-q38">
                  <Input
                    type="text"
                    value={answers.q38 || ''}
                    onChange={(e) => onAnswerChange('q38', e.target.value)}
                    className="w-40 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                  />
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">38</span>
                </div>
                learning.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <div className="flex flex-wrap items-center gap-2">
                Training should be an ongoing process, not a
                <div className="relative" id="question-q39">
                  <Input
                    type="text"
                    value={answers.q39 || ''}
                    onChange={(e) => onAnswerChange('q39', e.target.value)}
                    className="w-40 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                  />
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">39</span>
                </div>
                event.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <div className="flex flex-wrap items-center gap-2">
                It is also important for teachers to share
                <div className="relative" id="question-q40">
                  <Input
                    type="text"
                    value={answers.q40 || ''}
                    onChange={(e) => onAnswerChange('q40', e.target.value)}
                    className="w-40 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                  />
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">40</span>
                </div>
                with each other.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
