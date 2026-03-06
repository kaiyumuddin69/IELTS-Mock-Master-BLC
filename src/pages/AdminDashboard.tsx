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
  PenTool,
  LayoutDashboard,
  Bell,
  LogOut,
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';
import { testService } from '../services/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTests: 0,
    pendingReviews: 0,
    avgBandScore: '0.0' as string | number
  });
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const tests = await testService.getTests();
        const submissions = await testService.getAdminSubmissions();
        
        setStats({
          totalStudents: new Set(submissions.map((s: any) => s.studentId)).size,
          totalTests: tests.length,
          pendingReviews: submissions.filter((r: any) => r.status === 'EVALUATING').length,
          avgBandScore: submissions.length > 0 
            ? (submissions.reduce((acc: number, s: any) => acc + (s.bandScore || 0), 0) / submissions.length).toFixed(1)
            : 0
        });
        setRecentSubmissions(submissions.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-ielts-blue">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-ielts-red text-white p-1.5 font-bold text-xl leading-none rounded-md flex items-center justify-center w-10 h-10 shadow-lg shadow-rose-200">I</div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-ielts-red tracking-tighter">IELTS</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Main Menu</p>
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: FileText, label: 'Test Library', path: '/admin/tests' },
            { icon: CheckSquare, label: 'Pending Reviews', path: '/admin/reviews', badge: stats.pendingReviews },
            { icon: Users, label: 'Student Directory' },
            { icon: BarChart3, label: 'Analytics' },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-black transition-all group ${
                item.active ? 'bg-ielts-blue text-white shadow-xl shadow-blue-900/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={item.active ? 'text-white' : 'text-slate-400 group-hover:text-ielts-blue'} />
                <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${item.active ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}

          <div className="pt-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">System</p>
            {[
              { icon: Settings, label: 'Platform Settings' },
              { icon: Bell, label: 'Notifications' },
              { icon: LogOut, label: 'Sign Out', color: 'text-rose-500' },
            ].map((item, i) => (
              <button 
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black transition-all text-slate-500 hover:bg-slate-50 uppercase tracking-widest text-[11px] ${item.color || ''}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ielts-blue flex items-center justify-center text-white font-black">A</div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Admin User</p>
              <p className="text-[10px] font-bold text-slate-400">Super Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Platform Overview</h1>
            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1.5 text-emerald-500"><Activity size={14} /> System Online</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students, tests..." 
                className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:border-ielts-blue transition-all w-64 font-medium"
              />
            </div>
            <Link 
              to="/admin/tests/new"
              className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-ielts-blue transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              <Plus size={18} />
              New Test
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
            { label: 'Active Tests', value: stats.totalTests, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+4' },
            { label: 'Pending Reviews', value: stats.pendingReviews, icon: CheckSquare, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-2' },
            { label: 'Avg. Band Score', value: stats.avgBandScore, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0.2' },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">{stat.trend}</span>
              </div>
              <div className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Submissions */}
          <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Recent Submissions</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Latest student activity across all modules</p>
              </div>
              <button className="text-ielts-blue text-xs font-black uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Module</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-black text-xs">
                            {sub.student?.name?.[0] || 'S'}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm tracking-tight">{sub.student?.name || 'Student'}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {sub.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            sub.test?.type === 'READING' ? 'bg-blue-50 text-blue-600' :
                            sub.test?.type === 'LISTENING' ? 'bg-purple-50 text-purple-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {sub.test?.type === 'READING' && <BookOpen size={16} />}
                            {sub.test?.type === 'LISTENING' && <Headphones size={16} />}
                            {sub.test?.type === 'WRITING' && <PenTool size={16} />}
                          </div>
                          <span className="text-sm font-bold text-slate-600 tracking-tight">{sub.test?.title}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="font-black text-slate-900 text-lg tracking-tighter">{sub.bandScore || '—'}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          sub.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Link 
                          to={`/admin/review/${sub.id}`}
                          className="p-3 hover:bg-white hover:shadow-lg rounded-xl transition-all inline-block group-hover:translate-x-1"
                        >
                          <ChevronRight size={20} className="text-slate-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Notifications */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8">Quick Actions</h3>
              <div className="space-y-4">
                {[
                  { icon: FileText, label: 'Add Reading Passage', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: Headphones, label: 'Upload Listening Audio', color: 'text-purple-600', bg: 'bg-purple-50' },
                  { icon: PenTool, label: 'Create Writing Task', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { icon: Users, label: 'Invite Students', color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((action, i) => (
                  <button 
                    key={i}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-[24px] hover:bg-white hover:shadow-xl hover:shadow-slate-200 transition-all group border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${action.bg} ${action.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                        <action.icon size={20} />
                      </div>
                      <span className="font-black text-[11px] uppercase tracking-widest text-slate-600">{action.label}</span>
                    </div>
                    <Plus size={18} className="text-slate-300 group-hover:text-ielts-blue transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Activity size={24} className="text-ielts-blue" />
                </div>
                <h3 className="text-xl font-black tracking-tighter mb-4">Platform Health</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                  All systems are performing optimally. 124 active sessions currently in progress.
                </p>
                <button className="w-full bg-ielts-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-400 transition-all">
                  View System Logs
                </button>
              </div>
              {/* Decorative background element */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-ielts-blue/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
