import React, { useState } from 'react';
import { RoadmapItem, Skill } from '../types';
import { generateRoadmap } from '../services/geminiService';
import { Loader2, Box, ChevronRight, Lock, Play } from 'lucide-react';

interface Props {
  weakSkills: Skill[];
  onEarnPoints?: (amount: number) => void;
}

const Roadmap: React.FC<Props> = ({ weakSkills, onEarnPoints }) => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);

  const handleGenerate = async () => {
    if (weakSkills.length === 0) return;
    setLoading(true);
    try {
      const weakSkillNames = weakSkills.filter(s => s.status === 'weak').map(s => s.name);
      const targetSkills = weakSkillNames.length > 0 ? weakSkillNames : weakSkills.map(s => s.name).slice(0, 3);
      
      const plan = await generateRoadmap(targetSkills);
      setRoadmap(plan);
      if (onEarnPoints) onEarnPoints(30); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-[700px] sci-card border border-emerald-500/10 rounded-3xl p-6 relative overflow-hidden flex flex-col">
       {/* Header */}
       <div className="text-center mb-8 relative z-10">
           <h2 className="text-xl font-bold text-white">Your Mastery Path</h2>
           <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Architect Level</p>
           
           <div className="flex justify-center gap-4 mt-4">
               <div className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-[10px] font-bold text-slate-400">
                   12/45 Nodes
               </div>
               <div className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-[10px] font-bold text-emerald-400">
                   +2,450 XP
               </div>
           </div>
       </div>

       {roadmap.length === 0 && !loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-slate-700" />
                </div>
                <p className="text-slate-500 text-sm max-w-xs">Complete skill assessment to unlock your personalized mastery nodes.</p>
                <button 
                    onClick={handleGenerate}
                    disabled={weakSkills.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-8 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:shadow-none"
                >
                    Unlock Path
                </button>
            </div>
       ) : loading ? (
           <div className="flex-1 flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
           </div>
       ) : (
           <div className="flex-1 relative space-y-8 py-8 px-4">
               {/* Connecting Line */}
               <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-[80%] bg-gradient-to-b from-emerald-500/50 to-slate-800"></div>
               
               {roadmap.map((item, idx) => (
                   <div key={idx} className={`relative z-10 flex flex-col items-center ${idx % 2 === 0 ? 'translate-x-8' : '-translate-x-8'}`}>
                       <div className="w-20 h-20 rounded-full bg-[#0B1121] border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center relative group cursor-pointer transition-transform hover:scale-110">
                           <Box className="w-8 h-8 text-white" />
                           {idx === 0 && (
                               <div className="absolute -bottom-2 px-2 py-0.5 bg-emerald-500 text-black text-[8px] font-bold rounded-full">CURRENT</div>
                           )}
                       </div>
                       <h3 className="text-xs font-bold text-emerald-400 mt-3">{item.topic}</h3>
                       <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.day}</p>
                   </div>
               ))}
               
               <div className="relative z-10 flex flex-col items-center translate-x-0">
                   <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center">
                       <Lock className="w-5 h-5 text-slate-700" />
                   </div>
                   <h3 className="text-xs font-bold text-slate-600 mt-2">System Design</h3>
               </div>
           </div>
       )}
       
       {/* Bottom Controls */}
       <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#020617] to-transparent">
           <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               <span>Advanced Nodes</span>
               <span>CI/CD Pipelines</span>
           </div>
       </div>
    </div>
  );
};

export default Roadmap;