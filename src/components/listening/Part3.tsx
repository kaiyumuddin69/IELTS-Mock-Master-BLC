import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Keyboard } from 'lucide-react';
import { cn } from './utils';

const ItemTypes = {
  FEATURE: 'feature',
  FLOWCHART_ANSWER: 'flowchart_answer',
};

interface DraggableItemProps {
  id: string;
  text: string;
  type: string;
}

function DraggableItem({ id, text, type }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={cn(
        "px-2 py-1 border border-gray-300 bg-white rounded cursor-grab active:cursor-grabbing text-[13px] transition-all hover:bg-gray-50",
        isDragging && "opacity-50"
      )}
    >
      {text}
    </div>
  );
}

interface DropZoneProps {
  onDrop: (item: { id: string; text: string }) => void;
  acceptType: string;
  value: string;
  questionNumber: string;
  className?: string;
}

function DropZone({ onDrop, acceptType, value, questionNumber, className }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: acceptType,
    drop: (item: { id: string; text: string }) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      className={cn(
        "min-w-[80px] min-h-[32px] w-fit h-fit border border-dashed rounded flex items-center justify-center text-[13px] transition-all p-1 text-center whitespace-normal",
        isOver ? "bg-blue-50 border-blue-500" : "border-gray-300 bg-white",
        value ? "border-blue-500 border-solid font-bold text-blue-600" : "text-black font-bold",
        className
      )}
    >
      {value || questionNumber}
    </div>
  );
}

interface PartProps {
  answers: Record<string, any>;
  onAnswerChange: (id: string, value: any) => void;
}

