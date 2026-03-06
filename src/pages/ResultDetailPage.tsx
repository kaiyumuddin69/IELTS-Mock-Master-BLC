import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BarChart3, 
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { testService } from '../services/api';
import { motion } from 'motion/react';

export default function ResultDetailPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await testService.getResultById(resultId!);
        setResult(data);
      } catch (error) {
        console.error("Failed to fetch result", error);
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId, navigate]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-ielts-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!result) return <div className="flex h-screen items-center justify-center">Result not found</div>;

  const { test, answers, score, bandScore, status, feedback } = result;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/student/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter">{test.title}</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test Result</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
              <Clock size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-600">Submitted {new Date(result.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm text-center"
            >
              <div className="w-24 h-24 bg-blue-50 text-ielts-blue rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <BarChart3 size={48} />
              </div>
              <div className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">{bandScore || 'N/A'}</div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Estimated Band Score</div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
                <div>
                  <div className="text-2xl font-black text-slate-900">{score || 0}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Raw Score</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{test.questions?.length || 0}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Questions</div>
                </div>
              </div>
            </motion.div>

            {feedback && (
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tighter">Instructor Feedback</h3>
                </div>
                <p className="text-slate-600 leading-relaxed italic">"{feedback}"</p>
              </div>
            )}
          </div>

          {/* Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-6">Question Breakdown</h2>
            
            <div className="space-y-4">
              {test.questions?.map((q: any, idx: number) => {
                const studentAnswer = answers[q.id];
                const isCorrect = studentAnswer === q.correctAnswers;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={q.id} 
                    className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-start gap-6"
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                      isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 mb-4">{q.structure.prompt}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Answer</div>
                          <div className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {studentAnswer || 'No Answer'}
                          </div>
                        </div>
                        <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Correct Answer</div>
                          <div className="font-bold text-emerald-700">
                            {q.correctAnswers}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      {isCorrect ? (
                        <CheckCircle2 className="text-emerald-500" size={24} />
                      ) : (
                        <XCircle className="text-rose-500" size={24} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
