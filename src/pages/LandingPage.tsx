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
  ShieldCheck,
  Star,
  Play,
  Zap,
  Users,
  Award
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
        setBatches(Array.isArray(data) ? data : []);
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
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-ielts-red text-white p-1.5 font-bold text-xl leading-none rounded-md flex items-center justify-center w-10 h-10 shadow-lg shadow-rose-200">I</div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-ielts-red tracking-tighter">IELTS</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CBT Platform</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-black text-slate-600 hover:text-ielts-blue transition-colors uppercase tracking-widest">Features</a>
            <a href="#batches" className="text-sm font-black text-slate-600 hover:text-ielts-blue transition-colors uppercase tracking-widest">Batches</a>
            <a href="#testimonials" className="text-sm font-black text-slate-600 hover:text-ielts-blue transition-colors uppercase tracking-widest">Success Stories</a>
            <button 
              onClick={onLoginClick}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-ielts-blue transition-all shadow-xl shadow-slate-900/10 active:scale-95 uppercase tracking-widest"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 rounded-full text-ielts-red text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-rose-100">
              <Zap size={14} className="fill-ielts-red" />
              <span>The #1 IELTS CBT Practice Platform</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] mb-10 tracking-tighter">
              Master the <span className="text-ielts-blue">IELTS</span> Computer-Based Exam.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-12 max-w-lg font-medium">
              Experience the most accurate IELTS simulation. Real exam interface, instant AI scoring, and expert feedback to hit your target band score.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a 
                href="#batches"
                className="bg-ielts-blue text-white px-12 py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-900 transition-all shadow-2xl shadow-blue-900/30 active:scale-95 uppercase tracking-widest"
              >
                Get Started Free
                <ArrowRight size={20} />
              </a>
              <button className="px-12 py-5 rounded-[24px] font-black text-lg text-slate-900 hover:bg-slate-50 transition-all border-2 border-slate-200 flex items-center justify-center gap-3 uppercase tracking-widest">
                <Play size={20} className="fill-slate-900" />
                Watch Demo
              </button>
            </div>
            
            <div className="mt-16 flex items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-sm">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">4.9/5 from 10k+ Students</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-slate-100 rounded-[64px] relative overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://picsum.photos/seed/ielts-student/1000/1200" 
                alt="Student studying" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-12 left-12 right-12">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                  <p className="text-white font-black text-xl mb-2 tracking-tighter">"The interface is identical to the real exam. I felt so confident on my test day!"</p>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">— Sarah J., Band 8.5</p>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 animate-bounce-slow">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">Band 8.0</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Achieved</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 grayscale">
          <span className="text-2xl font-black tracking-tighter">BRITISH COUNCIL</span>
          <span className="text-2xl font-black tracking-tighter">IDP IELTS</span>
          <span className="text-2xl font-black tracking-tighter">CAMBRIDGE</span>
          <span className="text-2xl font-black tracking-tighter">OXFORD</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Built for Success.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">Everything you need to master the IELTS Computer-Based Test in one powerful platform.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: BookOpen, title: 'Realistic Simulation', desc: 'Our CBT interface is pixel-perfect to the real IDP/British Council exam software.', color: 'bg-blue-50 text-blue-600' },
              { icon: Clock, title: 'Instant AI Scoring', desc: 'Get immediate band score estimates for Reading and Listening with detailed analysis.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: ShieldCheck, title: 'Expert Evaluation', desc: 'Your Writing and Speaking tasks are reviewed by certified IELTS examiners.', color: 'bg-purple-50 text-purple-600' },
              { icon: Zap, title: 'Adaptive Learning', desc: 'Personalized practice recommendations based on your weak areas and performance.', color: 'bg-amber-50 text-amber-600' },
              { icon: Users, title: 'Live Workshops', desc: 'Join weekly live sessions with experts to learn strategies for each module.', color: 'bg-rose-50 text-rose-600' },
              { icon: Globe, title: 'Global Community', desc: 'Connect with thousands of students worldwide sharing tips and experiences.', color: 'bg-indigo-50 text-indigo-600' }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[48px] border border-slate-200 hover:border-ielts-blue transition-all group shadow-sm hover:shadow-2xl hover:shadow-blue-900/5"
              >
                <div className={`w-16 h-16 ${f.color} rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Batches Section */}
      <section id="batches" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Upcoming Batches</h2>
              <p className="text-slate-500 text-lg font-medium">Join a structured program led by experts to accelerate your preparation.</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button className="px-6 py-2.5 bg-white rounded-xl text-xs font-black text-ielts-blue shadow-sm uppercase tracking-widest">All Batches</button>
              <button className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 hover:text-slate-700 uppercase tracking-widest transition-all">Academic</button>
            </div>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] bg-slate-100 rounded-[48px] animate-pulse" />
              ))}
            </div>
          ) : batches.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-10">
              {batches.map(batch => (
                <BatchCard key={batch.id} batch={batch} onJoin={handleJoinClick} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[64px] p-32 text-center border-4 border-dashed border-slate-200">
              <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-slate-300 mx-auto mb-10 shadow-sm">
                <BookOpen size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">No Active Batches</h3>
              <p className="text-slate-500 text-lg font-medium">We are preparing new batches. Check back in a few days!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.9]">Real Success from Real Students.</h2>
              <p className="text-slate-400 text-xl font-medium mb-12 leading-relaxed">Join thousands of students who achieved their dreams with our platform.</p>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-5xl font-black text-ielts-blue mb-2 tracking-tighter">10k+</p>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Students</p>
                </div>
                <div>
                  <p className="text-5xl font-black text-emerald-400 mb-2 tracking-tighter">95%</p>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Score Improvement</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="space-y-8">
                {[
                  { name: "Rahul K.", band: "8.0", text: "The writing evaluation was a game changer. The feedback was so specific and helped me improve my coherence and cohesion." },
                  { name: "Elena M.", band: "7.5", text: "I was struggling with time management in Reading. The practice tests here helped me master the skimming and scanning techniques." }
                ].map((t, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-md p-10 rounded-[40px] border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800" />
                        <div>
                          <p className="font-black text-lg tracking-tighter">{t.name}</p>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Achieved Band {t.band}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(j => <Star key={j} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-slate-300 text-lg font-medium leading-relaxed italic">"{t.text}"</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-32 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-ielts-red text-white p-1.5 font-bold text-xl leading-none rounded-md flex items-center justify-center w-10 h-10 shadow-lg shadow-rose-200">I</div>
              <span className="text-3xl font-black text-ielts-red tracking-tighter">IELTS Mastery</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed font-medium text-lg">
              Empowering students worldwide to achieve their dreams through professional IELTS preparation and realistic simulation.
            </p>
            <div className="flex gap-6 mt-10">
              {['Twitter', 'Instagram', 'LinkedIn', 'Facebook'].map(s => (
                <a key={s} href="#" className="text-slate-400 hover:text-ielts-blue transition-colors font-black text-xs uppercase tracking-widest">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10">Quick Links</h4>
            <ul className="space-y-6 text-slate-500 font-bold text-sm">
              <li><a href="#" className="hover:text-ielts-blue transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-ielts-blue transition-colors">Test Modules</a></li>
              <li><a href="#" className="hover:text-ielts-blue transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-ielts-blue transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10">Contact</h4>
            <ul className="space-y-6 text-slate-500 font-bold text-sm">
              <li>hello@ieltsmastery.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Education St, London, UK</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© {new Date().getFullYear()} IELTS Mastery Platform. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="text-slate-400 hover:text-ielts-blue transition-colors text-xs font-bold uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-ielts-blue transition-colors text-xs font-bold uppercase tracking-widest">Terms of Service</a>
          </div>
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
              className="relative w-full max-w-md bg-white rounded-[48px] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-12">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Join Batch</h2>
                    <p className="text-sm text-slate-500 font-medium">Register for {selectedBatch?.name}</p>
                  </div>
                  <button 
                    onClick={() => setShowRegModal(false)}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {regError && (
                  <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">
                    {regError}
                  </div>
                )}
                
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        required
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[24px] py-5 pl-14 pr-6 outline-none focus:border-ielts-blue transition-all font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        required
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[24px] py-5 pl-14 pr-6 outline-none focus:border-ielts-blue transition-all font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        required
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[24px] py-5 pl-14 pr-6 outline-none focus:border-ielts-blue transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <button 
                    disabled={regLoading}
                    type="submit"
                    className="w-full bg-ielts-blue text-white py-5 rounded-[24px] font-black text-lg hover:bg-blue-900 transition-all shadow-2xl shadow-blue-900/20 active:scale-95 disabled:opacity-50 mt-6 uppercase tracking-widest"
                  >
                    {regLoading ? 'Creating Account...' : 'Join Now'}
                  </button>
                </form>
                
                <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-10">
                  By joining, you agree to our Terms & Privacy.
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
