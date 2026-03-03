import React from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
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
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      <div className="bg-ielts-blue h-2 w-full" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-900">{batch.name}</h3>
          <div className="bg-blue-50 text-ielts-blue p-2 rounded-lg">
            <Users size={20} />
          </div>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-1">
          {batch.description || 'Join this intensive IELTS preparation batch to achieve your desired band score with expert guidance.'}
        </p>
        
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
          <Calendar size={16} />
          <span>Starts: {new Date(batch.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        
        <button 
          onClick={() => onJoin(batch.id)}
          className="w-full bg-ielts-blue text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors group"
        >
          Join Batch
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default BatchCard;
