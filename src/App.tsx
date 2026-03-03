/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Menu,
  X,
  Play,
  Volume2,
  Volume1,
  Save,
  Maximize,
  AlertTriangle,
  Edit3,
  Settings,
  MoreVertical,
  GraduationCap,
  Check,
  HelpCircle,
  Wifi,
  Bell,
  ArrowLeft,
  FileText,
  Trash2,
  Layout,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_TEST_DATA, TestModule, Question, Section, WritingTest, WritingSubmission } from './types';
import { authService, testService } from './services/api';
import ListeningTest from './components/listening/ListeningTest';
import ReadingTest from './components/reading/ReadingTest';
import InstructorPanel from './components/instructor/InstructorPanel';
import StudentDashboard from './components/student/StudentDashboard';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

// --- Components ---

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

  return (
    <div className="text-slate-900 font-bold text-lg">
      {minutes} minutes left
    </div>
  );
};

const TestHeader = ({ userEmail, onFinish }: { userEmail?: string; onFinish: () => void }) => {
  return (
    <header className="ielts-test-header !h-14 border-b border-slate-200 px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <div className="bg-ielts-red text-white p-1 font-bold text-lg leading-none rounded-sm flex items-center justify-center w-8 h-8">I</div>
          <span className="text-ielts-red font-bold text-xl tracking-tighter">IELTS</span>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <BLCLogo />
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Test taker ID</span>
          <span className="text-xs font-bold text-slate-800">{userEmail || '24681357'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <Volume2 size={16} className="text-ielts-blue" />
            <div className="w-20 h-1 bg-slate-200 rounded-full relative">
              <div className="absolute left-0 top-0 h-full w-2/3 bg-ielts-blue rounded-full" />
            </div>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          <button 
            onClick={onFinish}
            className="bg-ielts-blue text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
          >
            Finish
          </button>
        </div>
      </div>
    </header>
  );
};

const TestFooter = ({ 
  sections, 
  currentSectionIndex, 
  onSectionChange, 
  answers,
  onFinish
}: { 
  sections: Section[]; 
  currentSectionIndex: number; 
  onSectionChange: (idx: number) => void;
  answers: Record<string, any>;
  onFinish: () => void;
}) => {
  return (
    <footer className="ielts-test-footer">
      <div className="flex items-center gap-8 overflow-x-auto no-scrollbar flex-1">
        {sections.map((s, sIdx) => {
          const answeredCount = s.questions.filter(q => answers[q.id]).length;
          const isCurrent = currentSectionIndex === sIdx;
          return (
            <div key={sIdx} className={`flex items-center gap-4 transition-all ${isCurrent ? 'opacity-100' : 'opacity-40'}`}>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onSectionChange(sIdx)}
              >
                <span className="text-xs font-bold whitespace-nowrap">{s.title}</span>
                <span className="text-[10px] text-slate-500">{answeredCount} of {s.questions.length}</span>
              </div>
              {isCurrent && (
                <div className="flex items-center gap-1">
                  {s.questions.map(q => (
                    <div 
                      key={q.id}
                      onClick={() => {
                        const el = document.getElementById(`question-${q.id}`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`ielts-question-nav-item ${answers[q.id] ? 'answered' : ''}`}
                    >
                      {q.id.replace('q', '')}
                    </div>
                  ))}
                </div>
              )}
              {sIdx < sections.length - 1 && <div className="h-6 w-px bg-slate-200" />}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <div className="flex items-center border border-slate-200 rounded overflow-hidden">
          <button 
            disabled={currentSectionIndex === 0}
            onClick={() => onSectionChange(currentSectionIndex - 1)}
            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 border-r border-slate-200 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            disabled={currentSectionIndex === sections.length - 1}
            onClick={() => onSectionChange(currentSectionIndex + 1)}
            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <button 
          onClick={onFinish}
          className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-400 rounded hover:bg-slate-200 hover:text-slate-600 transition-colors"
        >
          <Check size={20} />
        </button>
      </div>
    </footer>
  );
};
const AudioPlayer = ({ src, onEnded }: { src: string; onEnded?: () => void }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
      setIsPlaying(true);
    }
  }, [src]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-8 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
      <button 
        onClick={() => {
          if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
          }
        }}
        className="w-10 h-10 flex items-center justify-center bg-ielts-blue text-white rounded-full hover:bg-blue-700 transition-all shadow-md"
      >
        {isPlaying ? <X size={20} /> : <Play size={20} className="ml-0.5" />}
      </button>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden relative">
        <div 
          className="absolute left-0 top-0 h-full bg-ielts-blue transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audio Playing</div>
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'instructions' | 'test' | 'result' | 'instructor'>('landing');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [passageWidth, setPassageWidth] = useState(50); // percentage
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [practiceTasks, setPracticeTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [writingTests, setWritingTests] = useState<WritingTest[]>([]);
  const [readingTests, setReadingTests] = useState<TestModule[]>([]);
  const [listeningTests, setListeningTests] = useState<TestModule[]>([]);
  const [speakingTests, setSpeakingTests] = useState<any[]>([]);
  const [selectedWritingTest, setSelectedWritingTest] = useState<WritingTest | null>(null);
  const [selectedCustomTest, setSelectedCustomTest] = useState<TestModule | null>(null);

  const fetchTests = async () => {
    try {
      const tests = await testService.getTests();
      setWritingTests(tests.filter((t: any) => t.module === 'writing'));
      setReadingTests(tests.filter((t: any) => t.module === 'reading'));
      setListeningTests(tests.filter((t: any) => t.module === 'listening'));
      setSpeakingTests(tests.filter((t: any) => t.module === 'speaking'));
    } catch (e: any) {
      console.error("Error fetching tests", e);
    }
  };

  const fetchUserResults = async () => {
    try {
      const results = await testService.getMyResults();
      setUserResults(results);
    } catch (e: any) {
      console.error("Error fetching user data", e);
    }
  };
  
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchTests();
      fetchUserResults();
    }
    setLoading(false);
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    setView('landing');
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTaskTitle || !newTaskDueDate) return;
    setIsAddingTask(true);
    try {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTaskTitle,
        dueDate: newTaskDueDate,
        completed: false,
        createdAt: new Date()
      };
      setPracticeTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
    } catch (e) {
      console.error("Error adding task", e);
    } finally {
      setIsAddingTask(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      setPracticeTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
    } catch (e) {
      console.error("Error updating task", e);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setPracticeTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) {
      console.error("Error deleting task", e);
    }
  };

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch(e => console.error(e));
  };

  const startTest = (moduleKey: string, customTest?: TestModule) => {
    if (!user) {
      setView('login');
      return;
    }
    setActiveModule(moduleKey);
    if (customTest) {
      setSelectedCustomTest(customTest);
    } else {
      setSelectedCustomTest(null);
    }
    setView('instructions');
  };

  const beginModule = () => {
    setView('test');
    enterFullscreen();
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const submitTest = async () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    const currentModuleData = selectedCustomTest;

    if (user && activeModule && currentModuleData) {
      try {
        const { score, total } = calculateScore();
        const band = getBandScore(score, total);
        
        await testService.submitResult({
          testId: currentModuleData.id,
          module: activeModule,
          answers,
          score,
          total,
          band,
          status: activeModule === 'writing' ? 'pending' : 'completed'
        });

        fetchUserResults();
      } catch (e) {
        console.error("Failed to save result", e);
      }
    }

    setView('result');
  };

  const calculateScore = () => {
    const currentModuleData = selectedCustomTest;
    if (!currentModuleData) return { score: 0, total: 0 };
    
    let score = 0;
    let total = 0;

    currentModuleData.sections.forEach(section => {
      section.questions.forEach(q => {
        total++;
        const userAnswer = answers[q.id];
        const correctAnswer = q.correctAnswer;

        if (Array.isArray(correctAnswer)) {
          if (correctAnswer.some(ans => ans.toLowerCase() === String(userAnswer).toLowerCase())) {
            score++;
          }
        } else if (String(userAnswer).toLowerCase() === String(correctAnswer).toLowerCase()) {
          score++;
        }
      });
    });

    return { score, total };
  };

  const getBandScore = (score: number, total: number) => {
    if (total === 0) return 0;
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 9.0;
    if (percentage >= 85) return 8.5;
    if (percentage >= 80) return 8.0;
    if (percentage >= 75) return 7.5;
    if (percentage >= 70) return 7.0;
    if (percentage >= 65) return 6.5;
    if (percentage >= 60) return 6.0;
    if (percentage >= 50) return 5.5;
    if (percentage >= 40) return 5.0;
    return 4.0;
  };

  const renderQuestion = (q: Question) => {
    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
    const currentAnswer = answers[q.id];
    
    switch (q.type) {
      case 'mcq':
      case 'tfng':
        const opts = q.options || (q.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : []);
        return (
          <div key={q.id} id={`question-${q.id}`} className="mb-8 p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-800 font-bold rounded-lg shrink-0 text-sm">{q.id}</div>
              <div className="flex-1">
                <p className="text-slate-800 font-bold mb-4 leading-relaxed">{q.question}</p>
                <div className="grid grid-cols-1 gap-2">
                  {opts.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerChange(q.id, opt)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        currentAnswer === opt 
                          ? 'border-ielts-blue bg-blue-50/50 ring-1 ring-ielts-blue' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`ielts-radio-circle ${currentAnswer === opt ? 'selected' : ''}`}>
                        {currentAnswer === opt && <div className="ielts-radio-dot" />}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'form':
      case 'sentence':
        return (
          <div key={q.id} id={`question-${q.id}`} className="mb-8 p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-800 font-bold rounded-lg shrink-0 text-sm">{q.id}</div>
              <div className="flex-1">
                <p className="text-slate-800 font-bold leading-relaxed">
                  {q.question.split('[___]').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <input
                          type="text"
                          className="ielts-input mx-2 w-32"
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          </div>
        );
      case 'multi-mcq':
        return (
          <div key={q.id} id={`question-${q.id}`} className="mb-8 p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-800 font-bold rounded-lg shrink-0 text-sm">{q.id}</div>
              <div className="flex-1">
                <p className="text-slate-800 font-bold mb-4 leading-relaxed">{q.question}</p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options?.map((opt, idx) => {
                    const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(opt);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          const prev = Array.isArray(currentAnswer) ? currentAnswer : [];
                          const next = isSelected ? prev.filter(i => i !== opt) : [...prev, opt];
                          handleAnswerChange(q.id, next);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          isSelected 
                            ? 'border-ielts-blue bg-blue-50/50 ring-1 ring-ielts-blue' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border border-slate-300 flex items-center justify-center transition-all ${isSelected ? 'bg-ielts-blue border-ielts-blue' : 'bg-white'}`}>
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'matching':
      case 'map':
      case 'flow-chart':
        return (
          <div key={q.id} id={`question-${q.id}`} className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-800 font-bold rounded-lg shrink-0 text-sm">{q.id}</div>
              <div className="flex-1">
                <p className="text-slate-800 font-bold leading-relaxed">{q.question}</p>
              </div>
            </div>
            
            <div className="flex gap-8 items-start">
              <div className="flex-1 relative bg-slate-50 rounded-2xl p-8 border border-slate-200 min-h-[300px] flex items-center justify-center overflow-hidden">
                {q.imageUrl ? (
                  <div className="relative">
                    <img src={q.imageUrl} alt="Map" className="max-w-full rounded shadow-lg" />
                    {q.labels?.map(label => (
                      <div 
                        key={label.id}
                        style={{ left: `${label.x}%`, top: `${label.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                      >
                        <div 
                          onClick={() => {
                            if (selectedLabel) {
                              handleAnswerChange(label.id, selectedLabel);
                              setSelectedLabel(null);
                            }
                          }}
                          className={`ielts-gap-box cursor-pointer hover:border-ielts-blue transition-all ${answers[label.id] ? 'border-solid border-ielts-blue bg-blue-50' : ''}`}
                        >
                          {answers[label.id] || label.id}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : q.type === 'flow-chart' ? (
                  <div className="flex flex-col items-center gap-8">
                    {q.labels?.map((label, idx) => (
                      <React.Fragment key={label.id}>
                        <div 
                          onClick={() => {
                            if (selectedLabel) {
                              handleAnswerChange(label.id, selectedLabel);
                              setSelectedLabel(null);
                            }
                          }}
                          className={`ielts-gap-box cursor-pointer hover:border-ielts-blue transition-all ${answers[label.id] ? 'border-solid border-ielts-blue bg-blue-50' : ''}`}
                        >
                          {answers[label.id] || label.id}
                        </div>
                        {idx < q.labels!.length - 1 && <ChevronRight className="rotate-90 text-slate-300" />}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                      <p className="text-sm font-bold text-slate-700 mb-4">{q.question}</p>
                      <div 
                        onClick={() => {
                          if (selectedLabel) {
                            handleAnswerChange(q.id, selectedLabel);
                            setSelectedLabel(null);
                          }
                        }}
                        className={`ielts-gap-box cursor-pointer hover:border-ielts-blue transition-all w-full h-12 ${answers[q.id] ? 'border-solid border-ielts-blue bg-blue-50' : ''}`}
                      >
                        {answers[q.id] || 'Click an option on the right then click here'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="w-64 space-y-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Options</div>
                {q.options?.map((opt, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedLabel(opt)}
                    className={`ielts-label-box w-full text-center py-3 ${selectedLabel === opt ? 'ring-2 ring-ielts-blue border-ielts-blue bg-blue-50' : ''}`}
                  >
                    {opt}
                  </div>
                ))}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-ielts-blue mb-2">
                    <HelpCircle size={14} />
                    <span className="text-[10px] font-bold uppercase">How to answer</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Click an option on the right, then click a gap on the left to move it.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={q.id} id={`question-${q.id}`} className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-800 font-bold rounded-lg shrink-0 text-sm">{q.id}</div>
              <div className="flex-1">
                <p className="text-slate-800 font-bold leading-relaxed">{q.question}</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="ielts-table">
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Importance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{q.question.split(' - ')[1]}</td>
                    <td><input className="ielts-input w-full" value={answers[q.id] || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ielts-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'instructor') {
    if (user?.role !== 'admin') {
      setView('landing');
      return null;
    }
    return (
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('landing')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              <ArrowLeft size={20} />
            </button>
            <BLCLogo />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-black text-slate-900">Instructor Panel</div>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Administrator</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black">
              {user?.displayName?.[0] || 'A'}
            </div>
          </div>
        </header>
        <InstructorPanel user={user} />
      </div>
    );
  }

  if (view === 'landing') {
    if (user) {
      return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
          <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <BLCLogo />
              <div className="h-6 w-px bg-slate-200" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student Portal</span>
            </div>
            <div className="flex items-center gap-6">
              {user.role === 'admin' && (
                <button 
                  onClick={() => setView('instructor')}
                  className="flex items-center gap-2 text-slate-500 hover:text-ielts-blue font-bold text-sm transition-colors"
                >
                  <Settings size={18} />
                  Instructor Panel
                </button>
              )}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Candidate</div>
                  <div className="text-sm text-slate-900 font-bold">{user.name || user.email}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-ielts-blue font-bold border border-blue-100">
                  {user.name?.[0] || 'U'}
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <Play className="rotate-180" size={18} />
                </button>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-hidden">
            <StudentDashboard 
              user={user}
              practiceTasks={practiceTasks}
              userResults={userResults}
              readingTests={readingTests}
              listeningTests={listeningTests}
              writingTests={writingTests}
              speakingTests={speakingTests}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              newTaskDueDate={newTaskDueDate}
              setNewTaskDueDate={setNewTaskDueDate}
              handleAddTask={handleAddTask}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              isAddingTask={isAddingTask}
              startTest={startTest}
            />
          </div>
        </div>
      );
    }

    return (
      <LandingPage 
        onLoginClick={() => setView('login')} 
        onAuthSuccess={(userData) => {
          setUser(userData);
          fetchTests();
          fetchUserResults();
          setView('landing');
        }}
      />
    );
  }

  if (view === 'login') {
    if (user) {
      setView('landing');
      return null;
    }
    return (
      <Login 
        onBack={() => setView('landing')}
        onAuthSuccess={(userData) => {
          setUser(userData);
          fetchTests();
          fetchUserResults();
          setView('landing');
        }}
      />
    );
  }

  if (view === 'instructions') {
    const module = selectedCustomTest;
    if (!module) {
      setView('landing');
      return null;
    }
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-slate-50 rounded-[40px] p-12 border border-slate-200 shadow-2xl"
        >
          <h2 className="text-4xl font-black text-slate-900 mb-8">{module.title}</h2>
          <div className="space-y-6 text-slate-600 text-lg mb-10">
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-ielts-blue text-white flex items-center justify-center shrink-0 mt-1 text-xs font-bold">1</div>
              <p>You will have <strong>{module.duration} minutes</strong> to complete this module.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-ielts-blue text-white flex items-center justify-center shrink-0 mt-1 text-xs font-bold">2</div>
              <p>Answers are saved automatically. You can review them at any time before finishing.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-ielts-blue text-white flex items-center justify-center shrink-0 mt-1 text-xs font-bold">3</div>
              <p>Do not exit fullscreen mode. Exiting will be logged as a security violation.</p>
            </div>
          </div>
          <button 
            onClick={beginModule}
            className="w-full bg-ielts-blue text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-3"
          >
            I am ready to start <ChevronRight size={24} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (view === 'test') {
    const module = selectedCustomTest;
    if (!module) {
      setView('landing');
      return null;
    }
    const section = module.sections[currentSectionIndex];

    return (
      <div className="h-screen flex flex-col bg-white overflow-hidden select-none">
        <TestHeader userEmail={user?.email} onFinish={submitTest} />

        {/* Real IELTS Subheader */}
        <div className="bg-slate-50 border-b border-slate-200 py-3 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-ielts-blue font-black text-lg uppercase tracking-tight">{section.title}</div>
              <div className="h-4 w-px bg-slate-300" />
              {section.questions.length > 0 && (
                <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                  Questions {section.questions[0].id.replace('q', '')} - {section.questions[section.questions.length - 1].id.replace('q', '')}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={16} />
                <Timer duration={module.duration} onTimeUp={submitTest} />
              </div>
            </div>
          </div>
        </div>

        {/* Test Area */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeModule === 'listening' && (
            <div className="flex-1 flex flex-col relative">
              <div className="bg-slate-100 border-b border-slate-200 p-4">
                <AudioPlayer src={section.content} />
              </div>
              <ListeningTest 
                currentSectionIndex={currentSectionIndex} 
                answers={answers} 
                onAnswerChange={handleAnswerChange} 
              />
            </div>
          )}

          {activeModule === 'reading' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <ReadingTest />
            </div>
          )}

          {activeModule === 'writing' && (
            <>
              <div 
                className="passage-container ielts-scrollbar"
                style={{ width: `${passageWidth}%` }}
              >
                <div className="p-8">
                  <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      {selectedWritingTest 
                        ? (currentSectionIndex === 0 ? "Task 1: You should spend about 20 minutes on this task. Write at least 150 words." : "Task 2: You should spend about 40 minutes on this task. Write at least 250 words.")
                        : section.instruction}
                    </p>
                  </div>
                  <div className="mb-8">
                    <p className="text-slate-700 font-medium whitespace-pre-wrap">
                      {selectedWritingTest 
                        ? (currentSectionIndex === 0 ? selectedWritingTest.task1Prompt : selectedWritingTest.task2Prompt)
                        : section.content}
                    </p>
                  </div>
                </div>
              </div>
              <div 
                className="w-1 bg-slate-300 hover:bg-ielts-blue cursor-col-resize transition-colors z-10 flex items-center justify-center"
                onMouseDown={(e) => {
                  const startX = e.clientX;
                  const startWidth = passageWidth;
                  const onMouseMove = (moveEvent: MouseEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    const newWidth = startWidth + (deltaX / window.innerWidth) * 100;
                    setPassageWidth(Math.max(20, Math.min(80, newWidth)));
                  };
                  const onMouseUp = () => {
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                  };
                  window.addEventListener('mousemove', onMouseMove);
                  window.addEventListener('mouseup', onMouseUp);
                }}
              >
                <div className="h-8 w-px bg-slate-400" />
              </div>
              <div 
                className="questions-container ielts-scrollbar flex flex-col gap-4 p-8"
                style={{ width: `${100 - passageWidth}%` }}
              >
                <textarea 
                  className="flex-1 w-full p-6 bg-white border border-slate-300 rounded outline-none resize-none font-sans text-base leading-relaxed text-slate-700 shadow-sm"
                  placeholder="Type your answer here..."
                  value={answers[`writing_${section.id}`] || ''}
                  onChange={(e) => handleAnswerChange(`writing_${section.id}`, e.target.value)}
                />
                <div className="flex justify-end items-center text-xs text-slate-500 font-medium">
                  Words: {(answers[`writing_${section.id}`] || '').trim().split(/\s+/).filter(Boolean).length}
                </div>
              </div>
            </>
          )}

          {activeModule === 'speaking' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full bg-white rounded-[48px] p-12 shadow-2xl border border-slate-100 text-center"
              >
                <div className="mb-8">
                  <div className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                    Speaking Simulation
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">{section.title}</h3>
                  <div className="text-slate-500 text-lg leading-relaxed italic bg-slate-50 p-8 rounded-[32px] border border-slate-100 mb-8">
                    {section.instruction}
                  </div>
                  {section.content && (
                    <div className="text-slate-700 text-xl font-medium mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      {section.content}
                    </div>
                  )}
                </div>

                <div className="space-y-6 mb-12">
                  {section.questions?.map((q: any, idx: number) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                      <p className="text-slate-800 font-bold text-lg">{q}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-20" />
                    <div className="w-24 h-24 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-xl relative z-10">
                      <Mic size={32} />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xl font-black text-slate-900">Recording Active</p>
                    <p className="text-slate-400 text-sm font-medium">Your response is being captured for evaluation.</p>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => {
                        if (currentSectionIndex < module.sections.length - 1) {
                          setCurrentSectionIndex(currentSectionIndex + 1);
                        } else {
                          submitTest();
                        }
                      }}
                      className="flex-1 py-4 bg-ielts-blue text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg"
                    >
                      {currentSectionIndex < module.sections.length - 1 ? 'Next Section' : 'Finish Test'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Floating Navigation Arrows */}
          <div className="absolute bottom-6 right-6 flex gap-2 z-50">
            <button 
              disabled={currentSectionIndex === 0}
              onClick={() => setCurrentSectionIndex(prev => prev - 1)}
              className="ielts-nav-btn disabled:opacity-30"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              disabled={currentSectionIndex === module.sections.length - 1}
              onClick={() => setCurrentSectionIndex(prev => prev + 1)}
              className="ielts-nav-btn disabled:opacity-30"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </main>

        <TestFooter 
          sections={module.sections}
          currentSectionIndex={currentSectionIndex}
          onSectionChange={setCurrentSectionIndex}
          answers={answers}
          onFinish={submitTest}
        />

        {/* Warning Modal */}
        <AnimatePresence>
          {showWarning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[48px] p-12 max-w-md w-full shadow-2xl border border-rose-100 text-center"
              >
                <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <AlertTriangle size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Security Violation</h3>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  You have exited fullscreen mode. This incident has been logged. Please return to fullscreen immediately to avoid disqualification.
                </p>
                <button 
                  onClick={() => {
                    enterFullscreen();
                    setShowWarning(false);
                  }}
                  className="w-full bg-ielts-blue text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Maximize size={24} /> Return to Test
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (view === 'result') {
    const { score, total } = calculateScore();
    const band = getBandScore(score, total);

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-[48px] p-16 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-10 mx-auto">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Test Completed</h2>
          <p className="text-slate-400 font-bold mb-6 uppercase tracking-widest text-sm">{user?.displayName || user?.email}</p>
          <p className="text-slate-500 text-xl mb-12 leading-relaxed">
            Your responses have been securely submitted to Firebase. Here is your estimated performance.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Score</div>
              <div className="text-3xl font-black text-slate-800">{score} / {total}</div>
            </div>
            <div className="bg-ielts-blue/5 p-8 rounded-[32px] border border-ielts-blue/10">
              <div className="text-xs font-black text-ielts-blue uppercase tracking-widest mb-2">Estimated Band</div>
              <div className="text-4xl font-black text-ielts-blue">{band.toFixed(1)}</div>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('landing')}
              className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-lg"
            >
              Dashboard
            </button>
            <button 
              onClick={() => {
                // In a real app, this would toggle a review mode
                alert("Review mode: Correct answers are now highlighted in the test view.");
                setView('test');
              }}
              className="flex-1 bg-white border-2 border-slate-200 text-slate-600 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-lg"
            >
              Review Answers
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}

