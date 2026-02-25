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
  Save,
  Maximize,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_TEST_DATA, TestModule, Question } from './types';
import { auth, db } from './services/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Components ---

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
    <div className="flex items-center gap-2 px-4 py-2 bg-ielts-blue text-white rounded-md font-mono font-bold">
      <Clock size={18} />
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
};

const AudioPlayer = ({ src, onEnded }: { src: string; onEnded?: () => void }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (hasPlayed && !isPlaying) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        setHasPlayed(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-xl bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-4 shadow-lg z-50">
      <button 
        onClick={togglePlay}
        disabled={hasPlayed && !isPlaying}
        className={`p-2 rounded-full ${hasPlayed && !isPlaying ? 'bg-slate-200 text-slate-400' : 'bg-ielts-blue text-white hover:bg-blue-700'} transition-colors`}
      >
        {isPlaying ? <Volume2 size={18} /> : <Play size={18} />}
      </button>
      <div className="text-xs font-mono text-slate-500 min-w-[35px]">{formatTime(currentTime)}</div>
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-ielts-blue transition-all duration-100" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs font-mono text-slate-500 min-w-[35px]">{formatTime(duration)}</div>
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
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
  const [view, setView] = useState<'landing' | 'instructions' | 'test' | 'result'>('landing');
  const [activeModule, setActiveModule] = useState<keyof typeof MOCK_TEST_DATA | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [passageWidth, setPassageWidth] = useState(50); // percentage
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && view === 'test') {
        setShowWarning(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [view]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => signOut(auth);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch(e => console.error(e));
  };

  const startTest = (moduleKey: keyof typeof MOCK_TEST_DATA) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setActiveModule(moduleKey);
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
    
    if (user && activeModule) {
      try {
        const testId = MOCK_TEST_DATA[activeModule].id;
        const resultRef = collection(db, 'results');
        await addDoc(resultRef, {
          userId: user.uid,
          userEmail: user.email,
          testId,
          module: activeModule,
          answers,
          score: calculateScore().score,
          total: calculateScore().total,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.error("Failed to save to Firebase", e);
      }
    }

    setView('result');
  };

  const calculateScore = () => {
    if (!activeModule) return { score: 0, total: 0 };
    const module = MOCK_TEST_DATA[activeModule];
    let score = 0;
    let total = 0;

    module.sections.forEach(section => {
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
    
    switch (q.type) {
      case 'mcq':
      case 'tfng':
        const opts = q.type === 'tfng' ? ['YES', 'NO', 'NOT GIVEN'] : (q.options || []);
        return (
          <div key={q.id} className="mb-8 group">
            <div className="flex gap-4 items-start">
              <div className={`w-8 h-8 rounded border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isAnswered ? 'bg-slate-100 border-slate-300 text-slate-600' : 'border-ielts-blue text-ielts-blue'}`}>
                {q.id}
              </div>
              <div className="flex-1">
                <p className="font-medium mb-4 text-slate-800">{q.question}</p>
                <div className="space-y-3">
                  {opts.map(opt => (
                    <label key={opt} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-4 h-4 text-ielts-blue"
                      />
                      <span className="text-sm font-medium text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'form':
      case 'sentence':
        return (
          <div key={q.id} className="mb-8 group">
            <div className="flex gap-4 items-start">
              <div className={`w-8 h-8 rounded border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${isAnswered ? 'bg-slate-100 border-slate-300 text-slate-600' : 'border-ielts-blue text-ielts-blue'}`}>
                {q.id}
              </div>
              <div className="flex-1">
                <p className="font-medium mb-3 text-slate-800">
                  {q.question.split('[___]').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <input 
                          type="text"
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="mx-2 px-2 py-1 border-b-2 border-slate-300 focus:border-ielts-blue outline-none transition-colors w-32 text-center font-bold text-ielts-blue"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
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

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-ielts-blue rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">I</div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">IELTS Mock Master BLC</h1>
          </div>
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Candidate</div>
                  <div className="text-sm text-slate-700 font-semibold">{user.displayName || user.email}</div>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
                ) : (
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <Mic size={20} />
                  </div>
                )}
                <button 
                  onClick={logout}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-ielts-blue text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-sm"
              >
                Login / Signup
              </button>
            )}
          </div>
        </header>

        {/* Auth Modal */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-slate-100 relative"
              >
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-slate-900 mb-2">
                    {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {authMode === 'login' ? 'Sign in to continue your practice' : 'Start your IELTS journey today'}
                  </p>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>

                  {authError && (
                    <p className="text-rose-500 text-xs font-bold text-center bg-rose-50 p-3 rounded-xl border border-rose-100">
                      {authError}
                    </p>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-ielts-blue text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-100 mt-2"
                  >
                    {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                </form>

                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">OR</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>

                <button 
                  onClick={loginWithGoogle}
                  className="w-full mt-6 flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                  Continue with Google
                </button>

                <p className="text-center mt-8 text-sm font-medium text-slate-500">
                  {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="ml-2 text-ielts-blue font-black hover:underline"
                  >
                    {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 max-w-6xl mx-auto w-full p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h2 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Master Your IELTS Journey</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">Experience the most authentic computer-delivered IELTS environment with real-time feedback.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 'listening', icon: <Headphones />, title: 'Listening', color: 'bg-blue-600', desc: '30 mins • 40 questions' },
              { id: 'reading', icon: <BookOpen />, title: 'Reading', color: 'bg-emerald-600', desc: '60 mins • 40 questions' },
              { id: 'writing', icon: <PenTool />, title: 'Writing', color: 'bg-amber-600', desc: '60 mins • 2 tasks' },
              { id: 'speaking', icon: <Mic />, title: 'Speaking', color: 'bg-rose-600', desc: '15 mins • 3 parts' },
            ].map((module, idx) => (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => startTest(module.id as any)}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left flex flex-col gap-6 hover:shadow-xl transition-all group"
              >
                <div className={`${module.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform`}>
                  {module.icon}
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-slate-800 mb-1">{module.title}</h3>
                  <p className="text-sm font-medium text-slate-400">{module.desc}</p>
                </div>
                <div className="mt-auto flex items-center text-ielts-blue font-bold text-sm group-hover:gap-3 transition-all">
                  Start Practice <ChevronRight size={18} />
                </div>
              </motion.button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (view === 'instructions') {
    const module = MOCK_TEST_DATA[activeModule!];
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
    const module = MOCK_TEST_DATA[activeModule!];
    const section = module.sections[currentSectionIndex];

    return (
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center z-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ielts-blue rounded flex items-center justify-center text-white font-bold">I</div>
              <h2 className="font-bold text-slate-800 tracking-tight">{module.title}</h2>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {section.title}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Candidate</div>
              <div className="text-xs text-slate-700 font-semibold">{user?.displayName || user?.email}</div>
            </div>
            <Timer duration={module.duration} onTimeUp={submitTest} />
            <button 
              onClick={submitTest}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-sm"
            >
              Finish Test
            </button>
          </div>
        </header>

        {/* Test Area */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeModule === 'listening' && (
            <div className="flex-1 flex flex-col pt-12">
              <AudioPlayer src={section.content} />
              <div className="flex-1 overflow-y-auto p-12 ielts-scrollbar">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-10 p-6 bg-ielts-light-blue rounded-2xl border border-blue-100">
                    <p className="font-bold text-ielts-blue uppercase tracking-widest text-xs mb-2">Instructions</p>
                    <p className="text-slate-700 font-medium">{section.instruction}</p>
                  </div>
                  {section.questions.map(renderQuestion)}
                </div>
              </div>
            </div>
          )}

          {activeModule === 'reading' && (
            <>
              <div 
                className="passage-container ielts-scrollbar"
                style={{ width: `${passageWidth}%` }}
              >
                <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600" dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
              <div 
                className="w-1.5 bg-slate-200 hover:bg-ielts-blue cursor-col-resize transition-colors z-10"
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
              />
              <div 
                className="questions-container ielts-scrollbar"
                style={{ width: `${100 - passageWidth}%` }}
              >
                <div className="mb-10 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-2">Instructions</p>
                  <p className="text-slate-700 font-medium">{section.instruction}</p>
                </div>
                {section.questions.map(renderQuestion)}
              </div>
            </>
          )}

          {activeModule === 'writing' && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex overflow-hidden">
                <div className="w-1/2 p-12 overflow-y-auto ielts-scrollbar border-r border-slate-100">
                  <div className="mb-8 p-6 bg-ielts-light-blue rounded-2xl border border-blue-100">
                    <p className="font-bold text-ielts-blue uppercase tracking-widest text-xs mb-2">Task Instructions</p>
                    <p className="text-slate-700 font-medium">{section.instruction}</p>
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900 mb-6">Question Prompt</h3>
                  <p className="text-slate-600 text-lg leading-relaxed bg-slate-50 p-8 rounded-3xl border border-slate-200 italic">
                    {section.content}
                  </p>
                </div>
                <div className="w-1/2 p-12 flex flex-col gap-6 bg-slate-50">
                  <textarea 
                    className="flex-1 w-full p-10 bg-white border border-slate-200 rounded-[32px] shadow-inner focus:ring-4 focus:ring-blue-100 outline-none resize-none font-sans text-xl leading-relaxed text-slate-700"
                    placeholder="Start typing your response here..."
                    value={answers[`writing_${section.id}`] || ''}
                    onChange={(e) => handleAnswerChange(`writing_${section.id}`, e.target.value)}
                  />
                  <div className="flex justify-between items-center px-6">
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-slate-200 rounded-full text-xs font-bold text-slate-600 uppercase tracking-widest">
                        Words: {(answers[`writing_${section.id}`] || '').trim().split(/\s+/).filter(Boolean).length}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                      <Save size={14} /> Auto-saved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'speaking' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full bg-white rounded-[48px] p-16 shadow-2xl border border-slate-100 text-center"
              >
                <div className="mb-12">
                  <div className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                    Live Simulation
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-6">Speaking Module</h3>
                  <p className="text-slate-500 text-xl leading-relaxed italic bg-slate-50 p-10 rounded-[32px] border border-slate-100">
                    "{section.content}"
                  </p>
                </div>

                <div className="flex flex-col items-center gap-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-20" />
                    <div className="w-32 h-32 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-xl relative z-10">
                      <Mic size={48} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-black text-slate-900">Recording Active</p>
                    <p className="text-slate-400 font-medium">Your response is being captured for evaluation.</p>
                  </div>

                  <div className="flex gap-6">
                    <button className="px-10 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-black hover:bg-slate-50 transition-all">
                      Pause
                    </button>
                    <button 
                      onClick={() => setCurrentSectionIndex(prev => Math.min(prev + 1, module.sections.length - 1))}
                      className="px-10 py-4 rounded-2xl bg-ielts-blue text-white font-black hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
                    >
                      Next Part
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </main>

        {/* Footer Navigation */}
        <footer className="h-20 bg-white border-t border-slate-200 px-8 flex justify-between items-center z-50">
          <div className="flex items-center gap-4 h-full">
            {module.sections.map((s, idx) => {
              const totalQs = s.questions.length;
              const answeredQs = s.questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== '').length;
              
              return (
                <div key={idx} className="flex items-center h-full group">
                  <button
                    onClick={() => setCurrentSectionIndex(idx)}
                    className={`flex flex-col justify-center px-6 h-full transition-all relative ${
                      currentSectionIndex === idx 
                        ? 'bg-slate-50' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-black ${currentSectionIndex === idx ? 'text-ielts-blue' : 'text-slate-400'}`}>
                        {s.title}
                      </span>
                      {totalQs > 0 && (
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                          {answeredQs}/{totalQs}
                        </span>
                      )}
                    </div>
                    {currentSectionIndex === idx && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute top-0 left-0 right-0 h-1 bg-ielts-blue"
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button 
              disabled={currentSectionIndex === 0}
              onClick={() => setCurrentSectionIndex(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-100 bg-white text-slate-500 font-bold text-sm disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={20} /> Previous
            </button>
            <button 
              disabled={currentSectionIndex === module.sections.length - 1}
              onClick={() => setCurrentSectionIndex(prev => prev + 1)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-ielts-blue text-white font-bold text-sm disabled:opacity-30 hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-100"
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        </footer>

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

