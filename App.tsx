import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BrainCircuit,
  Map,
  Code2,
  Bug,
  Menu,
  X,
  Cpu,
  Trophy,
  Zap,
  Activity,
  Layers,
  Mic,
  LifeBuoy,
  User
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import SkillAssessment from './components/SkillAssessment';
import Roadmap from './components/Roadmap';
import CodeExplainer from './components/CodeExplainer';
import Debugger from './components/Debugger';
import Leaderboard from './components/Leaderboard';
import Challenges from './components/Challenges';
import VoiceAssistant from './components/VoiceAssistant';
import Support from './components/Support';
import Profile from './components/Profile';
import LoginScreen from './components/LoginScreen';
import { AppMode, Skill, UserStats } from './types';

function App() {
  // Auth State
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);

  // 🔥 IMPORTANT: mode must be nullable until login
  const [mode, setMode] = useState<AppMode | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Shared state
  const [skills, setSkills] = useState<Skill[]>([]);

  // Gamification State
  const [userStats, setUserStats] = useState<UserStats>({
    points: 1340,
    level: 48,
    streak: 7,
    badges: [
      { id: '1', name: 'Master Architect', description: 'Designed 5 systems', icon: 'map', unlocked: true },
      { id: '2', name: 'Bug Slayer', description: 'Fixed critical errors', icon: 'bug', unlocked: true },
      { id: '3', name: 'Speed Demon', description: 'Fast solver', icon: 'zap', unlocked: true },
    ],
  });

  const [notification, setNotification] = useState<{ message: string; type: 'points' | 'badge' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ✅ FIXED LOGIN HANDLER
  const handleLogin = (userData: any) => {
    setUser(userData);

    // 🔥 RESET APP STATE AFTER LOGIN
    setMode(AppMode.DASHBOARD);
    setSidebarOpen(false);
    setVoiceOpen(false);

    setNotification({
      message: `Welcome back, ${userData.name.split(' ')[0]}`,
      type: 'points',
    });
  };

  const handleLogout = () => {
    setUser(null);
    setMode(null);
    setSidebarOpen(false);
    setVoiceOpen(false);
  };

  // 🔐 LOGIN SCREEN
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // 🛟 SAFETY FALLBACK (prevents blank screen in prod)
  if (!mode) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading workspace…
      </div>
    );
  }

  // ⬇️ everything below stays EXACTLY as you already wrote ⬇️
  const NavItem = ({
    value,
    icon: Icon,
    label,
  }: {
    value: AppMode;
    icon: any;
    label: string;
  }) => {
    const isActive = mode === value;

    return (
      <button
        onClick={() => {
          setMode(value);
          setSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
          ? 'text-white bg-white/5 border border-white/10'
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
          }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''}`} />
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  };
  const handleEarnPoints = (amount: number) => {
    setUserStats(prev => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 1000) + 1;

      if (newLevel > prev.level) {
        setNotification({ message: `Level Up! Level ${newLevel}`, type: 'badge' });
      } else {
        setNotification({ message: `+${amount} XP`, type: 'points' });
      }

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
      };
    });
  };


  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-20 md:pb-0 animate-in fade-in duration-700">

      {/* Mobile Header */}
      <div className="md:hidden bg-[#030712] border-b border-white/5 p-4 flex justify-between items-center z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-500" />
          <h1 className="font-bold text-white text-lg tracking-tight">DevMentor AI</h1>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 h-screen w-72 bg-[#020617] border-r border-white/5 flex flex-col z-40 transition-transform duration-300
          pt-20 pb-24 px-5 md:p-5
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="hidden md:flex items-center gap-3 px-2 mb-10 mt-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Cpu className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none tracking-tight">DevMentor AI</h1>
              <span className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] uppercase">Active</span>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Core Engine</p>
              <div className="space-y-1">
                <NavItem value={AppMode.DASHBOARD} icon={Activity} label="Skill Analytics" />
                <NavItem value={AppMode.ASSESSMENT} icon={BrainCircuit} label="AI Assessment" />
                <NavItem value={AppMode.ROADMAP} icon={Map} label="Mastery Path" />
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Tools</p>
              <div className="space-y-1">
                <NavItem value={AppMode.EXPLAINER} icon={Layers} label="Code Insight Lab" />
                <NavItem value={AppMode.DEBUGGER} icon={Bug} label="Debug Console" />
                <button
                  onClick={() => {
                    setVoiceOpen(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative text-slate-500 hover:text-slate-300 hover:bg-white/5"
                >
                  <Mic className="w-5 h-5 transition-colors group-hover:text-emerald-400" />
                  <span className="font-medium text-sm tracking-wide">Voice Mode</span>
                </button>
              </div>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Community</p>
              <div className="space-y-1">
                <NavItem value={AppMode.CHALLENGES} icon={Zap} label="Daily Missions" />
                <NavItem value={AppMode.LEADERBOARD} icon={Trophy} label="Global Rankings" />
              </div>
            </div>

            {/* Desktop Support Link */}
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Help</p>
              <div className="space-y-1">
                <NavItem value={AppMode.SUPPORT} icon={LifeBuoy} label="Support Agent" />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 hidden md:block">
            <button
              onClick={() => setMode(AppMode.PROFILE)}
              className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5 w-full hover:bg-white/5 transition-colors text-left"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/10">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#020617]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500">Lvl {userStats.level} {user.role}</p>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden relative">
          <div className="max-w-6xl mx-auto h-full">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {mode === AppMode.DASHBOARD && <Dashboard userStats={userStats} />}
              {mode === AppMode.ASSESSMENT && (
                <SkillAssessment
                  onSkillsAnalyzed={(res) => setSkills(res)}
                  onEarnPoints={handleEarnPoints}
                />
              )}
              {mode === AppMode.ROADMAP && <Roadmap weakSkills={skills} onEarnPoints={handleEarnPoints} />}
              {mode === AppMode.EXPLAINER && <CodeExplainer onEarnPoints={handleEarnPoints} />}
              {mode === AppMode.DEBUGGER && <Debugger onEarnPoints={handleEarnPoints} />}
              {mode === AppMode.CHALLENGES && <Challenges onEarnPoints={handleEarnPoints} />}
              {mode === AppMode.LEADERBOARD && (
                <Leaderboard
                  currentUserStats={userStats}
                  onNavigateToMissions={() => setMode(AppMode.CHALLENGES)}
                />
              )}
              {mode === AppMode.SUPPORT && <Support />}
              {mode === AppMode.PROFILE && <Profile userStats={userStats} user={user} onUpdateUser={setUser} onLogout={handleLogout} />}
            </div>
          </div>

          {/* Sci-Fi Notification Toast */}
          {notification && (
            <div className={`fixed bottom-24 md:bottom-8 right-8 px-6 py-4 rounded-lg flex items-center gap-4 z-50 animate-in slide-in-from-right duration-500 border bg-[#0B1121]/90 backdrop-blur-md ${notification.type === 'badge'
              ? 'border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              }`}>
              <div className={`p-2 rounded-md ${notification.type === 'badge' ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                {notification.type === 'badge' ? <Trophy className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{notification.type === 'badge' ? 'Achievement' : 'System'}</p>
                <span className="font-bold text-lg tracking-tight text-white">{notification.message}</span>
              </div>
            </div>
          )}
        </main>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Voice Assistant Overlay */}
      <VoiceAssistant isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />

      {/* Mobile Sticky Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#020617]/90 backdrop-blur-xl border-t border-white/10 z-50 flex justify-between items-center px-6 py-3 pb-safe">
        <button
          onClick={() => setMode(AppMode.DASHBOARD)}
          className={`flex flex-col items-center gap-1 ${mode === AppMode.DASHBOARD ? 'text-emerald-400' : 'text-slate-500'}`}
        >
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => setMode(AppMode.SUPPORT)}
          className={`flex flex-col items-center gap-1 ${mode === AppMode.SUPPORT ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <LifeBuoy className="w-6 h-6" />
          <span className="text-[10px] font-bold">Support</span>
        </button>

        {/* Central Voice AI Button */}
        <button
          onClick={() => setVoiceOpen(true)}
          className="relative -top-6 p-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-4 border-[#020617] transform transition-transform active:scale-95"
        >
          <Mic className="w-6 h-6 text-black" />
        </button>

        <button
          onClick={() => setMode(AppMode.CHALLENGES)}
          className={`flex flex-col items-center gap-1 ${mode === AppMode.CHALLENGES ? 'text-blue-400' : 'text-slate-500'}`}
        >
          <Zap className="w-6 h-6" />
          <span className="text-[10px] font-bold">Tasks</span>
        </button>

        <button
          onClick={() => setMode(AppMode.PROFILE)}
          className={`flex flex-col items-center gap-1 ${mode === AppMode.PROFILE ? 'text-purple-400' : 'text-slate-500'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
}

export default App;