export default function Part3({ answers, onAnswerChange }: PartProps) {
  const featureOptions = [
    { id: 'rare', text: 'They are a very rare type of plant fossil.' },
    { id: 'no-organic', text: 'They do not contain any organic matter.' },
    { id: 'soft-wet', text: 'They are found in soft, wet ground.' },
    { id: 'far-from', text: 'They can be found far from normal fossil areas.' },
    { id: 'three-d', text: 'They are three-dimensional.' },
    { id: 'plant-cells', text: 'They provide information about plant cells.' },
  ];

  const flowchartOptions = [
    { id: 'contamination', text: 'contamination' },
    { id: 'vehicle', text: 'vehicle' },
    { id: 'heat', text: 'heat' },
    { id: 'results', text: 'results' },
    { id: 'radiation', text: 'radiation' },
    { id: 'site', text: 'site' },
    { id: 'microbes', text: 'microbes' },
    { id: 'water', text: 'water' },
  ];

  const fossilCategories = [
    { id: 'q21', name: 'Impression fossils' },
    { id: 'q22', name: 'Cast fossils' },
    { id: 'q23', name: 'Permineralisation fossils' },
    { id: 'q24', name: 'Compaction fossils' },
    { id: 'q25', name: 'Fusain fossils' },
  ];

  const handleFeatureDrop = (fossilId: string) => (item: { id: string; text: string }) => {
    onAnswerChange(fossilId, item.text);
  };

  const handleFlowchartDrop = (answerId: string) => (item: { id: string; text: string }) => {
    onAnswerChange(answerId, item.text);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8 font-sans text-[#1a1a1a]">
      <div className="bg-[#f2f2f2] p-4 rounded mb-8">
        <h2 className="font-bold mb-1">Part 3</h2>
        <p>Listen and answer questions 21–30.</p>
      </div>

      <div className="mb-12">
        <h3 className="font-bold text-lg mb-1">Questions 21–25</h3>
        <p className="mb-6">
          Which feature do the speakers identify for each of the following categories of fossil? Choose the correct answer for each fossil category and move it into the gap.
        </p>

        <div className="flex gap-24 items-start">
          <div className="space-y-6 w-80">
            <h4 className="font-bold text-base mb-4">Fossil categories</h4>
            {fossilCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between gap-4" id={`question-${category.id}`}>
                <span className="text-[14px]">{category.name}</span>
                <DropZone
                  onDrop={handleFeatureDrop(category.id)}
                  acceptType={ItemTypes.FEATURE}
                  value={answers[category.id]}
                  questionNumber={category.id.replace('q', '')}
                  className={cn(
                    "w-32 h-9 border-slate-400 bg-white",
                    category.id === 'q21' && "border-blue-500 border-dashed"
                  )}
                />
              </div>
            ))}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 max-w-md">
              <h4 className="font-bold text-base">Features</h4>
              <button className="flex items-center gap-1 text-blue-600 text-xs hover:underline">
                <Keyboard className="w-4 h-4" />
                Help
              </button>
            </div>
            <div className="flex flex-col gap-2 max-w-md">
              {featureOptions.map(option => (
                <div key={option.id} className="w-fit">
                  <DraggableItem
                    id={option.id}
                    text={option.text}
                    type={ItemTypes.FEATURE}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-1">Questions 26–30</h3>
        <p className="mb-6">
          Complete the flow-chart. Choose the correct answer and move it into the gap.
        </p>

        <div className="flex gap-20 items-start">
          <div className="flex-1 max-w-2xl">
            <h4 className="font-bold text-lg mb-6">Procedure for detecting life on another planet</h4>
            
            <div className="space-y-0 flex flex-col items-center">
              <div className="w-full border border-slate-400 p-3 text-[14px] bg-white">
                A spacecraft lands on a planet and sends out a rover.
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="w-0.5 h-full bg-slate-900 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
              </div>
              <div className="w-full border border-slate-400 p-3 text-[14px] flex items-center gap-2 bg-white" id="question-q26">
                The rover is directed to a 
                <div>
                  <DropZone
                    onDrop={handleFlowchartDrop('q26')}
                    acceptType={ItemTypes.FLOWCHART_ANSWER}
                    value={answers['q26']}
                    questionNumber="26"
                    className="w-24 h-8"
                  />
                </div>
                which has organic material.
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="w-0.5 h-full bg-slate-900 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
              </div>
              <div className="w-full border border-slate-400 p-3 text-[14px] flex items-center gap-2 bg-white" id="question-q27">
                It collects a sample from below the surface (in order to avoid the effects of
                <div>
                  <DropZone
                    onDrop={handleFlowchartDrop('q27')}
                    acceptType={ItemTypes.FLOWCHART_ANSWER}
                    value={answers['q27']}
                    questionNumber="27"
                    className="w-24 h-8"
                  />
                </div>
                ).
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="w-0.5 h-full bg-slate-900 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
              </div>
              <div className="w-full border border-slate-400 p-3 text-[14px] bg-white">
                The soil and rocks are checked to look for evidence of fossils.
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="w-0.5 h-full bg-slate-900 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
              </div>
              <div className="w-full border border-slate-400 p-3 text-[14px] bg-white">
                The sample is converted to powder.
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="w-0.5 h-full bg-slate-900 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
              </div>
              <div className="w-full border border-slate-400 p-3 text-[14px] flex items-center gap-2 bg-white" id="question-q28">
                The sample is subjected to
                <div>
                  <DropZone
                    onDrop={handleFlowchartDrop('q28')}
                    acceptType={ItemTypes.FLOWCHART_ANSWER}
                    value={answers['q28']}
                    questionNumber="28"
                    className="w-24 h-8"
                  />
                </div>
                .
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="w-0.5 h-full bg-slate-900 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
              </div>
              <div className="w-full border border-slate-400 p-3 text-[14px] flex items-center gap-2 bg-white" id="question-q29">
                A mass spectrometer is used to search for potential proof of life, e.g
                <div>
                  <DropZone
                    onDrop={handleFlowchartDrop('q29')}
                    acceptType={ItemTypes.FLOWCHART_ANSWER}
                    value={answers['q29']}
                    questionNumber="29"
                    className="w-24 h-8"
                  />
                </div>
                .
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="w-0.5 h-full bg-slate-900 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                </div>
              </div>
              <div className="w-full border border-slate-400 p-3 text-[14px] flex items-center gap-2 bg-white" id="question-q30">
                The
                <div>
                  <DropZone
                    onDrop={handleFlowchartDrop('q30')}
                    acceptType={ItemTypes.FLOWCHART_ANSWER}
                    value={answers['q30']}
                    questionNumber="30"
                    className="w-24 h-8"
                  />
                </div>
                are compared with existing data from Earth.
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 max-w-xs">
              <h4 className="font-bold text-base">Options</h4>
              <button className="flex items-center gap-1 text-blue-600 text-xs hover:underline">
                <Keyboard className="w-4 h-4" />
                Help
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {flowchartOptions.map(option => (
                <div key={option.id} className="w-fit">
                  <DraggableItem
                    id={option.id}
                    text={option.text}
                    type={ItemTypes.FLOWCHART_ANSWER}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
