import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';

interface ReadingNavigationProps {
  currentPart: number;
}

export function ReadingNavigation({ currentPart }: ReadingNavigationProps) {
  const navigate = useNavigate();

  // Mock answer counts
  const [answerCounts] = useState({
    part1: { current: 0, total: 13 },
    part2: { current: 0, total: 13 },
    part3: { current: 0, total: 14 },
  });

  const parts = [
    { num: 1, path: '/reading/part1', questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], count: answerCounts.part1 },
    { num: 2, path: '/reading/part2', questions: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], count: answerCounts.part2 },
    { num: 3, path: '/reading/part3', questions: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], count: answerCounts.part3 },
  ];

  const goToPreviousPart = () => {
    if (currentPart > 1) {
      navigate(parts[currentPart - 2].path);
    }
  };

  const goToNextPart = () => {
    if (currentPart < 3) {
      navigate(parts[currentPart].path);
    }
  };

  return (
    <footer className="border-t border-gray-300 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8 overflow-x-auto ielts-scrollbar pb-2">
          {parts.map((part) => (
            <div key={part.num} className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate(part.path)}
                className={`text-sm font-medium ${
                  part.num === currentPart ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                Part {part.num}
              </button>
              <div className="flex items-center gap-1">
                {part.questions.map((q, idx) => (
                  <button
                    key={q}
                    className={`w-6 h-6 text-xs flex items-center justify-center border ${
                      idx === 0 && part.num === currentPart
                        ? 'bg-[#0066CC] text-white border-[#0066CC]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {part.count.current} of {part.count.total}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            onClick={goToPreviousPart}
            disabled={currentPart === 1}
            className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextPart}
            disabled={currentPart === 3}
            className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white hover:bg-gray-700 ml-2">
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
