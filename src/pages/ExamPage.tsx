
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  X, 
  Play, 
  Check,
  AlertTriangle,
  Maximize,
  Mic,
  HelpCircle,
  Settings,
  GraduationCap,
  FileText,
  Headphones,
  BookOpen
} from 'lucide-react';
import { testService } from '../services/api';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

// --- Sub-components ---

const BLCLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    <div className="bg-ielts-red p-1 rounded-md shadow-sm flex items-center justify-center">
      <GraduationCap className="text-white" size={20} strokeWidth={2.5} />
    </div>
    <span className="text-xl font-black text-ielts-red tracking-tighter">BLC</span>
  </div>
);

const Timer = ({ duration, onTimeUp }: { duration: number; onTimeUp: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-slate-900 font-bold text-lg">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds} left
    </div>
  );
};

export default function ExamPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [reviewList, setReviewList] = useState<Record<string, boolean>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setShowWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await testService.getTestById(testId!);
        setTest(data);
      } catch (error) {
        console.error("Failed to fetch test", error);
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId, navigate]);

  useEffect(() => {
    const saved = localStorage.getItem(`ielts_exam_${testId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setReviewList(parsed.reviewList || {});
    }
  }, [testId]);

  useEffect(() => {
    if (Object.keys(answers).length > 0 || Object.keys(reviewList).length > 0) {
      localStorage.setItem(`ielts_exam_${testId}`, JSON.stringify({ answers, reviewList }));
    }
  }, [answers, reviewList, testId]);

  const handleSubmit = async () => {
    try {
      await testService.submitResult({
        testId: testId!,
        answers
      });
      localStorage.removeItem(`ielts_exam_${testId}`);
      navigate('/student/dashboard');
    } catch (error) {
      console.error("Failed to submit test", error);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-ielts-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!test) return <div className="flex h-screen items-center justify-center">Test not found</div>;

  const questions = test.questions || [];
  const currentQuestion = questions[currentQuestionIdx];

  const renderQuestion = (q: any, idx: number) => {
    if (!q) return null;
    switch (q.type) {
      case 'MCQ':
        return (
          <div key={q.id} className="p-6">
            <p className="text-lg font-bold mb-6">{idx + 1}. {q.structure.prompt}</p>
            <div className="space-y-3">
              {q.structure.options?.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-4 ${
                    answers[q.id] === opt 
                      ? 'border-ielts-blue bg-ielts-light-blue shadow-sm' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[q.id] === opt ? 'border-ielts-blue' : 'border-slate-400'}`}>
                    {answers[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-ielts-blue" />}
                  </div>
                  <span className="font-medium text-slate-700">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'TRUE_FALSE':
        return (
          <div key={q.id} className="p-6">
            <p className="text-lg font-bold mb-6">{idx + 1}. {q.structure.prompt}</p>
            <div className="flex flex-col gap-3">
              {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center gap-4 ${
                    answers[q.id] === opt 
                      ? 'border-ielts-blue bg-ielts-light-blue shadow-sm' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[q.id] === opt ? 'border-ielts-blue' : 'border-slate-400'}`}>
                    {answers[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-ielts-blue" />}
                  </div>
                  <span className="font-medium text-slate-700">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'FILL_GAPS':
        return (
          <div key={q.id} className="p-6">
            <p className="text-lg font-bold mb-6">{idx + 1}. {q.structure.prompt}</p>
            <input 
              type="text"
              className="w-full p-4 rounded-lg border border-slate-300 focus:border-ielts-blue outline-none transition-all font-medium"
              placeholder="Type your answer..."
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden select-none">
      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Security Warning</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Switching tabs or windows is not allowed during the exam. This incident has been logged. Please return to your test immediately.
              </p>
              <button 
                onClick={() => setShowWarning(false)}
                className="w-full py-4 bg-ielts-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
              >
                Return to Test
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="ielts-test-header">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="ielts-logo-box">I</div>
            <span className="text-ielts-red font-bold text-lg tracking-tighter">IELTS</span>
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div className="text-slate-600 font-bold text-xs uppercase tracking-wider">{test.title}</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-300">
            <Clock size={14} className="text-ielts-blue" />
            <Timer duration={test.duration || 60} onTimeUp={handleSubmit} />
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <button className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-600"><HelpCircle size={18} /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-600"><Settings size={18} /></button>
          <button 
            onClick={handleSubmit}
            className="bg-ielts-blue text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
          >
            Finish Test
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {test.type === 'READING' || test.type === 'WRITING' ? (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full overflow-y-auto p-10 bg-white ielts-scrollbar">
                <div className="max-w-3xl mx-auto">
                  {test.type === 'READING' ? (
                    test.content.passages?.map((p: any, i: number) => (
                      <div key={i} className="mb-12">
                        <h2 className="text-2xl font-black mb-8 text-slate-900 leading-tight">{p.title}</h2>
                        <div className="prose prose-slate max-w-none text-[17px] leading-[1.8] text-slate-700 whitespace-pre-wrap font-serif">
                          {p.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mb-12">
                      <h2 className="text-2xl font-black mb-8 text-slate-900 leading-tight">Writing Task</h2>
                      <div className="bg-ielts-light-blue p-6 rounded-lg border border-blue-200 mb-8">
                        <p className="text-slate-700 font-medium leading-relaxed italic">
                          {test.content.instruction}
                        </p>
                      </div>
                      <div className="prose prose-slate max-w-none text-[17px] leading-[1.8] text-slate-700 whitespace-pre-wrap font-serif">
                        {test.content.prompt}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
            
            <PanelResizeHandle className="w-1.5 bg-slate-200 hover:bg-ielts-blue transition-colors cursor-col-resize flex items-center justify-center">
              <div className="h-10 w-0.5 bg-slate-400 rounded-full" />
            </PanelResizeHandle>
            
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full overflow-y-auto p-10 ielts-scrollbar bg-slate-50">
                <div className="max-w-2xl mx-auto">
                  {test.type === 'READING' ? (
                    renderQuestion(currentQuestion, currentQuestionIdx)
                  ) : (
                    <div className="h-full flex flex-col gap-4">
                      <textarea 
                        className="flex-1 w-full p-8 bg-white border border-slate-300 rounded-lg outline-none focus:border-ielts-blue transition-all font-sans text-lg leading-relaxed text-slate-700 shadow-inner resize-none min-h-[500px]"
                        placeholder="Type your essay here..."
                        value={answers['writing_response'] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, writing_response: e.target.value }))}
                      />
                      <div className="flex justify-between items-center px-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Word Count: {(answers['writing_response'] || '').trim().split(/\s+/).filter(Boolean).length}
                        </div>
                        <div className="text-[10px] text-slate-400 italic">
                          Auto-saved to local storage
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        ) : (
          <div className="h-full flex flex-col bg-slate-50">
            {/* Listening Audio Player */}
            <div className="bg-white border-b border-slate-300 px-10 py-6 flex items-center gap-8 shadow-sm">
              <button 
                onClick={() => {
                  if (audioRef.current?.paused) audioRef.current.play();
                  else audioRef.current?.pause();
                }}
                className="w-14 h-14 bg-ielts-blue text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-all shrink-0"
              >
                <Play size={28} className="ml-1" />
              </button>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Listening Audio Track</div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-ielts-blue w-1/4" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Volume2 size={20} />
                <div className="w-24 h-1 bg-slate-200 rounded-full">
                  <div className="h-full bg-slate-400 w-3/4" />
                </div>
              </div>
              <audio ref={audioRef} src={test.content.audioUrl} />
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 ielts-scrollbar">
              <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl border border-slate-200 shadow-sm">
                {renderQuestion(currentQuestion, currentQuestionIdx)}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="ielts-test-footer">
        <div className="flex items-center h-full">
          <div className="flex items-center h-full overflow-x-auto no-scrollbar">
            {questions.map((q: any, idx: number) => (
              <div 
                key={q.id}
                onClick={() => setCurrentQuestionIdx(idx)}
                className={`ielts-question-nav-item ${currentQuestionIdx === idx ? 'active' : ''} ${answers[q.id] ? 'answered' : ''} ${reviewList[q.id] ? 'review' : ''}`}
              >
                <span className="mb-1">{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setReviewList(prev => ({ ...prev, [currentQuestion?.id]: !prev[currentQuestion?.id] }))}
            className={`flex items-center gap-2 px-4 py-1.5 rounded border transition-all text-xs font-bold ${
              reviewList[currentQuestion?.id] 
                ? 'bg-amber-100 border-amber-300 text-amber-700' 
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HelpCircle size={14} />
            Review
          </button>
          <div className="flex border border-slate-300 rounded overflow-hidden shadow-sm">
            <button 
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              className="p-2 bg-white hover:bg-slate-50 border-r border-slate-300 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={currentQuestionIdx === questions.length - 1}
              onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
              className="p-2 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
