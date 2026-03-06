
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
  const [showWarning, setShowWarning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const handleSubmit = async () => {
    try {
      await testService.submitResult({
        testId: testId!,
        answers
      });
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

  const renderQuestion = (q: any, idx: number) => {
    switch (q.type) {
      case 'MCQ':
        return (
          <div key={q.id} className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <p className="text-lg font-bold mb-4">{idx + 1}. {q.structure.prompt}</p>
            <div className="space-y-2">
              {q.structure.options?.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    answers[q.id] === opt 
                      ? 'border-ielts-blue bg-blue-50' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="font-medium">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'FILL_GAPS':
        return (
          <div key={q.id} className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <p className="text-lg font-bold mb-4">{idx + 1}. {q.structure.prompt}</p>
            <input 
              type="text"
              className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-ielts-blue outline-none transition-all"
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
      {/* Header */}
      <header className="ielts-test-header !h-14 border-b border-slate-200 px-6 flex items-center justify-between bg-white z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <div className="bg-ielts-red text-white p-1 font-bold text-lg leading-none rounded-sm flex items-center justify-center w-8 h-8">I</div>
            <span className="text-ielts-red font-bold text-xl tracking-tighter">IELTS</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <BLCLogo />
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-500">
            {test.type === 'READING' && <BookOpen size={18} />}
            {test.type === 'LISTENING' && <Headphones size={18} />}
            {test.type === 'WRITING' && <FileText size={18} />}
            <span className="text-xs font-black uppercase tracking-widest">{test.type}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
            <Clock size={16} className="text-ielts-blue" />
            <Timer duration={test.duration || 60} onTimeUp={handleSubmit} />
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-ielts-blue text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
          >
            Finish
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {test.type === 'READING' || test.type === 'WRITING' ? (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full overflow-y-auto p-8 bg-slate-50/50 border-r border-slate-200 ielts-scrollbar">
                <div className="max-w-3xl mx-auto">
                  {test.type === 'READING' ? (
                    test.content.passages?.map((p: any, i: number) => (
                      <div key={i} className="mb-12">
                        <h2 className="text-2xl font-black mb-6 text-slate-900">{p.title}</h2>
                        <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                          {p.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="mb-12">
                      <h2 className="text-2xl font-black mb-6 text-slate-900">Writing Task</h2>
                      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {test.content.instruction || "You should spend about 40 minutes on this task. Write at least 250 words."}
                        </p>
                      </div>
                      <div className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {test.content.prompt}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
            
            <PanelResizeHandle className="w-1.5 bg-slate-200 hover:bg-ielts-blue transition-colors cursor-col-resize flex items-center justify-center">
              <div className="h-8 w-0.5 bg-slate-400 rounded-full" />
            </PanelResizeHandle>
            
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full overflow-y-auto p-8 ielts-scrollbar">
                <div className="max-w-3xl mx-auto">
                  {test.type === 'READING' ? (
                    test.questions?.map((q: any, idx: number) => renderQuestion(q, idx))
                  ) : (
                    <div className="h-full flex flex-col gap-4">
                      <textarea 
                        className="flex-1 w-full p-8 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-ielts-blue transition-all font-sans text-lg leading-relaxed text-slate-700 shadow-sm resize-none"
                        placeholder="Type your answer here..."
                        value={answers['writing_response'] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, writing_response: e.target.value }))}
                      />
                      <div className="flex justify-between items-center px-4">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                          Word Count: {(answers['writing_response'] || '').trim().split(/\s+/).filter(Boolean).length}
                        </div>
                        <div className="text-xs text-slate-400 italic">
                          Auto-saved
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        ) : (
          <div className="h-full flex flex-col">
            {/* Listening Audio Player */}
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex items-center gap-6">
              <button 
                onClick={() => {
                  if (audioRef.current?.paused) audioRef.current.play();
                  else audioRef.current?.pause();
                }}
                className="w-12 h-12 bg-ielts-blue text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
              >
                <Play size={24} className="ml-1" />
              </button>
              <div className="flex-1">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-ielts-blue w-1/3" />
                </div>
              </div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Listening Audio</div>
              <audio ref={audioRef} src={test.content.audioUrl} />
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 ielts-scrollbar">
              <div className="max-w-3xl mx-auto">
                {test.questions?.map((q: any, idx: number) => renderQuestion(q, idx))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="ielts-test-footer h-14 border-t border-slate-200 px-8 flex items-center justify-between bg-white z-50">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {test.questions?.map((q: any, idx: number) => (
            <button 
              key={q.id}
              onClick={() => {
                const el = document.getElementById(`question-${q.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                answers[q.id] ? 'bg-ielts-blue text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button className="p-2 hover:bg-slate-50 border-r border-slate-200"><ChevronLeft size={20} /></button>
            <button className="p-2 hover:bg-slate-50"><ChevronRight size={20} /></button>
          </div>
        </div>
      </footer>
    </div>
  );
}
