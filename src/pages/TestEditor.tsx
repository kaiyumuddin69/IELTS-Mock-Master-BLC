import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  BookOpen, 
  Headphones, 
  PenTool,
  ChevronDown,
  Layout,
  Type,
  CheckCircle2
} from 'lucide-react';
import { testService } from '../services/api';

export default function TestEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('READING');
  const [duration, setDuration] = useState(60);
  const [content, setContent] = useState<any>({ passages: [{ title: '', text: '' }] });
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'MCQ',
      order: questions.length + 1,
      structure: { prompt: '', options: ['', '', '', ''] },
      correctAnswers: ''
    }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this would call an admin create test endpoint
      console.log({ title, type, duration, content, questions });
      alert("Test created successfully (Demo)");
      navigate('/admin');
    } catch (error) {
      console.error("Failed to save test", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">Create New Test</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">
            Save Draft
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-ielts-blue text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Publishing...' : 'Publish Test'}
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Test Settings & Content */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 tracking-tighter mb-6">Test Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Test Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all"
                    placeholder="e.g. Academic Reading Practice 1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Module</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all appearance-none"
                    >
                      <option value="READING">Reading</option>
                      <option value="LISTENING">Listening</option>
                      <option value="WRITING">Writing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Duration (min)</label>
                    <input 
                      type="number" 
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 tracking-tighter mb-6">Passage / Audio</h2>
              
              {type === 'READING' && (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all"
                    placeholder="Passage Title"
                  />
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all h-64 resize-none"
                    placeholder="Paste passage text here..."
                  />
                </div>
              )}

              {type === 'LISTENING' && (
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] text-center">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Headphones size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Upload Audio File</p>
                  <p className="text-xs text-slate-400 mb-4">MP3 or WAV up to 50MB</p>
                  <button className="text-ielts-blue text-xs font-bold hover:underline">Browse Files</button>
                </div>
              )}

              {type === 'WRITING' && (
                <div className="space-y-4">
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all h-64 resize-none"
                    placeholder="Enter writing task prompt..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Question Builder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Questions ({questions.length})</h2>
              <button 
                onClick={addQuestion}
                className="bg-white border border-slate-200 text-slate-900 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-200 p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Layout size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Questions Yet</h3>
                <p className="text-slate-500 mb-8">Start building your test by adding questions.</p>
                <button 
                  onClick={addQuestion}
                  className="bg-ielts-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                >
                  Add First Question
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={q.id} 
                    className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative group"
                  >
                    <button 
                      onClick={() => removeQuestion(q.id)}
                      className="absolute top-8 right-8 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="flex items-start gap-6">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shrink-0">
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Question Type</label>
                            <select 
                              value={q.type}
                              onChange={(e) => updateQuestion(q.id, { type: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all appearance-none"
                            >
                              <option value="MCQ">Multiple Choice</option>
                              <option value="FILL_GAPS">Fill in the Gaps</option>
                              <option value="TRUE_FALSE">True / False / Not Given</option>
                              <option value="MATCHING">Matching</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Correct Answer</label>
                            <input 
                              type="text" 
                              value={q.correctAnswers}
                              onChange={(e) => updateQuestion(q.id, { correctAnswers: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all"
                              placeholder="e.g. A or government"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Question Prompt</label>
                          <textarea 
                            value={q.structure.prompt}
                            onChange={(e) => updateQuestion(q.id, { structure: { ...q.structure, prompt: e.target.value } })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-ielts-blue transition-all h-24 resize-none"
                            placeholder="Enter the question text..."
                          />
                        </div>

                        {q.type === 'MCQ' && (
                          <div className="grid grid-cols-2 gap-4">
                            {q.structure.options.map((opt: string, optIdx: number) => (
                              <div key={optIdx}>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Option {String.fromCharCode(65 + optIdx)}</label>
                                <input 
                                  type="text" 
                                  value={opt}
                                  onChange={(e) => {
                                    const newOptions = [...q.structure.options];
                                    newOptions[optIdx] = e.target.value;
                                    updateQuestion(q.id, { structure: { ...q.structure, options: newOptions } });
                                  }}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-ielts-blue transition-all"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
