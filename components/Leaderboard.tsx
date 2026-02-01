import React, { useState, useMemo, useRef } from 'react';
import { UserStats } from '../types';
import { Trophy, Medal, Crown, Search, Info, ChevronLeft, ArrowUp, ArrowDown, Minus, X, Loader2 } from 'lucide-react';

interface Props {
  currentUserStats: UserStats;
  onNavigateToMissions?: () => void;
}

type Timeframe = 'Weekly' | 'Monthly' | 'All-Time';

interface LeaderboardUser {
    rank: number;
    name: string;
    points: number;
    tier: string;
    avatar: string;
    trend: 'up' | 'down' | 'same';
    change: number;
    isCurrentUser?: boolean;
}

const MOCK_DATA: Record<Timeframe, LeaderboardUser[]> = {
    'Weekly': [
        { rank: 1, name: "ByteMaster", points: 3120, tier: "Grandmaster", avatar: "bg-amber-500", trend: 'up', change: 120 },
        { rank: 2, name: "Dev_Silver", points: 2940, tier: "Master", avatar: "bg-slate-600", trend: 'down', change: 45 },
        { rank: 3, name: "CodeNinja", points: 2810, tier: "Diamond", avatar: "bg-cyan-600", trend: 'up', change: 80 },
        { rank: 4, name: "LogicWizard", points: 2790, tier: "Platinum", avatar: "bg-purple-500", trend: 'same', change: 0 },
        { rank: 5, name: "ArraySorcerer", points: 2745, tier: "Platinum", avatar: "bg-pink-500", trend: 'up', change: 15 },
        { rank: 6, name: "AsyncQueen", points: 2680, tier: "Gold", avatar: "bg-emerald-500", trend: 'down', change: 30 },
        { rank: 7, name: "NullPointer", points: 2550, tier: "Gold", avatar: "bg-red-500", trend: 'up', change: 200 },
        { rank: 8, name: "GitPush", points: 2420, tier: "Silver", avatar: "bg-indigo-500", trend: 'same', change: 0 },
        { rank: 124, name: "You", points: 1340, tier: "Silver", avatar: "bg-blue-600", trend: 'up', change: 50, isCurrentUser: true },
    ],
    'Monthly': [
        { rank: 1, name: "Dev_Silver", points: 12500, tier: "Grandmaster", avatar: "bg-slate-600", trend: 'up', change: 450 },
        { rank: 2, name: "ByteMaster", points: 12100, tier: "Grandmaster", avatar: "bg-amber-500", trend: 'down', change: 120 },
        { rank: 3, name: "AlgoRhythm", points: 11800, tier: "Master", avatar: "bg-indigo-500", trend: 'up', change: 800 },
        { rank: 4, name: "CodeNinja", points: 11200, tier: "Diamond", avatar: "bg-cyan-600", trend: 'up', change: 150 },
        { rank: 5, name: "LogicWizard", points: 10500, tier: "Platinum", avatar: "bg-purple-500", trend: 'down', change: 50 },
        { rank: 6, name: "SystemDesign", points: 9800, tier: "Platinum", avatar: "bg-orange-500", trend: 'up', change: 20 },
        { rank: 98, name: "You", points: 4500, tier: "Silver", avatar: "bg-blue-600", trend: 'up', change: 320, isCurrentUser: true },
    ],
    'All-Time': [
        { rank: 1, name: "RootUser", points: 150000, tier: "Legend", avatar: "bg-white", trend: 'same', change: 0 },
        { rank: 2, name: "ByteMaster", points: 142000, tier: "Grandmaster", avatar: "bg-amber-500", trend: 'up', change: 500 },
        { rank: 3, name: "Dev_Silver", points: 138000, tier: "Grandmaster", avatar: "bg-slate-600", trend: 'up', change: 200 },
        { rank: 4, name: "CodeNinja", points: 125000, tier: "Master", avatar: "bg-cyan-600", trend: 'down', change: 100 },
        { rank: 5, name: "LegacyCode", points: 110000, tier: "Diamond", avatar: "bg-gray-500", trend: 'same', change: 0 },
        { rank: 452, name: "You", points: 1340, tier: "Bronze", avatar: "bg-blue-600", trend: 'up', change: 1340, isCurrentUser: true },
    ]
};

