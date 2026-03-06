import React from 'react';
import { Calendar, Users, ArrowRight, Star, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface BatchCardProps {
  batch: {
    id: string;
    name: string;
    startDate: string;
    description?: string;
  };
  onJoin: (batchId: string) => void;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, onJoin }) => {
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      className="bg-white rounded-[48px] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all overflow-hidden flex flex-col group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${batch.id}/600/400`} 
          alt={batch.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-6 left-8">
          <div className="flex items-center gap-1 text-amber-400 mb-1">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
          </div>
          <h3 className="text-2xl font-black text-white tracking-tighter">{batch.name}</h3>
        </div>
        <div className="absolute top-6 right-8 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Academic</span>
        </div>
      </div>

      <div className="p-10 flex-1 flex flex-col">
        <p className="text-slate-500 text-sm mb-8 line-clamp-2 flex-1 font-medium leading-relaxed">
          {batch.description || 'Join this intensive IELTS preparation batch to achieve your desired band score with expert guidance.'}
        </p>
        
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Calendar size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Starts: {new Date(batch.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Clock size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">8 Weeks Intensive</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <ShieldCheck size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Certified Mentors</span>
          </div>
        </div>
        
        <button 
          onClick={() => onJoin(batch.id)}
          className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-ielts-blue transition-all shadow-xl shadow-slate-900/10 group active:scale-95"
        >
          Enroll Now
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default BatchCard;
