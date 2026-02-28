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
  Mic,
  RefreshCw,
  Star
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
  const [activeTab, setActiveTab] = useState<'overview' | 'writing' | 'reading' | 'listening' | 'speaking' | 'submissions'>('overview');
  const [writingTests, setWritingTests] = useState<WritingTest[]>([]);
  const [readingTests, setReadingTests] = useState<TestModule[]>([]);
  const [listeningTests, setListeningTests] = useState<TestModule[]>([]);
  const [speakingTests, setSpeakingTests] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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
    if (user && isAdmin(user.email)) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const writingSnap = await getDocs(query(collection(db, 'writing_tests'), orderBy('createdAt', 'desc')));
      const readingSnap = await getDocs(query(collection(db, 'reading_tests'), orderBy('createdAt', 'desc')));
      const listeningSnap = await getDocs(query(collection(db, 'listening_tests'), orderBy('createdAt', 'desc')));
      const speakingSnap = await getDocs(query(collection(db, 'speaking_tests'), orderBy('createdAt', 'desc')));
      const submissionsSnap = await getDocs(query(collection(db, 'writing_submissions'), orderBy('submittedAt', 'desc')));
      
      setWritingTests(writingSnap.docs.map(d => ({ id: d.id, ...d.data() } as WritingTest)));
      setReadingTests(readingSnap.docs.map(d => ({ id: d.id, ...d.data() } as TestModule)));
      setListeningTests(listeningSnap.docs.map(d => ({ id: d.id, ...d.data() } as TestModule)));
      setSpeakingTests(speakingSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
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
    if (!confirm("This will populate the database with the complete IELTS test data you provided. Continue?")) return;
    setIsSeeding(true);
    try {
      // 1. Seed Listening Test (from HTML)
      await addDoc(collection(db, 'listening_tests'), {
        title: 'IELTS Listening - Removal Booking & Guitars',
        duration: 30,
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
        sections: [
          {
            id: 'part1',
            title: 'Part 1: Removal Booking Confirmation',
            instruction: 'Write NO MORE THAN TWO WORDS AND/OR NUMBERS for each answer.',
            content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            questions: [
              { id: '1', type: 'fill-in-the-blanks', text: 'Contact phone number is (1)' },
              { id: '2', type: 'fill-in-the-blanks', text: 'collect from 119 (2) Hamilton, Waikato' },
              { id: '3', type: 'fill-in-the-blanks', text: 'Ship to 2096 (3) Edmonton, Alberta' },
              { id: '4', type: 'fill-in-the-blanks', text: 'Prepare for shipment on (4), January the 9th' },
              { id: '5', type: 'fill-in-the-blanks', text: 'Tidy up the collection site by 9 AM on (5), January the 12th' },
              { id: '6', type: 'fill-in-the-blanks', text: 'Store before shipment for (6) months' },
              { id: '7', type: 'matching', text: '7. clothes', options: ['readily accessible', 'personal objects', 'precious items'] },
              { id: '8', type: 'matching', text: '8. coffee maker', options: ['readily accessible', 'personal objects', 'precious items'] },
              { id: '9', type: 'matching', text: '9. family photos', options: ['readily accessible', 'personal objects', 'precious items'] },
              { id: '10', type: 'matching', text: '10. computers', options: ['readily accessible', 'personal objects', 'precious items'] }
            ]
          },
          {
            id: 'part2',
            title: 'Part 2: Types of Guitars',
            instruction: 'Write NO MORE THAN TWO WORDS for each answer.',
            content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            questions: [
              { id: '11', type: 'fill-in-the-blanks', text: 'Suitable for (11)' },
              { id: '12', type: 'fill-in-the-blanks', text: 'Positioned (12) the lap of the guitar player' },
              { id: '13', type: 'fill-in-the-blanks', text: 'Played by (13)' },
              { id: '14', type: 'fill-in-the-blanks', text: 'support the (14)' },
              { id: '15', type: 'fill-in-the-blanks', text: 'purchased by (15) due to their affordable prices' },
              { id: '16', type: 'fill-in-the-blanks', text: 'popular with (16)' },
              { id: '19', type: 'multiple-choice', text: 'What is the reason given for the increasing sales of acoustic guitars?', options: ['A. Acoustic guitars are used more by pop stars', 'B. Acoustic guitars are used widely in country music', 'C. More people choose acoustic guitars over six-string guitars'] },
              { id: '20', type: 'multiple-choice', text: 'Education has great potential to increase guitar sales because', options: ['A. 50 percent of new buyers are female artists', 'B. half the guitars every year are bought by first-time players', 'C. long-term guitar users tend to spend a lot of money'] }
            ]
          }
        ]
      });

      // 2. Seed Reading Test (from HTML)
      await addDoc(collection(db, 'reading_tests'), {
        title: 'IELTS Reading - History of Woodlands & Succession',
        duration: 60,
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
        sections: [
          {
            id: 'part1',
            title: 'Part 1: The History of Woodlands in Britain',
            instruction: 'Choose TRUE, FALSE or NOT GIVEN.',
            content: `
              <p>The climate in Britain has been arctic for the last several million years, punctuated by relatively warm timespans, or interglacials of thousands of years, one of which we are in as of now. Since the last glaciation, British woodland history is considered quite short in terms of geological time spans, and is also closely related to the human civilization developing.</p>
              <p>At the peak of the last glaciation (100,000 – 12,000 BC), the majority of Britain would have had no trees. Birch and willow scrub may have grown along the lower reaches of the ice, with pine in some areas.</p>
            `,
            questions: [
              { id: '1', type: 'tfng', text: 'An understanding of Britain’s pre-glacial flora’s development has been deduced from studies of pollen and seed deposits in peat.', options: ['TRUE', 'FALSE', 'NOT GIVEN'] },
              { id: '2', type: 'tfng', text: 'Various species of wildwood types began growing in Britain in around the year 8500 BC.', options: ['TRUE', 'FALSE', 'NOT GIVEN'] },
              { id: '3', type: 'tfng', text: 'Beech and lime did not spread beyond southern Britain.', options: ['TRUE', 'FALSE', 'NOT GIVEN'] },
              { id: '10', type: 'matching', text: 'Every type of wood in England belonged to some person or some community.', options: ['A. The Palaeolithic era', 'B. The Bronze age', 'C. The Iron age', 'D. The Medieval era', 'E. The Mesolithic age', 'F. Roman times'] }
            ]
          }
        ]
      });

      // 3. Seed Writing Test (from HTML)
      await addDoc(collection(db, 'writing_tests'), {
        title: 'IELTS Writing - UK Issues & Death Penalty',
        duration: 60,
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
        task1Prompt: 'The chart below gives some of the most reported issues among people living in UK cities in 2008 (%). Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        task2Prompt: 'Some people advocate the death penalty for those who committed violent crimes. Others say that capital punishment is unacceptable in contemporary society. Describe the advantages and disadvantages of the death penalty and give your opinion.',
        task1Image: 'https://picsum.photos/seed/ielts-chart/800/400'
      });

      // 4. Seed Speaking Test (from HTML)
      await addDoc(collection(db, 'speaking_tests'), {
        title: 'IELTS Speaking Practice Test 1',
        duration: 15,
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
        parts: [
          {
            id: 'part1',
            title: 'Part 1: Introduction and Interview',
            instruction: 'The examiner asks the candidate about him/herself, his/her home, work or studies and other familiar topics.',
            questions: [
              'What is your full name?',
              'Can I see your ID?',
              'Where are you from?',
              'Do you work or are you a student?',
              'What do you like about your job/studies?'
            ]
          },
          {
            id: 'part2',
            title: 'Part 2: Individual Long Turn (Cue Card)',
            instruction: 'The candidate is given a task card and has 1 minute to prepare a talk of 1-2 minutes.',
            content: 'Describe a place you have visited that you would like to go back to. You should say: where it is, when you went there, what you did there, and explain why you would like to go back there.',
            questions: []
          },
          {
            id: 'part3',
            title: 'Part 3: Two-way Discussion',
            instruction: 'The examiner and the candidate discuss issues related to the topic in Part 2 in a more general and abstract way.',
            questions: [
              'Why do people like to travel to different places?',
              'Do you think it is better to travel alone or with others?',
              'How has the way people travel changed in recent years?',
              'What are the advantages and disadvantages of tourism for a country?'
            ]
          }
        ]
      });

      alert("Complete IELTS test data seeded successfully!");
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
      const collections = ['writing_tests', 'reading_tests', 'listening_tests', 'speaking_tests', 'writing_submissions', 'results'];
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

  const handleDeleteTest = async (id: string, type: 'writing' | 'reading' | 'listening' | 'speaking') => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    const collectionName = type === 'writing' ? 'writing_tests' : 
                          type === 'reading' ? 'reading_tests' : 
                          type === 'listening' ? 'listening_tests' : 'speaking_tests';
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
    <div className="min-h-screen bg-[#F8FAFC] flex w-full">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-8">
          <div className="text-2xl font-black text-ielts-blue tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-ielts-blue rounded-lg flex items-center justify-center text-white text-sm">A</div>
            ADMIN
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">IELTS Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: Layout },
            { id: 'writing', label: 'Writing Tests', icon: PenTool },
            { id: 'reading', label: 'Reading Tests', icon: BookOpen },
            { id: 'listening', label: 'Listening Tests', icon: Headphones },
            { id: 'speaking', label: 'Speaking Tests', icon: Mic },
            { id: 'submissions', label: 'Submissions', icon: CheckCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-ielts-blue text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-2">
          <button 
            onClick={handleSeedData}
            disabled={isSeeding}
            className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> {isSeeding ? 'Seeding...' : 'Seed Sample Test'}
          </button>
          <button 
            onClick={handleClearAllData}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={14} /> Clear All Data
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 capitalize">{activeTab}</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your IELTS examination modules and student data.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-ielts-blue text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              <Plus size={18} /> Create New
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Tests', value: writingTests.length + readingTests.length + listeningTests.length + speakingTests.length, icon: BookOpen, color: 'bg-blue-500' },
              { label: 'Submissions', value: submissions.length, icon: CheckCircle, color: 'bg-emerald-500' },
              { label: 'Active Students', value: '124', icon: Users, color: 'bg-amber-500' },
              { label: 'Avg. Band', value: '6.5', icon: Star, color: 'bg-rose-500' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm"
              >
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        )}

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

          {activeTab === 'speaking' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {speakingTests.map(test => (
                <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
                      <Mic size={24} />
                    </div>
                    <button 
                      onClick={() => handleDeleteTest(test.id, 'speaking')}
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