const Leaderboard: React.FC<Props> = ({ currentUserStats, onNavigateToMissions }) => {
  const [activeTab, setActiveTab] = useState<Timeframe>('Weekly');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [animating, setAnimating] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Tab Switching Logic
  const handleTabChange = (tab: Timeframe) => {
      if (tab === activeTab) return;
      setAnimating(true);
      setTimeout(() => {
          setActiveTab(tab);
          setAnimating(false);
      }, 300);
  };

  const currentData = MOCK_DATA[activeTab];
  
  // Real-time Filtering
  const filteredData = useMemo(() => {
      return currentData.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [currentData, searchQuery]);

  const topThree = currentData.slice(0, 3);
  const podium1 = topThree[0];
  const podium2 = topThree[1];
  const podium3 = topThree[2];

  // Logic to calculate ranks displayed in the list (excluding top 3)
  const listData = filteredData.filter(u => u.rank > 3);
  const currentUserData = currentData.find(u => u.isCurrentUser);

  return (
    <div className="max-w-md mx-auto min-h-[800px] bg-black rounded-3xl overflow-hidden border border-amber-500/20 relative flex flex-col animate-in fade-in duration-500">
       {/* Header */}
       <div className="p-6 bg-gradient-to-b from-amber-900/20 to-transparent flex-shrink-0">
           <div className="flex justify-between items-center text-amber-500 mb-6 h-8">
               {!searchOpen ? (
                   <>
                       <button className="hover:bg-amber-500/10 p-1 rounded transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                       <h1 className="text-lg font-bold text-white">Global Leaderboard</h1>
                       <div className="flex gap-3">
                           <button onClick={() => setSearchOpen(true)} className="hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
                           <button className="hover:text-white transition-colors"><Info className="w-5 h-5" /></button>
                       </div>
                   </>
               ) : (
                   <div className="flex-1 flex items-center gap-2 animate-in slide-in-from-right duration-200">
                       <Search className="w-4 h-4 text-amber-500" />
                       <input 
                           autoFocus
                           type="text" 
                           placeholder="Search user..." 
                           className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                       />
                       <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}><X className="w-5 h-5" /></button>
                   </div>
               )}
           </div>

           {/* Interactive Tabs */}
           <div className="flex justify-center gap-8 text-sm font-bold text-slate-500 border-b border-white/10 pb-4 mb-8">
               {['Weekly', 'Monthly', 'All-Time'].map((tab) => (
                   <button 
                       key={tab}
                       onClick={() => handleTabChange(tab as Timeframe)}
                       className={`transition-all duration-300 relative ${activeTab === tab ? 'text-amber-400' : 'hover:text-slate-300'}`}
                   >
                       {tab}
                       {activeTab === tab && (
                           <span className="absolute -bottom-[17px] left-0 w-full h-0.5 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-in zoom-in-x duration-300"></span>
                       )}
                   </button>
               ))}
           </div>
           
           {/* Dynamic Podium */}
           <div className={`flex items-end justify-center gap-4 mb-8 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
               {/* 2nd Place */}
               <div className="flex flex-col items-center transform transition-all hover:scale-105 duration-300">
                   <div className="w-14 h-14 rounded-full border-2 border-slate-400 bg-slate-800 p-1 mb-2">
                       <div className={`w-full h-full rounded-full ${podium2.avatar}`}></div>
                   </div>
                   <span className="text-xs font-bold text-white mb-1">{podium2.name}</span>
                   <span className="text-[10px] text-slate-400">{podium2.points} Elo</span>
                   <div className="w-16 h-20 mt-2 bg-gradient-to-t from-slate-800 to-slate-900 rounded-t-lg border-t-2 border-slate-600 flex justify-center pt-2">
                       <span className="text-xl font-bold text-slate-400">#2</span>
                   </div>
               </div>
               
               {/* 1st Place */}
               <div className="flex flex-col items-center -mb-2 z-10 transform transition-all hover:scale-110 duration-300">
                   <div className="text-amber-400 mb-1 animate-bounce"><Crown className="w-6 h-6 fill-current" /></div>
                   <div className="w-20 h-20 rounded-full border-2 border-amber-400 bg-amber-900/20 p-1 mb-2 relative">
                       <div className={`w-full h-full rounded-full ${podium1.avatar}`}></div>
                       <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-black">1</div>
                   </div>
                   <span className="text-sm font-bold text-white mb-1">{podium1.name}</span>
                   <span className="text-[10px] text-amber-400 font-bold">{podium1.points} Elo</span>
                   <div className="w-20 h-28 mt-2 bg-gradient-to-t from-amber-900/40 to-amber-900/10 rounded-t-lg border-t-2 border-amber-400 flex justify-center pt-2 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                       <span className="text-2xl font-bold text-amber-400">#1</span>
                   </div>
               </div>

               {/* 3rd Place */}
               <div className="flex flex-col items-center transform transition-all hover:scale-105 duration-300">
                   <div className="w-14 h-14 rounded-full border-2 border-amber-700 bg-slate-800 p-1 mb-2">
                       <div className={`w-full h-full rounded-full ${podium3.avatar}`}></div>
                   </div>
                   <span className="text-xs font-bold text-white mb-1">{podium3.name}</span>
                   <span className="text-[10px] text-slate-400">{podium3.points} Elo</span>
                   <div className="w-16 h-16 mt-2 bg-gradient-to-t from-amber-900/20 to-slate-900 rounded-t-lg border-t-2 border-amber-700 flex justify-center pt-2">
                       <span className="text-xl font-bold text-amber-700">#3</span>
                   </div>
               </div>
           </div>
       </div>

       {/* Interactive List */}
       <div className="bg-[#0B1121] rounded-t-3xl flex-1 relative flex flex-col min-h-0">
           <div className="p-6 pb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Tier 1 Rankings</h3>
           </div>
           
           <div className="overflow-y-auto px-6 pb-24 space-y-4 custom-scrollbar flex-1" ref={listRef}>
               {animating ? (
                   <div className="flex items-center justify-center h-40">
                       <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                   </div>
               ) : listData.length > 0 ? (
                   listData.map((user) => (
                       <div key={user.rank} className={`flex items-center gap-4 p-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${user.isCurrentUser ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/5 hover:border-amber-500/20'}`}>
                           <span className={`text-sm font-bold w-6 text-center ${user.rank <= 10 ? 'text-white' : 'text-slate-500'}`}>{user.rank}</span>
                           <div className={`w-10 h-10 rounded-full ${user.avatar} shadow-sm`}></div>
                           <div className="flex-1">
                               <h4 className={`text-sm font-bold ${user.isCurrentUser ? 'text-amber-400' : 'text-white'}`}>{user.name} {user.isCurrentUser && '(You)'}</h4>
                               <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                   <span className={user.tier === 'Grandmaster' ? 'text-amber-500' : 'text-slate-400'}>{user.tier}</span>
                               </div>
                           </div>
                           <div className="text-right">
                               <span className="text-amber-400 font-bold text-sm block">{user.points}</span>
                               <div className={`text-[10px] flex items-center justify-end gap-0.5 ${user.trend === 'up' ? 'text-emerald-500' : user.trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
                                   {user.trend === 'up' && <ArrowUp className="w-3 h-3" />}
                                   {user.trend === 'down' && <ArrowDown className="w-3 h-3" />}
                                   {user.trend === 'same' && <Minus className="w-3 h-3" />}
                                   {user.change > 0 && user.change}
                               </div>
                           </div>
                       </div>
                   ))
               ) : (
                   <div className="text-center py-10 text-slate-500 text-sm">No users found.</div>
               )}
           </div>

           {/* Sticky User Rank Footer */}
           {currentUserData && (
               <div className="absolute bottom-6 left-6 right-6 bg-amber-500 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-amber-500/20 text-black animate-in slide-in-from-bottom-4 duration-500 z-20">
                   <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-full ${currentUserData.avatar} border-2 border-black/20`}></div>
                       <div>
                           <div className="text-[10px] font-bold opacity-70 uppercase">Your Position</div>
                           <div className="text-sm font-bold">#{currentUserData.rank} <span className="text-xs font-normal opacity-70 ml-1">Top {currentUserData.rank < 100 ? '1%' : '5%'}</span></div>
                       </div>
                   </div>
                   <button 
                       onClick={onNavigateToMissions}
                       className="bg-black text-amber-500 hover:bg-black/80 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                   >
                       BOOST RANK →
                   </button>
               </div>
           )}
       </div>
    </div>
  );
};

export default Leaderboard;