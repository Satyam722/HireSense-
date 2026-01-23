import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Target, Award, FileText, Github, ExternalLink, Sparkles } from 'lucide-react';
import useAgentStore from '../../store/useAgentStore';

const AgentLeaderboard = () => {
  const { isOpen, rankingData, closeModal } = useAgentStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-indigo-600 to-violet-700 p-6 text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl tracking-tight">AI Rank Analysis</h2>
                    <p className="text-indigo-100 text-sm opacity-90 flex items-center gap-1">
                      <Sparkles size={14} /> GitHub Research & Ranking Complete
                    </p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
              {rankingData.map((candidate, index) => (
                <motion.div 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Top Row: Rank, Name, Score, and GitHub Link */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 font-bold text-lg
                      ${index === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                      {index === 0 ? <Award size={20} /> : `#${candidate.rank}`}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800 text-lg">{candidate.name}</h3>
                          {/* GitHub Verified Link */}
                          {candidate.githubUrl && (
                            <a 
                              href={candidate.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md hover:bg-indigo-600 transition-colors"
                            >
                              <Github size={12} />
                              <span className="hidden sm:inline">GitHub Verified</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
                          <Target size={14} />
                          {candidate.score}%
                        </div>
                      </div>
                      <p className="text-indigo-600 text-[11px] font-bold uppercase tracking-wider mt-1">
                        {candidate.reasoning}
                      </p>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-indigo-400">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Agent's Executive Summary</h4>
                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "{candidate.summary}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-5 border-t bg-white flex justify-end gap-3 shrink-0">
              <button onClick={closeModal} className="px-5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">
                Close
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                <FileText size={18} />
                Generate Full Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AgentLeaderboard;