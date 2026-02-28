import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Plus,
  TrendingUp,
  Star,
  ClipboardCheck,
  Calendar
} from 'lucide-react';
import { TestModule, WritingTest } from '../../types';

interface StudentDashboardProps {
  user: any;
  practiceTasks: any[];
  readingTests: TestModule[];
  listeningTests: TestModule[];
  writingTests: WritingTest[];
  speakingTests: any[];
  newTaskTitle: string;
  setNewTaskTitle: (val: string) => void;
  newTaskDueDate: string;
  setNewTaskDueDate: (val: string) => void;
  handleAddTask: (e: React.FormEvent) => void;
  toggleTask: (id: string, completed: boolean) => void;
  deleteTask: (id: string) => void;
  isAddingTask: boolean;
  startTest: (type: string, test: any) => void;
}

export default function StudentDashboard({
  user,
  practiceTasks,
  readingTests,
  listeningTests,
  writingTests,
  speakingTests,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDueDate,
  setNewTaskDueDate,
  handleAddTask,
  toggleTask,
  deleteTask,
  isAddingTask,
  startTest
}: StudentDashboardProps) {
  return (
    <div className="max-w-7xl mx-auto w-full p-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex justify-between items-end"
      >
        <div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Welcome back, {user.displayName?.split(' ')[0] || 'Candidate'}
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl leading-relaxed">
            Your IELTS journey is progressing well. You have {practiceTasks.filter(t => !t.completed).length} goals to complete today.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Band</div>
              <div className="text-xl font-black text-slate-900">6.5</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Tests */}
        <div className="lg:col-span-2 space-y-16">
          {/* Reading Tests */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Reading Modules</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {readingTests.map(test => (
                <TestCard key={test.id} test={test} type="reading" onStart={() => startTest('reading', test)} />
              ))}
            </div>
          </section>

          {/* Listening Tests */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Headphones size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Listening Modules</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {listeningTests.map(test => (
                <TestCard key={test.id} test={test} type="listening" onStart={() => startTest('listening', test)} />
              ))}
            </div>
          </section>

          {/* Writing Tests */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <PenTool size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Writing Modules</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {writingTests.map(test => (
                <TestCard key={test.id} test={test} type="writing" onStart={() => startTest('writing', test)} />
              ))}
            </div>
          </section>

          {/* Speaking Tests */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                  <Mic size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Speaking Modules</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {speakingTests.map(test => (
                <TestCard key={test.id} test={test} type="speaking" onStart={() => startTest('speaking', test)} />
              ))}
              {speakingTests.length === 0 && (
                <TestCard 
                  test={{ id: 'speaking-demo', title: 'Speaking Practice Test 1', duration: 15 }} 
                  type="speaking" 
                  onStart={() => startTest('speaking', { id: 'speaking-demo', title: 'Speaking Practice Test 1', duration: 15 })} 
                />
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-12">
          {/* Practice Goals */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900">Practice Goals</h3>
              <Calendar className="text-slate-300" size={20} />
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 mb-8">
              <input 
                required
                type="text" 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="New goal..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-ielts-blue transition-all font-medium text-sm"
              />
              <div className="flex gap-2">
                <input 
                  required
                  type="date" 
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-ielts-blue transition-all font-medium text-sm"
                />
                <button 
                  disabled={isAddingTask}
                  type="submit"
                  className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  <Plus size={24} />
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {practiceTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-slate-100 group">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleTask(task.id, task.completed)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}
                    >
                      {task.completed && <CheckCircle size={14} />}
                    </button>
                    <div>
                      <p className={`font-bold text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                        Due: {task.dueDate}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {practiceTasks.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-medium italic text-sm">
                  No goals set yet.
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="bg-ielts-blue p-8 rounded-[40px] text-white shadow-xl shadow-blue-200/50">
            <h3 className="text-xl font-black mb-6">Exam Readiness</h3>
            <div className="space-y-6">
              <StatRow label="Vocabulary" value={75} />
              <StatRow label="Grammar" value={60} />
              <StatRow label="Speed" value={90} />
            </div>
            <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestCard({ test, type, onStart }: { test: any, type: string, onStart: () => void }) {
  const colors = {
    reading: 'bg-emerald-50 text-emerald-600',
    listening: 'bg-blue-50 text-blue-600',
    writing: 'bg-purple-50 text-purple-600',
    speaking: 'bg-rose-50 text-rose-600'
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col gap-6 group">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 ${colors[type as keyof typeof colors]} rounded-2xl flex items-center justify-center`}>
          {type === 'reading' && <BookOpen size={24} />}
          {type === 'listening' && <Headphones size={24} />}
          {type === 'writing' && <PenTool size={24} />}
          {type === 'speaking' && <Mic size={24} />}
        </div>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{type}</span>
      </div>
      <div>
        <h4 className="font-black text-xl text-slate-900 mb-2 group-hover:text-ielts-blue transition-colors">{test.title}</h4>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><Clock size={14} /> {test.duration} mins</div>
          <div className="flex items-center gap-1.5"><ClipboardCheck size={14} /> 40 Questions</div>
        </div>
      </div>
      <button 
        onClick={onStart}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-ielts-blue transition-all shadow-lg shadow-slate-200 group-hover:shadow-blue-100"
      >
        Launch Exam
      </button>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full bg-white"
        />
      </div>
    </div>
  );
}
