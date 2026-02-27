import React from 'react';
import { Input } from './Input';

interface PartProps {
  answers: Record<string, any>;
  onAnswerChange: (id: string, value: any) => void;
}

export default function Part1({ answers, onAnswerChange }: PartProps) {
  return (
    <div className="max-w-[1200px] mx-auto p-8 font-sans text-[#1a1a1a]">
      <div className="bg-[#f2f2f2] p-4 rounded mb-8">
        <h2 className="font-bold mb-1">Part 1</h2>
        <p>Listen and answer questions 1–10.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-1">Questions 1–10</h3>
          <p className="mb-4">
            Complete the notes. Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
          </p>
          <h4 className="font-bold text-lg mb-6">Phone call about second-hand furniture</h4>
        </div>

        <div className="space-y-8 ml-2">
          <div className="space-y-6">
            <h5 className="font-bold">Items:</h5>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-24 font-bold">Dining table:</span>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2" id="question-q1">
                    <span className="text-gray-400">-</span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q1 || ''}
                        onChange={(e) => onAnswerChange('q1', e.target.value)}
                        className="w-24 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">1</span>
                    </div>
                    <span>shape</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">-</span>
                    <span>medium size</span>
                  </div>
                  <div className="flex items-center gap-2" id="question-q2">
                    <span className="text-gray-400">-</span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q2 || ''}
                        onChange={(e) => onAnswerChange('q2', e.target.value)}
                        className="w-24 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">2</span>
                    </div>
                    <span>old</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">-</span>
                    <span>price: £25.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-24 font-bold">Dining chairs:</span>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2" id="question-q3">
                    <span className="text-gray-400">- set of</span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q3 || ''}
                        onChange={(e) => onAnswerChange('q3', e.target.value)}
                        className="w-24 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">3</span>
                    </div>
                    <span>chairs</span>
                  </div>
                  <div className="flex items-center gap-2" id="question-q4">
                    <span className="text-gray-400">- seats covered in</span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q4 || ''}
                        onChange={(e) => onAnswerChange('q4', e.target.value)}
                        className="w-24 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">4</span>
                    </div>
                    <span>material</span>
                  </div>
                  <div className="flex items-center gap-2" id="question-q5">
                    <span className="text-gray-400">- in</span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q5 || ''}
                        onChange={(e) => onAnswerChange('q5', e.target.value)}
                        className="w-24 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">5</span>
                    </div>
                    <span>condition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">- price: £20.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-24 font-bold">Desk:</span>
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">- length: 1 metre 20</span>
                  </div>
                  <div className="flex items-center gap-2" id="question-q6">
                    <span className="text-gray-400">- 3 drawers. Top drawer has a</span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q6 || ''}
                        onChange={(e) => onAnswerChange('q6', e.target.value)}
                        className="w-24 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">6</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" id="question-q7">
                    <span className="text-gray-400">- price: £</span>
                    <div className="relative">
                      <Input
                        type="text"
                        value={answers.q7 || ''}
                        onChange={(e) => onAnswerChange('q7', e.target.value)}
                        className="w-24 h-8 border-slate-400 focus:border-blue-500 focus:ring-0 rounded px-2 pl-6 font-bold"
                      />
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
