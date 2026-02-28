import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Send, 
  Trash2, 
  Edit,
  ArrowLeft,
  Search,
  Filter,
  X,
  Headphones,
  BookOpen,
  Layout,
  Mic
} from 'lucide-react';
import { db } from '../../services/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { WritingTest, WritingSubmission, TestModule } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { isAdmin, auth } from '../../services/firebase';
import { User } from 'firebase/auth';
import { GoogleGenAI } from "@google/genai";

export default function InstructorPanel({ user }: { user: User | null }) {
  const [activeTab, setActiveTab] = useState<'writing' | 'reading' | 'listening' | 'submissions'>('writing');
  const [writingTests, setWritingTests] = useState<WritingTest[]>([]);
  const [readingTests, setReadingTests] = useState<TestModule[]>([]);
  const [listeningTests, setListeningTests] = useState<TestModule[]>([]);
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markingSubmission, setMarkingSubmission] = useState<WritingSubmission | null>(null);

  // Form states for new writing test
  const [newWritingTest, setNewWritingTest] = useState({
    title: '',
    task1Prompt: '',
    task2Prompt: '',
    duration: 60
  });

  // Form states for Reading/Listening (Simplified for MVP)
  const [newModuleTest, setNewModuleTest] = useState({
    title: '',
    duration: 60,
    type: 'reading' as 'reading' | 'listening',
    content: '', // Passage or Audio URL
    instruction: '',
  });

  // Marking states
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const writingSnap = await getDocs(query(collection(db, 'writing_tests'), orderBy('createdAt', 'desc')));
      const readingSnap = await getDocs(query(collection(db, 'reading_tests'), orderBy('createdAt', 'desc')));
      const listeningSnap = await getDocs(query(collection(db, 'listening_tests'), orderBy('createdAt', 'desc')));
      const submissionsSnap = await getDocs(query(collection(db, 'writing_submissions'), orderBy('submittedAt', 'desc')));
      
      setWritingTests(writingSnap.docs.map(d => ({ id: d.id, ...d.data() } as WritingTest)));
      setReadingTests(readingSnap.docs.map(d => ({ id: d.id, ...d.data() } as TestModule)));
      setListeningTests(listeningSnap.docs.map(d => ({ id: d.id, ...d.data() } as TestModule)));
      setSubmissions(submissionsSnap.docs.map(d => ({ id: d.id, ...d.data() } as WritingSubmission)));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWritingTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'writing_tests'), {
        ...newWritingTest,
        createdAt: serverTimestamp(),
        createdBy: 'admin'
      });
      setShowCreateModal(false);
      setNewWritingTest({ title: '', task1Prompt: '', task2Prompt: '', duration: 60 });
      fetchData();
    } catch (error) {
      console.error("Error creating writing test:", error);
    }
  };

  const [isSeeding, setIsSeeding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSeedData = async () => {
    if (!confirm("This will populate the database with sample tests. Continue?")) return;
    setIsSeeding(true);
    try {
      // Seed Writing Test
      await addDoc(collection(db, 'writing_tests'), {
        title: 'Academic Writing Practice 1',
        duration: 60,
        task1Prompt: 'The table below shows the number of cars made in Argentina, Australia and Thailand from 2003 to 2009. Summarise the information by selecting and reporting the main features.',
        task2Prompt: 'The animal species are becoming extinct due to human activities on land and in sea. What are the reasons and solutions?',
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });

      // Seed Reading Test
      await addDoc(collection(db, 'reading_tests'), {
        title: 'Reading Practice Test 1',
        type: 'reading',
        duration: 60,
        sections: [
          {
            id: 'rs1',
            title: 'Reading Part 1',
            instruction: 'Read the passage and answer questions 1-5.',
            content: '<h2>Katherine Mansfield</h2><p>Katherine Mansfield was a modernist writer of short fiction...</p>',
            questions: [
              { id: '1', type: 'tfng', question: 'The name Katherine Mansfield was her original name.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'FALSE' },
              { id: '2', type: 'tfng', question: 'How Pearl Button Was Kidnapped portrayed Maori people in a favorable way.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctAnswer: 'TRUE' }
            ]
          }
        ],
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });

      alert("Seed data added successfully!");
      fetchData();
    } catch (e) {
      console.error("Error seeding data", e);
      alert("Failed to seed data.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAIGenerate = async () => {
    const topic = prompt("Enter a topic for the test (e.g. Climate Change, Artificial Intelligence):");
    if (!topic) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a complete IELTS ${activeTab} test about "${topic}". 
        Return ONLY a JSON object matching this structure:
        {
          "title": "Test Title",
          "duration": 60,
          "sections": [
            {
              "id": "s1",
              "title": "Section 1",
              "instruction": "Instructions...",
              "content": "Full passage text (HTML) or Audio URL placeholder",
              "questions": [
                { "id": "q1", "type": "mcq", "question": "Question text?", "options": ["A", "B", "C"], "correctAnswer": "A" }
              ]
            }
          ]
        }`,
      });

      const data = JSON.parse(response.text.replace(/```json|```/g, '').trim());
      
      await addDoc(collection(db, `${activeTab}_tests`), {
        ...data,
        type: activeTab,
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });

      alert("AI Test generated and saved!");
      fetchData();
    } catch (e) {
      console.error("Error generating AI test", e);
      alert("Failed to generate AI test. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearAllData = async () => {
    if (!confirm("WARNING: This will delete ALL tests and submissions. This cannot be undone. Continue?")) return;
    const password = prompt("Type 'DELETE' to confirm:");
    if (password !== 'DELETE') return;

    try {
      const collections = ['writing_tests', 'reading_tests', 'listening_tests', 'writing_submissions', 'results'];
      for (const colName of collections) {
        const snap = await getDocs(collection(db, colName));
        for (const docItem of snap.docs) {
          await deleteDoc(doc(db, colName, docItem.id));
        }
      }
      alert("All data cleared successfully!");
      fetchData();
    } catch (e) {
      console.error("Error clearing data", e);
      alert("Failed to clear data.");
    }
  };

  const handleCreateModuleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const collectionName = newModuleTest.type === 'reading' ? 'reading_tests' : 'listening_tests';
    try {
      await addDoc(collection(db, collectionName), {
        ...newModuleTest,
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
        sections: [
          {
            id: 's1',
            title: 'Section 1',
            instruction: newModuleTest.instruction,
            content: newModuleTest.content,
            questions: []
          }
        ]
      });
      setShowCreateModal(false);
      setNewModuleTest({ title: '', duration: 60, type: 'reading', content: '', instruction: '' });
      fetchData();
    } catch (error) {
      console.error("Error creating module test:", error);
    }
  };

  const handleMarkSubmission = async () => {
    if (!markingSubmission) return;
    try {
      const subRef = doc(db, 'writing_submissions', markingSubmission.id);
      await updateDoc(subRef, {
        status: 'marked',
        score,
        feedback,
        markedAt: serverTimestamp()
      });

      // Send automated email (mocking the API call)
      await fetch('/api/send-feedback-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: markingSubmission.studentEmail,
          studentName: markingSubmission.studentName,
          testTitle: markingSubmission.testTitle,
          score,
          feedback
        })
      });

      setMarkingSubmission(null);
      setFeedback('');
      setScore(0);
      fetchData();
    } catch (error) {
      console.error("Error marking submission:", error);
    }
  };

  const handleDeleteTest = async (id: string, type: 'writing' | 'reading' | 'listening') => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    const collectionName = type === 'writing' ? 'writing_tests' : type === 'reading' ? 'reading_tests' : 'listening_tests';
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchData();
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin(user?.email)) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-slate-500">You do not have permission to access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Instructor Management</h1>
            <p className="text-slate-500 font-medium">Manage tests and track student progress</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleClearAllData}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
            >
              <X size={18} />
              Clear All Data
            </button>
            <button 
              onClick={handleSeedData}
              disabled={isSeeding}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all disabled:opacity-50"
            >
              <Layout size={18} />
              {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
            </button>
            <button 
              onClick={handleAIGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-100 transition-all disabled:opacity-50"
            >
              <Mic size={18} />
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <Plus size={20} />
              Create New Test
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="flex items-center gap-8 max-w-7xl mx-auto w-full">
          <button 
            onClick={() => setActiveTab('writing')}
            className={`py-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'writing' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Writing
            {activeTab === 'writing' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('reading')}
            className={`py-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'reading' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Reading
            {activeTab === 'reading' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('listening')}
            className={`py-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'listening' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Listening
            {activeTab === 'listening' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`py-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'submissions' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Submissions
            {activeTab === 'submissions' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto w-full">
          {activeTab === 'writing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {writingTests.map(test => (
                <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
                      <FileText size={24} />
                    </div>
                    <button 
                      onClick={() => handleDeleteTest(test.id, 'writing')}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{test.title}</h3>
                  <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-6">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {test.duration} mins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readingTests.map(test => (
                <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                      <BookOpen size={24} />
                    </div>
                    <button 
                      onClick={() => handleDeleteTest(test.id, 'reading')}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{test.title}</h3>
                  <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-6">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {test.duration} mins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'listening' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listeningTests.map(test => (
                <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                      <Headphones size={24} />
                    </div>
                    <button 
                      onClick={() => handleDeleteTest(test.id, 'listening')}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{test.title}</h3>
                  <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-6">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {test.duration} mins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Test</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Submitted At</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{sub.studentName}</div>
                        <div className="text-xs text-slate-500">{sub.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{sub.testTitle}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {sub.submittedAt?.toDate().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${sub.status === 'marked' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setMarkingSubmission(sub)}
                          className="text-blue-600 font-bold text-sm hover:underline"
                        >
                          {sub.status === 'marked' ? 'View/Edit Feedback' : 'Mark Now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Test Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900">
                    Create {activeTab === 'writing' ? 'Writing' : activeTab === 'reading' ? 'Reading' : 'Listening'} Test
                  </h2>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>

                {activeTab === 'writing' ? (
                  <form onSubmit={handleCreateWritingTest} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Test Title</label>
                      <input 
                        required
                        type="text" 
                        value={newWritingTest.title}
                        onChange={e => setNewWritingTest({...newWritingTest, title: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold"
                        placeholder="e.g. Academic Writing Practice 1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration (mins)</label>
                      <input 
                        required
                        type="number" 
                        value={newWritingTest.duration}
                        onChange={e => setNewWritingTest({...newWritingTest, duration: parseInt(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Task 1 Prompt</label>
                      <textarea 
                        required
                        value={newWritingTest.task1Prompt}
                        onChange={e => setNewWritingTest({...newWritingTest, task1Prompt: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium h-32 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Task 2 Prompt</label>
                      <textarea 
                        required
                        value={newWritingTest.task2Prompt}
                        onChange={e => setNewWritingTest({...newWritingTest, task2Prompt: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium h-32 resize-none"
                      />
                    </div>
                    <button type="submit" className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all">
                      Create Writing Test
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCreateModuleTest} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Test Title</label>
                      <input 
                        required
                        type="text" 
                        value={newModuleTest.title}
                        onChange={e => setNewModuleTest({...newModuleTest, title: e.target.value, type: activeTab as any})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration (mins)</label>
                      <input 
                        required
                        type="number" 
                        value={newModuleTest.duration}
                        onChange={e => setNewModuleTest({...newModuleTest, duration: parseInt(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        {activeTab === 'reading' ? 'Passage Content (HTML)' : 'Audio URL'}
                      </label>
                      <textarea 
                        required
                        value={newModuleTest.content}
                        onChange={e => setNewModuleTest({...newModuleTest, content: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium h-32 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Instruction</label>
                      <input 
                        required
                        type="text" 
                        value={newModuleTest.instruction}
                        onChange={e => setNewModuleTest({...newModuleTest, instruction: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold"
                      />
                    </div>
                    <button type="submit" className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all">
                      Create {activeTab === 'reading' ? 'Reading' : 'Listening'} Test
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Marking Modal */}
      <AnimatePresence>
        {markingSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMarkingSubmission(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[32px] w-full max-w-5xl h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Marking Submission</h2>
                  <p className="text-slate-500 font-medium">Student: {markingSubmission.studentName} ({markingSubmission.studentEmail})</p>
                </div>
                <button onClick={() => setMarkingSubmission(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex">
                {/* Answers Section */}
                <div className="flex-1 overflow-y-auto p-8 border-r border-slate-100 space-y-10">
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Task 1 Answer</h3>
                    <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                      {markingSubmission.task1Answer || 'No answer provided.'}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Task 2 Answer</h3>
                    <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                      {markingSubmission.task2Answer || 'No answer provided.'}
                    </div>
                  </section>
                </div>

                {/* Feedback Section */}
                <div className="w-96 p-8 bg-slate-50/50 flex flex-col">
                  <div className="space-y-6 flex-1">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Band Score</label>
                      <select 
                        value={score}
                        onChange={e => setScore(parseFloat(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-bold"
                      >
                        {[0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map(s => (
                          <option key={s} value={s}>{s === 0 ? 'Select Score' : s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Feedback</label>
                      <textarea 
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-medium resize-none"
                        placeholder="Provide constructive feedback..."
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button 
                      onClick={handleMarkSubmission}
                      className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                    >
                      <Send size={20} />
                      Submit & Send Email
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
