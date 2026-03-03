import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  CheckCircle, 
  ArrowRight, 
  X, 
  Mail, 
  Lock, 
  User,
  Globe,
  BookOpen,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { batchService, authService } from '../services/api';
import BatchCard from '../components/BatchCard';

interface LandingPageProps {
  onLoginClick: () => void;
  onAuthSuccess: (user: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onAuthSuccess }) => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await batchService.getBatches();
        setBatches(data);
      } catch (err) {
        console.error('Failed to fetch batches', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleJoinClick = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    setSelectedBatch(batch);
    setShowRegModal(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegLoading(true);
    
    try {
      await authService.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        batchId: selectedBatch?.id
      });
      
      // Auto login after registration
      const loginData = await authService.login({
        email: regEmail,
        password: regPassword
      });
      
      onAuthSuccess(loginData.user);
      setShowRegModal(false);
    } catch (err: any) {
      setRegError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-ielts-blue">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-ielts-blue p-2 rounded-xl shadow-lg shadow-blue-900/20">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-ielts-blue tracking-tighter">IELTS</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery Platform</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#batches" className="text-sm font-semibold text-slate-600 hover:text-ielts-blue transition-colors">Batches</a>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-ielts-blue transition-colors">Features</a>
            <button 
              onClick={onLoginClick}
              className="bg-slate-900 text-white px-8 py-2.5 rounded-full text-sm font-bold hover:bg-ielts-blue transition-all shadow-lg shadow-slate-900/10 active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-ielts-blue text-xs font-bold uppercase tracking-widest mb-6">
              <Globe size={14} />
              <span>Trusted by 10,000+ Students</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
              Unlock Your <span className="text-ielts-blue">IELTS</span> Potential Today.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
              Experience the most realistic IELTS simulation platform. Expertly crafted tests, instant feedback, and personalized learning paths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#batches"
                className="bg-ielts-blue text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-2xl shadow-blue-900/20 active:scale-95"
              >
                Start Practicing
                <ArrowRight size={20} />
              </a>
              <button className="px-10 py-4 rounded-2xl font-bold text-lg text-slate-600 hover:bg-slate-50 transition-all border border-slate-200">
                View Demo
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-blue-50 rounded-[40px] relative overflow-hidden">
              <img 
                src="https://picsum.photos/seed/ielts/800/800" 
                alt="Student studying" 
                className="w-full h-full object-cover mix-blend-multiply opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ielts-blue/40 to-transparent" />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <CheckCircle size={20} />
                </div>
                <span className="text-2xl font-black text-slate-900">98%</span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Success Rate</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Why Choose Our Platform?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We provide the most comprehensive tools to help you succeed in your IELTS journey.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Realistic Tests', desc: 'Our interface mimics the actual IDP/British Council computer-delivered test.' },
              { icon: Clock, title: 'Instant Results', desc: 'Get your scores immediately for Reading and Listening modules.' },
              { icon: ShieldCheck, title: 'Expert Evaluation', desc: 'Writing and Speaking tasks are evaluated by certified IELTS trainers.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[32px] border border-slate-200 hover:border-ielts-blue transition-all group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-ielts-blue mb-8 group-hover:scale-110 transition-transform">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Batches Section */}
      <section id="batches" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Upcoming Batches</h2>
              <p className="text-slate-500">Pick a schedule that works for you and start your journey.</p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600">All Modules</div>
              <div className="px-4 py-2 bg-blue-50 rounded-full text-xs font-bold text-ielts-blue">Academic</div>
            </div>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : batches.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {batches.map(batch => (
                <BatchCard key={batch.id} batch={batch} onJoin={handleJoinClick} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                <BookOpen size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Active Batches</h3>
              <p className="text-slate-500">Check back soon for new batch announcements.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-ielts-blue p-2 rounded-xl">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter">IELTS Mastery</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Empowering students worldwide to achieve their dreams through professional IELTS preparation and realistic simulation.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Test Modules</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>support@ieltsmastery.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Education St, London, UK</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} IELTS Mastery Platform. All rights reserved.
        </div>
      </footer>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRegModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Join Batch</h2>
                    <p className="text-sm text-slate-500">Register for {selectedBatch?.name}</p>
                  </div>
                  <button 
                    onClick={() => setShowRegModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {regError && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium">
                    {regError}
                  </div>
                )}
                
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-ielts-blue transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-ielts-blue transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-ielts-blue transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <button 
                    disabled={regLoading}
                    type="submit"
                    className="w-full bg-ielts-blue text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {regLoading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </form>
                
                <p className="text-center text-slate-400 text-xs mt-8">
                  By joining, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
