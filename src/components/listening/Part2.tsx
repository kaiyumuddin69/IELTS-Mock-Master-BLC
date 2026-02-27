import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Keyboard } from 'lucide-react';
import { cn } from './utils';

const ItemTypes = {
  RESPONSIBILITY: 'responsibility',
  ROOM: 'room',
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

export default function Part2({ answers, onAnswerChange }: PartProps) {
  const responsibilityOptions = [
    { id: 'finance', text: 'Finance' },
    { id: 'food', text: 'Food' },
    { id: 'health', text: 'Health' },
    { id: 'kids', text: "Kids' Counselling" },
    { id: 'organisation', text: 'Organisation' },
    { id: 'rooms', text: 'Rooms' },
    { id: 'sport', text: 'Sport' },
    { id: 'trips', text: 'Trips' },
  ];

  const roomOptions = [
    { id: 'cookery', text: 'Cookery room' },
    { id: 'games', text: 'Games room' },
    { id: 'kitchen', text: 'Kitchen' },
    { id: 'pottery', text: 'Pottery room' },
    { id: 'sports', text: 'Sports complex' },
    { id: 'staff', text: 'Staff accommodation' },
  ];

  const people = [
    { id: 'q11', name: 'Mary Brown' },
    { id: 'q12', name: 'John Stevens' },
    { id: 'q13', name: 'Alison Jones' },
    { id: 'q14', name: 'Tim Smith' },
    { id: 'q15', name: 'Jenny James' },
  ];

  const handleResponsibilityDrop = (personId: string) => (item: { id: string; text: string }) => {
    onAnswerChange(personId, item.text);
  };

  const handleRoomDrop = (roomId: string) => (item: { id: string; text: string }) => {
    onAnswerChange(roomId, item.text);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8 font-sans text-[#1a1a1a]">
      <div className="bg-[#f2f2f2] p-4 rounded mb-8">
        <h2 className="font-bold mb-1">Part 2</h2>
        <p>Listen and answer questions 11–20.</p>
      </div>

      <div className="mb-12">
        <h3 className="font-bold text-lg mb-1">Questions 11–15</h3>
        <p className="mb-6">
          Who is responsible for each area? Choose the correct answer for each person and move it into the gap.
        </p>

        <div className="flex gap-24 items-start">
          <div className="space-y-6 w-72">
            <h4 className="font-bold text-base mb-4">People</h4>
            {people.map(person => (
              <div key={person.id} className="flex items-center justify-between gap-4" id={`question-${person.id}`}>
                <span className="text-[14px]">{person.name}</span>
                <DropZone
                  onDrop={handleResponsibilityDrop(person.id)}
                  acceptType={ItemTypes.RESPONSIBILITY}
                  value={answers[person.id]}
                  questionNumber={person.id.replace('q', '')}
                  className={cn(
                    "w-32 h-9 border-slate-400 bg-white",
                    person.id === 'q11' && "border-blue-500 border-dashed"
                  )}
                />
              </div>
            ))}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 max-w-md">
              <h4 className="font-bold text-base">Staff Responsibilities</h4>
              <button className="flex items-center gap-1 text-blue-600 text-xs hover:underline">
                <Keyboard className="w-4 h-4" />
                Help
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-w-md">
              {responsibilityOptions.map(option => (
                <div key={option.id} className="w-fit">
                  <DraggableItem
                    id={option.id}
                    text={option.text}
                    type={ItemTypes.RESPONSIBILITY}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-1">Questions 16–20</h3>
        <p className="mb-6">
          Label the map. Choose the correct answer and move it into the gap.
        </p>

        <div className="flex gap-20 items-start">
          <div className="relative w-[600px] h-[500px] border border-slate-300 bg-white p-4">
            {/* Top Row */}
            <div className="absolute top-8 left-20 w-32 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center" id="question-q18">
              <div>
                <DropZone
                  onDrop={handleRoomDrop('q18')}
                  acceptType={ItemTypes.ROOM}
                  value={answers['q18']}
                  questionNumber="18"
                  className="w-24 h-8"
                />
              </div>
            </div>
            <div className="absolute top-8 left-[220px] w-24 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center">
              Staff<br />Lounge
            </div>
            <div className="absolute top-8 left-[330px] w-32 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center" id="question-q19">
              <div>
                <DropZone
                  onDrop={handleRoomDrop('q19')}
                  acceptType={ItemTypes.ROOM}
                  value={answers['q19']}
                  questionNumber="19"
                  className="w-24 h-8"
                />
              </div>
            </div>

            {/* Left Column */}
            <div className="absolute top-32 left-8 w-24 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center">
              Girls'<br />Accommodation
            </div>
            <div className="absolute top-[200px] left-8 w-24 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center">
              Boys'<br />Accommodation
            </div>
            <div className="absolute top-[270px] left-8 w-32 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center" id="question-q17">
              <div>
                <DropZone
                  onDrop={handleRoomDrop('q17')}
                  acceptType={ItemTypes.ROOM}
                  value={answers['q17']}
                  questionNumber="17"
                  className="w-24 h-8"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="absolute top-32 right-8 w-24 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center">
              Art<br />Room
            </div>
            <div className="absolute top-[200px] right-8 w-24 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center">
              Craft<br />Room
            </div>
            <div className="absolute top-[270px] right-8 w-32 h-16 border border-slate-400 flex items-center justify-center text-[11px] bg-slate-50 text-center" id="question-q20">
              <div>
                <DropZone
                  onDrop={handleRoomDrop('q20')}
                  acceptType={ItemTypes.ROOM}
                  value={answers['q20']}
                  questionNumber="20"
                  className="w-24 h-8"
                />
              </div>
            </div>

            {/* Center */}
            <div className="absolute top-[180px] left-[200px] w-48 h-32 border border-slate-400 flex flex-col items-center justify-center text-[11px] bg-slate-50 text-center">
              <div className="mb-2" id="question-q16">
                <DropZone
                  onDrop={handleRoomDrop('q16')}
                  acceptType={ItemTypes.ROOM}
                  value={answers['q16']}
                  questionNumber="16"
                  className="w-24 h-8"
                />
              </div>
              Garden
            </div>

            {/* Bottom Row */}
            <div className="absolute bottom-8 left-8 right-8 h-24 border border-slate-400 grid grid-cols-3">
              <div className="border-r border-slate-400 p-2 text-[11px] text-center flex items-center justify-center bg-slate-50">Co-ordinator's<br />Office</div>
              <div className="border-r border-slate-400 p-2 text-[11px] text-center flex items-center justify-center bg-slate-50 font-bold">Main Hall</div>
              <div className="p-2 text-[11px] text-center flex items-center justify-center bg-slate-50">Reception</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 max-w-md">
              <h4 className="font-bold text-base">Options</h4>
              <button className="flex items-center gap-1 text-blue-600 text-xs hover:underline">
                <Keyboard className="w-4 h-4" />
                Help
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-w-md">
              {roomOptions.map(option => (
                <div key={option.id} className="w-fit">
                  <DraggableItem
                    id={option.id}
                    text={option.text}
                    type={ItemTypes.ROOM}
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
