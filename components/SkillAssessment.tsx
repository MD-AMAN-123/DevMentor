import React, { useState } from 'react';
import { Skill } from '../types';
import { assessSkills } from '../services/geminiService';
import { Loader2, Send, BrainCircuit, AlertTriangle, CheckCircle, ScanLine } from 'lucide-react';

interface Props {
  onSkillsAnalyzed: (skills: Skill[]) => void;
  onEarnPoints?: (amount: number) => void;
}

const SkillAssessment: React.FC<Props> = ({ onSkillsAnalyzed, onEarnPoints }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  const handleAssessment = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await assessSkills(input);
      setSkills(result);
      onSkillsAnalyzed(result);
      if (onEarnPoints) onEarnPoints(50); 
    } catch (error) {
      console.error("Assessment failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto h-[600px] flex flex-col justify-center animate-in fade-in zoom-in duration-500">
      <div className="sci-card rounded-3xl p-8 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)] relative overflow-hidden">
        {/* Decorative scanning line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_15px_#10b981] animate-[scan_3s_ease-in-out_infinite]"></div>

        <div className="text-center mb-8">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Neural Link</h2>
            {loading ? (
                 <div className="w-48 h-48 mx-auto relative flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-2 border-emerald-500/40 rounded-full animate-spin"></div>
                    <div className="text-emerald-400 font-bold text-xl animate-pulse">Scanning...</div>
                 </div>
            ) : skills.length > 0 ? (
                 <div className="w-48 h-48 mx-auto relative flex items-center justify-center bg-emerald-500/5 rounded-full border border-emerald-500/20 mb-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white">82<span className="text-sm align-top">%</span></div>
                        <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest mt-1">Analyzed</div>
                    </div>
                 </div>
            ) : (
                <div className="w-48 h-48 mx-auto relative flex items-center justify-center bg-slate-900 rounded-full border border-white/5 mb-6">
                    <BrainCircuit className="w-16 h-16 text-slate-700" />
                </div>
            )}
            
            <h1 className="text-2xl font-bold text-white mt-4">{loading ? 'Analyzing Profile' : skills.length > 0 ? 'Analysis Complete' : 'Initialize Scan'}</h1>
        </div>

        {skills.length === 0 && !loading && (
            <div className="space-y-4">
                 <div className="relative">
                     <textarea 
                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-700"
                        placeholder="// Paste code snippet or tech stack..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                     />
                 </div>
                 <button 
                    onClick={handleAssessment}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
                 >
                    <ScanLine className="w-4 h-4" /> Start Analysis
                 </button>
            </div>
        )}

        {skills.length > 0 && (
            <div className="space-y-3">
                 <div className="flex gap-2 flex-wrap justify-center">
                    {skills.map((s, i) => (
                        <div key={i} className="px-3 py-1.5 rounded bg-slate-900 border border-emerald-500/30 flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'strong' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                             <span className="text-xs font-bold text-white">{s.name}</span>
                        </div>
                    ))}
                 </div>
                 <button 
                    onClick={() => setSkills([])}
                    className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-white/5"
                 >
                    Finalize Link
                 </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SkillAssessment;