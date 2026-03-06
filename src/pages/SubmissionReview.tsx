import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  FileText, 
  Clock, 
  CheckCircle2,
  MessageSquare,
  BarChart3,
  PenTool,
  Info,
  Award,
  Target,
  AlertCircle
} from 'lucide-react';
import { testService } from '../services/api';
import { motion } from 'motion/react';

export default function SubmissionReview() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState('');
  const [bandScore, setBandScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await testService.getResultById(resultId!);
        setResult(data);
        setScore(data.score?.toString() || '');
        setBandScore(data.bandScore?.toString() || '');
        setFeedback(data.feedback || '');
      } catch (error) {
        console.error("Failed to fetch submission", error);
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [resultId, navigate]);

  const handleSave = async () => {
    if (!bandScore || parseFloat(bandScore) < 0 || parseFloat(bandScore) > 9) {
      alert("Please enter a valid band score (0-9)");
      return;
    }

    setSaving(true);
    try {
      await testService.updateSubmission(resultId!, {
        score: parseFloat(score) || 0,
        bandScore: parseFloat(bandScore),
        feedback,
        status: 'COMPLETED'
      });
      navigate('/admin');
    } catch (error) {
      console.error("Failed to update submission", error);
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-ielts-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Submission...</p>
      </div>
    </div>
  );

  if (!result) return <div className="flex h-screen items-center justify-center">Submission not found</div>;

  const { test, student, answers } = result;
  const wordCount = (answers.writing_response || '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-ielts-blue">
      {/* Header */}
      <header className="h-24 bg-white border-b border-slate-200 px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('/admin')}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
          >
            <ArrowLeft size={20} className="text-slate-400 group-hover:text-slate-900" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Review Submission</h1>
              <span className="px-3 py-1 bg-blue-50 text-ielts-blue text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">{test.type}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.name} • {test.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-50 uppercase tracking-widest transition-all">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-slate-900 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-ielts-blue transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Publish Review'}
          </button>
        </div>
      </header>

      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Student Response */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-ielts-blue rounded-2xl flex items-center justify-center">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Student Response</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted on {new Date(result.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {test.type === 'WRITING' && (
                  <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Word Count</p>
                    <p className={`text-xl font-black tracking-tighter ${wordCount < 250 ? 'text-rose-500' : 'text-emerald-500'}`}>{wordCount} Words</p>
                  </div>
                )}
              </div>

              {test.type === 'WRITING' ? (
                <div className="space-y-10">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Info size={64} />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target size={14} />
                      Task Prompt
                    </h3>
                    <p className="text-slate-700 font-medium leading-relaxed text-lg italic">"{test.content.prompt}"</p>
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <PenTool size={14} />
                      Student Essay
                    </h3>
                    <div className="bg-white border-2 border-slate-100 p-10 rounded-[40px] text-xl leading-[1.8] text-slate-700 whitespace-pre-wrap shadow-inner min-h-[500px] font-serif">
                      {answers.writing_response || 'No response provided.'}
                    </div>
                  </div>

                  {wordCount < 250 && (
                    <div className="flex items-center gap-3 p-6 bg-rose-50 rounded-3xl border border-rose-100 text-rose-600">
                      <AlertCircle size={20} />
                      <p className="text-xs font-black uppercase tracking-widest">Warning: Response is under the 250-word requirement.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {test.questions?.map((q: any, idx: number) => (
                    <div key={q.id} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                      <div className="flex items-start gap-6">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-slate-900 mb-4 text-lg tracking-tight">{q.structure.prompt}</p>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-2xl border border-slate-100">
                              <span className="text-slate-400 font-black uppercase tracking-widest text-[9px] block mb-1">Student Answer</span>
                              <span className={`font-black text-lg ${answers[q.id] === q.correctAnswers ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {answers[q.id] || 'N/A'}
                              </span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100">
                              <span className="text-slate-400 font-black uppercase tracking-widest text-[9px] block mb-1">Correct Answer</span>
                              <span className="font-black text-lg text-slate-900">{q.correctAnswers}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Grading Panel */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm sticky top-32"
            >
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Grading Panel</h2>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Raw Score</label>
                    <div className="relative">
                      <BarChart3 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number" 
                        step="0.5"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[24px] pl-14 pr-6 py-5 outline-none focus:border-ielts-blue transition-all font-black text-xl"
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Band Score</label>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number" 
                        step="0.5"
                        max="9"
                        min="0"
                        value={bandScore}
                        onChange={(e) => setBandScore(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[24px] pl-14 pr-6 py-5 outline-none focus:border-ielts-blue transition-all font-black text-xl text-ielts-blue"
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Detailed Feedback</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-5 top-6 text-slate-300" size={18} />
                    <textarea 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[32px] pl-14 pr-8 py-6 outline-none focus:border-ielts-blue transition-all h-64 resize-none font-medium text-slate-700 leading-relaxed"
                      placeholder="Provide constructive feedback to the student..."
                    />
                  </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden">
                  <h4 className="text-[10px] font-black text-ielts-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info size={14} />
                    IELTS Grading Criteria
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-4 font-bold">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-ielts-blue rounded-full" />
                      Task Response & Achievement
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-ielts-blue rounded-full" />
                      Coherence & Cohesion
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-ielts-blue rounded-full" />
                      Lexical Resource (Vocabulary)
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-ielts-blue rounded-full" />
                      Grammatical Range & Accuracy
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
