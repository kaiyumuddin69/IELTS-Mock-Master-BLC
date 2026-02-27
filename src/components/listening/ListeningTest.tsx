import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Part1 from './Part1';
import Part2 from './Part2';
import Part3 from './Part3';
import Part4 from './Part4';

interface ListeningTestProps {
  currentSectionIndex: number;
  answers: Record<string, any>;
  onAnswerChange: (id: string, value: any) => void;
}

export default function ListeningTest({ currentSectionIndex, answers, onAnswerChange }: ListeningTestProps) {
  const renderPart = () => {
    switch (currentSectionIndex) {
      case 0:
        return <Part1 answers={answers} onAnswerChange={onAnswerChange} />;
      case 1:
        return <Part2 answers={answers} onAnswerChange={onAnswerChange} />;
      case 2:
        return <Part3 answers={answers} onAnswerChange={onAnswerChange} />;
      case 3:
        return <Part4 answers={answers} onAnswerChange={onAnswerChange} />;
      default:
        return <Part1 answers={answers} onAnswerChange={onAnswerChange} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 overflow-y-auto ielts-scrollbar bg-white">
        {renderPart()}
      </div>
    </DndProvider>
  );
}
