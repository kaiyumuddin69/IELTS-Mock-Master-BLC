import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  FileText, 
  CheckSquare, 
  Plus, 
  BarChart3, 
  Settings,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  GraduationCap,
  Clock,
  BookOpen,
  Headphones,
  PenTool
} from 'lucide-react';
import { testService } from '../services/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTests: 0,
    pendingReviews: 0,
    avgBandScore: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // In a real app, these would be dedicated admin endpoints
        const tests = await testService.getTests();
        const results = await testService.getMyResults(); // Using student endpoint for demo
        
        setStats({
          totalStudents: 124, // Mocked for now
          totalTests: tests.length,
          pendingReviews: results.filter((r: any) => r.status === 'EVALUATING').length,
          avgBandScore: 6.5
        });
        setRecentSubmissions(results.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-ielts-blue p-1.5 rounded-lg">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-ielts-blue tracking-tighter">ADMIN</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: BarChart3, label: 'Overview', active: true },
            { icon: FileText, label: 'Tests', path: '/admin/tests' },
            { icon: CheckSquare, label: 'Reviews', path: '/admin/reviews' },
            { icon: Users, label: 'Students' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.active ? 'bg-blue-50 text-ielts-blue' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Admin Overview</h1>
            <p className="text-slate-500">Manage your IELTS platform and track student progress.</p>
          </div>
          <Link 
            to="/admin/tests/new"
            className="bg-ielts-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
          >
            <Plus size={20} />
            Create New Test
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Tests', value: stats.totalTests, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Pending Reviews', value: stats.pendingReviews, icon: CheckSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Avg. Band Score', value: stats.avgBandScore, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm"
            >
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Submissions */}
          <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900 tracking-tighter">Recent Submissions</h2>
              <button className="text-ielts-blue text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Test</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Score</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                            {sub.student?.name?.[0] || 'S'}
                          </div>
                          <span className="font-bold text-slate-900">{sub.student?.name || 'Student'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          {sub.test?.type === 'READING' && <BookOpen size={14} className="text-blue-500" />}
                          {sub.test?.type === 'LISTENING' && <Headphones size={14} className="text-purple-500" />}
                          {sub.test?.type === 'WRITING' && <PenTool size={14} className="text-amber-500" />}
                          <span className="text-sm font-medium text-slate-600">{sub.test?.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="font-black text-slate-900">{sub.bandScore || 'N/A'}</span>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          sub.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <ChevronRight size={18} className="text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Notifications */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 tracking-tighter mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-ielts-blue transition-all group">
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    <span className="font-bold text-sm">Add Reading Passage</span>
                  </div>
                  <Plus size={16} className="opacity-0 group-hover:opacity-100" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-ielts-blue transition-all group">
                  <div className="flex items-center gap-3">
                    <Headphones size={18} />
                    <span className="font-bold text-sm">Upload Listening Audio</span>
                  </div>
                  <Plus size={16} className="opacity-0 group-hover:opacity-100" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-ielts-blue transition-all group">
                  <div className="flex items-center gap-3">
                    <PenTool size={18} />
                    <span className="font-bold text-sm">Create Writing Task</span>
                  </div>
                  <Plus size={16} className="opacity-0 group-hover:opacity-100" />
                </button>
              </div>
            </div>

            <div className="bg-ielts-blue p-8 rounded-[40px] text-white shadow-xl shadow-blue-900/20">
              <h3 className="text-lg font-black tracking-tighter mb-2">Platform Tip</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Regularly update your question bank with recent IELTS topics to keep students engaged and prepared for the latest trends.
              </p>
              <button className="bg-white text-ielts-blue px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all">
                Read Guide
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
