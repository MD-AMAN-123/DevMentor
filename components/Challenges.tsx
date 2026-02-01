import React, { useState } from 'react';
import { generateDailyChallenge, evaluateChallenge } from '../services/geminiService';
import { Challenge, ChallengeResult } from '../types';
import { Loader2, Zap, Play, Search, Clock, Users, ArrowRight, Shield, CheckCircle, XCircle, ChevronLeft, Terminal, Code2, Trophy, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
    onEarnPoints: (amount: number) => void;
}

const Challenges: React.FC<Props> = ({ onEarnPoints }) => {
    // UI Navigation State
    const [activeTab, setActiveTab] = useState('Daily');
    const [tournamentStatus, setTournamentStatus] = useState<'idle' | 'joining' | 'joined'>('idle');
    const [isPreRegistered, setIsPreRegistered] = useState(false);
    
    // Challenge Logic State
    const [loading, setLoading] = useState(false);
    const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
    const [userCode, setUserCode] = useState('');
    
    // Evaluation State
    const [evaluating, setEvaluating] = useState(false);
    const [result, setResult] = useState<ChallengeResult | null>(null);

    const handleJoinTournament = () => {
        setTournamentStatus('joining');
        // Simulate network request
        setTimeout(() => setTournamentStatus('joined'), 1500);
    };

    const handleStartChallenge = async (diff: 'Easy' | 'Medium' | 'Hard') => {
        setLoading(true);
        try {
            const newChallenge = await generateDailyChallenge(diff);
            setActiveChallenge(newChallenge);
            setUserCode(newChallenge.starterCode || '// Write your solution here\n');
            setResult(null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitSolution = async () => {
        if (!activeChallenge) return;
        setEvaluating(true);
        try {
            const res = await evaluateChallenge(activeChallenge, userCode);
            setResult(res);
            if (res.passed) {
                onEarnPoints(res.score);
            }
        } catch (e) {
            console.error(e);
            setResult({ passed: false, feedback: "Error connecting to evaluation engine.", score: 0 });
        } finally {
            setEvaluating(false);
        }
    };

    const handleExitChallenge = () => {
        setActiveChallenge(null);
        setResult(null);
        setUserCode('');
    };

    // --- EDITOR VIEW ---
    if (activeChallenge) {
        return (
            <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] bg-[#020617] border border-slate-800 rounded-3xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Editor Header */}
                <div className="bg-[#0B1121] border-b border-white/5 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleExitChallenge}
                            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-emerald-500" />
                                {activeChallenge.title}
                            </h2>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                activeChallenge.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                activeChallenge.difficulty === 'Medium' ? 'bg-blue-500/10 text-blue-400' :
                                'bg-rose-500/10 text-rose-400'
                            }`}>
                                {activeChallenge.difficulty.toUpperCase()} • {activeChallenge.xp} XP
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 mr-4">
                             <Clock className="w-4 h-4" />
                             <span>00:00</span>
                         </div>
                         <button 
                            onClick={handleSubmitSolution}
                            disabled={evaluating || (result?.passed ?? false)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                                result?.passed 
                                    ? 'bg-emerald-600 text-white opacity-50 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                            }`}
                         >
                             {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                             {result?.passed ? 'Completed' : 'Run Tests'}
                         </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Problem Description Side */}
                    <div className="w-full lg:w-1/3 bg-[#0B1121] border-r border-white/5 p-6 overflow-y-auto custom-scrollbar">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Challenge Brief</h3>
                        <div className="prose prose-invert prose-sm text-slate-300">
                            <ReactMarkdown>{activeChallenge.description}</ReactMarkdown>
                        </div>
                        
                        {/* Result Panel */}
                        {result && (
                            <div className={`mt-8 p-4 rounded-xl border animate-in slide-in-from-bottom-2 duration-300 ${
                                result.passed 
                                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                                    : 'bg-red-500/10 border-red-500/20'
                            }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {result.passed 
                                        ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        : <XCircle className="w-6 h-6 text-red-500" />
                                    }
                                    <h4 className={`font-bold ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {result.passed ? 'Tests Passed!' : 'Tests Failed'}
                                    </h4>
                                </div>
                                <p className="text-sm text-slate-300 mb-3">{result.feedback}</p>
                                {result.passed && (
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                        <span className="text-xs text-slate-400">Reward Earned</span>
                                        <span className="font-bold text-emerald-400">+{result.score} XP</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Code Editor Side */}
                    <div className="flex-1 bg-[#020617] relative flex flex-col">
                        <div className="flex-1 relative">
                            <textarea
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-[#020617] text-slate-300 font-mono text-sm p-6 resize-none focus:outline-none"
                                spellCheck={false}
                            />
                        </div>
                        <div className="bg-[#0B1121] border-t border-white/5 p-2 px-4 flex justify-between items-center text-xs text-slate-500">
                             <span>JavaScript (Node.js)</span>
                             <span>Ln {userCode.split('\n').length}, Col 1</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- LIST VIEW ---
    return (
        <div className="max-w-md mx-auto min-h-[800px] bg-[#020617] border border-blue-900/20 rounded-3xl overflow-hidden relative animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-6 flex justify-between items-center bg-[#0B1121]">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-600 rounded-lg"><Zap className="w-5 h-5 text-white" /></div>
                     <div>
                         <h1 className="text-lg font-bold text-white">Community</h1>
                         <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                             1,402 Active Now
                         </div>
                     </div>
                 </div>
                 <div className="flex gap-2">
                     <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Search className="w-5 h-5 text-slate-500" /></button>
                 </div>
            </div>

            <div className="p-6 relative">
                 {/* Featured Tournament Card */}
                 <div className="relative sci-card rounded-2xl p-6 border border-blue-500/30 overflow-hidden mb-8 group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -mr-10 -mt-10 group-hover:bg-blue-500/30 transition-all duration-700"></div>
                     
                     <div className="flex gap-2 mb-4">
                         <span className="px-2 py-0.5 rounded bg-blue-600 text-[10px] font-bold text-white animate-pulse">TRENDING</span>
                         <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 border border-white/10">GLOBAL</span>
                     </div>
                     
                     <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Quantum Refactor</p>
                     <h2 className="text-xl font-bold text-white mb-4">Optimize the Core Engine</h2>
                     
                     <div className="flex justify-between items-end mb-6">
                         <div className="flex gap-4 text-center">
                             <div>
                                 <div className="text-lg font-bold text-white font-mono">04</div>
                                 <div className="text-[8px] text-slate-500 font-bold uppercase">HRS</div>
                             </div>
                             <div>
                                 <div className="text-lg font-bold text-white font-mono">22</div>
                                 <div className="text-[8px] text-slate-500 font-bold uppercase">MIN</div>
                             </div>
                             <div>
                                 <div className="text-lg font-bold text-white font-mono">15</div>
                                 <div className="text-[8px] text-slate-500 font-bold uppercase">SEC</div>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="text-[10px] text-slate-400">PRIZE POOL</div>
                             <div className="text-lg font-bold text-purple-400">5,000 CR</div>
                         </div>
                     </div>
                     
                     <button 
                        onClick={handleJoinTournament}
                        disabled={tournamentStatus !== 'idle'}
                        className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                            tournamentStatus === 'joined'
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                        }`}
                     >
                         {tournamentStatus === 'joining' && <Loader2 className="w-4 h-4 animate-spin" />}
                         {tournamentStatus === 'joined' ? <CheckCircle className="w-4 h-4" /> : null}
                         {tournamentStatus === 'idle' ? 'JOIN TOURNAMENT' : tournamentStatus === 'joining' ? 'JOINING...' : 'REGISTERED'}
                     </button>
                 </div>

                 {/* Filters */}
                 <div className="flex gap-6 text-sm font-bold text-slate-500 border-b border-white/5 pb-4 mb-6 overflow-x-auto no-scrollbar">
                     {['Daily', 'Global', 'Speedrun', 'Refactoring'].map(tab => (
                         <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`transition-colors whitespace-nowrap ${activeTab === tab ? 'text-blue-500' : 'hover:text-slate-300'}`}
                         >
                             {tab}
                         </button>
                     ))}
                 </div>

                 {/* List */}
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-bold text-white">Active Missions</h3>
                     <button className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors">SEE ALL</button>
                 </div>

                 <div className="space-y-4">
                     {/* Mission 1 */}
                     <div className="sci-card p-4 rounded-xl border border-white/5 flex gap-4 items-center group cursor-pointer hover:border-blue-500/30 transition-all">
                         <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:bg-blue-900/20 group-hover:text-blue-400 transition-colors">
                             <Clock className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                         </div>
                         <div className="flex-1">
                             <div className="flex justify-between mb-1">
                                 <h4 className="text-sm font-bold text-white">Zero-Bugs Speedrun</h4>
                                 <span className="text-[8px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">EASY</span>
                             </div>
                             <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                 <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1.2k Players</span>
                                 <span className="text-blue-400">★ +250 XP</span>
                             </div>
                         </div>
                         <button onClick={() => handleStartChallenge('Easy')} className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-400 transition-all">
                             <Play className="w-4 h-4 fill-current" />
                         </button>
                     </div>

                     {/* Mission 2 */}
                     <div className="sci-card p-4 rounded-xl border border-white/5 flex gap-4 items-center group cursor-pointer hover:border-rose-500/30 transition-all">
                         <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:bg-rose-900/20">
                             <Zap className="w-6 h-6 text-slate-400 group-hover:text-rose-400" />
                         </div>
                         <div className="flex-1">
                             <div className="flex justify-between mb-1">
                                 <h4 className="text-sm font-bold text-white">Refactor the Unrefactorable</h4>
                                 <span className="text-[8px] font-bold bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded">HARD</span>
                             </div>
                             <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                 <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 482 Players</span>
                                 <span className="text-blue-400">★ +850 XP</span>
                             </div>
                         </div>
                         <button onClick={() => handleStartChallenge('Hard')} className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-400 transition-all">
                             <Play className="w-4 h-4 fill-current" />
                         </button>
                     </div>
                     
                     {/* Locked Mission */}
                     <div className={`p-4 rounded-xl border border-white/5 bg-[#050B14] flex gap-4 items-center transition-all ${isPreRegistered ? 'border-purple-500/30 bg-purple-900/10' : 'opacity-60'}`}>
                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center border border-white/10">
                             <Shield className="w-6 h-6 text-white" />
                         </div>
                         <div className="flex-1">
                              <h4 className="text-sm font-bold text-white mb-1">API Architect Open</h4>
                              <p className="text-[10px] text-purple-400 font-bold">Starts in 2d • 15k+ Registered</p>
                         </div>
                         <button 
                            onClick={() => setIsPreRegistered(!isPreRegistered)}
                            className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${
                                isPreRegistered 
                                ? 'bg-purple-600 text-white border-purple-500' 
                                : 'bg-purple-600/20 text-purple-400 border-purple-500/30 hover:bg-purple-600 hover:text-white'
                            }`}
                         >
                             {isPreRegistered ? 'Registered' : 'Pre-Register'}
                         </button>
                     </div>
                 </div>
            </div>
            
            {loading && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-white font-bold animate-pulse">Initializing Environment...</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">Loading virtual container...</p>
                </div>
            )}
        </div>
    );
};

export default Challenges;