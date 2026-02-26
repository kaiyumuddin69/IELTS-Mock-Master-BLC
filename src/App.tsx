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
  GraduationCap
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
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';

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
  const [view, setView] = useState<'landing' | 'instructions' | 'test' | 'result'>('landing');
  const [activeModule, setActiveModule] = useState<keyof typeof MOCK_TEST_DATA | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [passageWidth, setPassageWidth] = useState(50); // percentage
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userResults, setUserResults] = useState<any[]>([]);

  const fetchUserResults = async (userId: string) => {
    try {
      const q = query(
        collection(db, 'results'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserResults(results);
    } catch (e) {
      console.error("Error fetching results", e);
    }
  };
  
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
      if (currentUser) {
        fetchUserResults(currentUser.uid);
      } else {
        setUserResults([]);
      }
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
        // Refresh results
        fetchUserResults(user.uid);
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
        const opts = q.options || (q.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : []);
        
        return (
          <div key={q.id} id={`question-${q.id}`} className="mb-10 flex items-start gap-8 scroll-mt-24 group">
            <div className="w-8 h-8 flex items-center justify-center text-sm font-black bg-slate-100 text-slate-800 rounded-lg shrink-0 mt-0.5 group-hover:bg-ielts-blue group-hover:text-white transition-all">{q.id}</div>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-slate-900 mb-6 leading-relaxed">{q.question}</p>
              <div className="grid grid-cols-1 gap-3">
                {opts.map((opt, i) => (
                  <label key={opt} className={`flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${answers[q.id] === opt ? 'border-ielts-blue bg-blue-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answers[q.id] === opt ? 'border-ielts-blue' : 'border-slate-300'}`}>
                      {answers[q.id] === opt && <div className="w-2.5 h-2.5 bg-ielts-blue rounded-full" />}
                    </div>
                    <span className={`text-[15px] font-bold ${answers[q.id] === opt ? 'text-ielts-blue' : 'text-slate-600'}`}>
                      {opt}
                    </span>
                    <input 
                      type="radio" 
                      name={q.id} 
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 'form':
      case 'sentence':
        return (
          <div key={q.id} id={`question-${q.id}`} className="mb-8 flex items-start gap-8 scroll-mt-24 group">
            <div className="w-8 h-8 flex items-center justify-center text-sm font-black bg-slate-100 text-slate-800 rounded-lg shrink-0 mt-0.5 group-hover:bg-ielts-blue group-hover:text-white transition-all">{q.id}</div>
            <div className="flex-1 text-[16px] text-slate-900 font-bold flex items-center flex-wrap gap-x-3 leading-loose">
              {q.question.split('[___]').map((part, i, arr) => (
                <React.Fragment key={i}>
                  <span>{part}</span>
                  {i < arr.length - 1 && (
                    <input 
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="ielts-input w-56 h-10 text-center"
                      placeholder="..."
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      case 'matching':
        return (
          <div key={q.id} id={`question-${q.id}`} className="mb-8 flex items-start gap-6 scroll-mt-20 group">
            <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-slate-800 shrink-0 mt-1.5">{q.id}</div>
            <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200 group-hover:border-ielts-blue transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <p className="text-[15px] font-bold text-slate-900 leading-relaxed">{q.question}</p>
                <div className="relative min-w-[240px]">
                  <select 
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full h-11 pl-4 pr-10 bg-white border-2 border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-ielts-blue appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Select an option...</option>
                    {q.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
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
          <div className="flex items-center gap-3">
            <div className="ielts-logo-box px-2 py-1.5 text-xl">IELTS</div>
            <div className="h-6 w-px bg-slate-200" />
            <BLCLogo />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mock Master</span>
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[48px] overflow-hidden max-w-4xl w-full shadow-premium flex flex-col md:flex-row relative"
              >
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors z-20"
                >
                  <X size={28} />
                </button>

                {/* Left Side: Branding/Info */}
                <div className="md:w-5/12 bg-ielts-blue p-12 text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="ielts-logo-box px-3 py-1 text-2xl shadow-lg">IELTS</div>
                      <BLCLogo className="brightness-0 invert" />
                    </div>
                    <h3 className="text-4xl font-black mb-4 leading-tight">Master Your IELTS Journey</h3>
                    <p className="text-blue-100 text-lg font-medium opacity-80">Join thousands of candidates achieving their dream scores with our authentic simulation platform.</p>
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center"><CheckCircle size={12} /></div>
                      Authentic Exam Interface
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center"><CheckCircle size={12} /></div>
                      Real-time Performance Analysis
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center"><CheckCircle size={12} /></div>
                      Secure Cloud Progress Tracking
                    </div>
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-7/12 p-12 md:p-16 bg-white">
                  <div className="max-w-md mx-auto">
                    <div className="mb-10">
                      <h3 className="text-3xl font-black text-slate-900 mb-2">
                        {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                      </h3>
                      <p className="text-slate-500 font-medium">
                        {authMode === 'login' ? 'Sign in to access your practice history' : 'Start your journey to a Band 9.0'}
                      </p>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-5">
                      {authMode === 'signup' && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-ielts-blue/30 outline-none transition-all font-medium text-slate-700"
                            placeholder="e.g. John Smith"
                          />
                        </motion.div>
                      )}
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-ielts-blue/30 outline-none transition-all font-medium text-slate-700"
                          placeholder="name@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-ielts-blue/30 outline-none transition-all font-medium text-slate-700"
                          placeholder="••••••••"
                        />
                      </div>

                      {authError && (
                        <motion.p 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-rose-500 text-xs font-bold text-center bg-rose-50 p-4 rounded-2xl border border-rose-100"
                        >
                          {authError}
                        </motion.p>
                      )}

                      <button 
                        type="submit"
                        className="w-full bg-ielts-blue text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 mt-4 active:scale-[0.98]"
                      >
                        {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                      </button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                      <div className="h-px bg-slate-100 flex-1" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR CONTINUE WITH</span>
                      <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    <button 
                      onClick={loginWithGoogle}
                      className="w-full mt-6 flex items-center justify-center gap-4 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                      Google Account
                    </button>

                    <p className="text-center mt-10 text-sm font-medium text-slate-500">
                      {authMode === 'login' ? "New to IELTS BLC?" : "Already have an account?"}
                      <button 
                        onClick={() => {
                          setAuthMode(authMode === 'login' ? 'signup' : 'login');
                          setAuthError('');
                        }}
                        className="ml-2 text-ielts-blue font-black hover:underline"
                      >
                        {authMode === 'login' ? 'Create Account' : 'Sign In'}
                      </button>
                    </p>
                  </div>
                </div>
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
            <h2 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {user ? `Welcome back, ${user.displayName?.split(' ')[0] || 'Candidate'}` : 'Master Your IELTS Journey'}
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
              {user 
                ? "Ready to continue your practice? Pick a module below to start improving your score."
                : "Experience the most authentic computer-delivered IELTS environment with real-time feedback."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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

          {user && userResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-slate-900">Your Practice History</h3>
                <div className="px-4 py-1.5 bg-ielts-blue/10 text-ielts-blue rounded-full text-xs font-black uppercase tracking-widest">
                  {userResults.length} Tests Completed
                </div>
              </div>
              <div className="grid gap-4">
                {userResults.map((res, idx) => (
                  <motion.div 
                    key={res.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-ielts-blue/30 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${
                        res.module === 'listening' ? 'bg-blue-600' :
                        res.module === 'reading' ? 'bg-emerald-600' :
                        res.module === 'writing' ? 'bg-amber-600' : 'bg-rose-600'
                      }`}>
                        {res.module === 'listening' ? <Headphones size={20} /> :
                         res.module === 'reading' ? <BookOpen size={20} /> :
                         res.module === 'writing' ? <PenTool size={20} /> : <Mic size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 capitalize">{res.module} Practice</h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {res.timestamp?.toDate ? new Date(res.timestamp.toDate()).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</div>
                        <div className="text-xl font-black text-slate-800">{res.score} / {res.total}</div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="text-[10px] font-black text-ielts-blue uppercase tracking-widest mb-1">Band</div>
                        <div className="text-2xl font-black text-ielts-blue">{getBandScore(res.score, res.total).toFixed(1)}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
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

    // Calculate total questions across all sections
    let totalQuestionsCount = 0;
    module.sections.forEach(s => totalQuestionsCount += s.questions.length);

    // Get all questions in a flat array for navigation
    const allQuestions: Question[] = [];
    module.sections.forEach(s => allQuestions.push(...s.questions));

    return (
      <div className="h-screen flex flex-col bg-white overflow-hidden select-none">
        {/* Real IELTS Header */}
        <header className="ielts-test-header !h-16 border-b-2 border-slate-200">
          <div className="flex items-center gap-6">
            <div className="ielts-logo-box px-3 py-1 text-lg rounded-md">IELTS</div>
            <BLCLogo />
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Test taker ID: <span className="text-slate-900 ml-1">{user?.email || 'user@gmail.com'}</span>
            </div>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 bg-slate-50 px-6 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Timer duration={module.duration} onTimeUp={submitTest} />
          </div>

          <div className="flex items-center gap-4">
            {activeModule === 'listening' && (
              <div className="flex items-center gap-3 mr-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <Volume2 size={18} className="text-slate-600" />
                <div className="w-24 h-1.5 bg-slate-200 rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-2/3 bg-ielts-blue rounded-full" />
                </div>
              </div>
            )}
            <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <Menu size={22} className="text-slate-700" />
            </button>
            <button 
              onClick={submitTest}
              className="bg-ielts-blue text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              Submit
            </button>
          </div>
        </header>

        {/* Real IELTS Subheader */}
        <div className="bg-slate-100 border-b border-slate-300 py-6">
          <div className="max-w-7xl mx-auto w-full px-8">
            <div className="flex items-baseline gap-4 mb-2">
              <div className="text-ielts-blue font-black text-2xl uppercase tracking-tight">{section.title}</div>
              <div className="h-4 w-px bg-slate-300" />
              <div className="text-slate-500 font-bold text-sm uppercase tracking-widest">Questions {section.questions[0].id} - {section.questions[section.questions.length - 1].id}</div>
            </div>
            <div className="text-slate-700 text-[15px] font-medium leading-relaxed max-w-4xl">{section.instruction}</div>
          </div>
        </div>

        {/* Test Area */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeModule === 'listening' && (
            <div className="flex-1 flex flex-col relative">
              <AudioPlayer src={section.content} />
              <div className="flex-1 overflow-y-auto ielts-scrollbar bg-white">
                <div className="max-w-4xl mx-auto px-12 py-12">
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
                className="questions-container ielts-scrollbar !p-0"
                style={{ width: `${100 - passageWidth}%` }}
              >
                <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-8 py-3 z-20">
                  <h3 className="text-sm font-bold text-slate-800">Questions {section.questions[0].id} - {section.questions[section.questions.length - 1].id}</h3>
                </div>
                <div className="p-8">
                  {section.questions.map(renderQuestion)}
                </div>
              </div>
            </>
          )}

          {activeModule === 'writing' && (
            <>
              <div 
                className="passage-container ielts-scrollbar"
                style={{ width: `${passageWidth}%` }}
              >
                <div className="mb-8">
                  <p className="text-slate-700 font-medium whitespace-pre-wrap">{section.content}</p>
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
                className="questions-container ielts-scrollbar flex flex-col gap-4"
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

        {/* Real IELTS Footer */}
        <footer className="h-24 bg-white border-t-2 border-slate-200 flex flex-col">
          <div className="flex border-b border-slate-100 h-10 overflow-x-auto ielts-scrollbar">
            {module.sections.map((s, sIdx) => {
              const answeredCount = s.questions.filter(q => answers[q.id]).length;
              const isCurrent = currentSectionIndex === sIdx;
              return (
                <button 
                  key={sIdx}
                  onClick={() => setCurrentSectionIndex(sIdx)}
                  className={`px-8 h-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 border-r border-slate-100 transition-all whitespace-nowrap ${isCurrent ? 'bg-ielts-blue text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                >
                  {s.title}
                  <span className={`px-2 py-0.5 rounded-full text-[9px] ${isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {answeredCount}/{s.questions.length}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex-1 flex items-center justify-between px-6">
            <div className="flex items-center gap-1 overflow-x-auto ielts-scrollbar py-2">
              {allQuestions.map((q) => {
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                const isCurrentSection = section.questions.some(sq => sq.id === q.id);
                
                return (
                  <button 
                    key={q.id}
                    onClick={() => {
                      const sIdx = module.sections.findIndex(s => s.questions.some(sq => sq.id === q.id));
                      setCurrentSectionIndex(sIdx);
                      setTimeout(() => {
                        const el = document.getElementById(`question-${q.id}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                    className={`w-9 h-9 flex items-center justify-center text-[11px] font-bold rounded-md transition-all border-2 ${
                      isAnswered 
                        ? 'bg-slate-800 border-slate-800 text-white' 
                        : isCurrentSection 
                          ? 'border-ielts-blue text-ielts-blue bg-blue-50' 
                          : 'border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <button 
                disabled={currentSectionIndex === 0}
                onClick={() => setCurrentSectionIndex(prev => prev - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-400 hover:border-ielts-blue hover:text-ielts-blue disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={currentSectionIndex === module.sections.length - 1}
                onClick={() => setCurrentSectionIndex(prev => prev + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-400 hover:border-ielts-blue hover:text-ielts-blue disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
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

