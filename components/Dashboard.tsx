import React from 'react';
import {
    AreaChart, Area, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Target, Bug, Zap, Activity, Clock, Shield, CheckCircle, Bell, X } from 'lucide-react';
import { UserStats, Badge, Notification } from '../types';

interface Props {
    userStats: UserStats;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const velocityData = [
    { name: 'Mon', speed: 45 },
    { name: 'Tue', speed: 52 },
    { name: 'Wed', speed: 49 },
    { name: 'Thu', speed: 62 },
    { name: 'Fri', speed: 58 },
    { name: 'Sat', speed: 71 },
    { name: 'Sun', speed: 65 },
];

const StatCard = ({ icon: Icon, label, value, sub, colorClass }: { icon: any, label: string, value: string, sub?: string, colorClass: string }) => (
    <div className="sci-card p-5 rounded-xl relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-16 rounded-full blur-3xl opacity-5 -mr-8 -mt-8 ${colorClass.replace('text-', 'bg-')}`}></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-2.5 rounded-lg bg-white/5 border border-white/5`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            {sub && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    {sub}
                </span>
            )}
        </div>

        <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">{label}</p>
        </div>
    </div>
);

const BadgeItem: React.FC<{ badge: Badge }> = ({ badge }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors">
        <div className={`p-2 rounded-full ${badge.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
            <Target className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-bold truncate ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
            <p className="text-[10px] text-slate-500 truncate">{badge.description}</p>
        </div>
    </div>
);

const Dashboard: React.FC<Props> = ({ userStats, notifications, setNotifications }) => {
    const [showNotifications, setShowNotifications] = React.useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const nextLevelXP = (userStats.level + 1) * 1000;
    const currentLevelXP = userStats.level * 1000;
    const progress = ((userStats.points - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    const normalizedProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className="space-y-8">

            {/* Welcome Banner */}
            <div className="sci-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>

                <div className="relative z-10 space-y-6 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Code smarter, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                            not harder.
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                        The advanced AI copilot that assesses your skills, debugs your errors, and builds your career roadmap in real-time.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 pt-2">
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>Real-time Voice Debugging</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>Personalized Skill Analysis</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300 font-medium">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span>Interview Prep Mode</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center relative">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Skill Analytics</h2>
                    <p className="text-slate-500 text-sm">Welcome back, Architect.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                if (!showNotifications) markAllAsRead();
                            }}
                            className={`p-2.5 rounded-xl transition-all duration-300 relative group ${showNotifications ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                                }`}
                        >
                            <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#030712] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            )}
                        </button>

                        {/* Notification Screen (Toggle) */}
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-3 w-80 bg-[#0B1121]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Alerts</h3>
                                    <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-slate-500 text-sm">No transmissions found.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className={`p-4 hover:bg-white/[0.02] transition-colors relative ${!notif.read ? 'bg-emerald-500/[0.02]' : ''}`}>
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 p-1.5 rounded-lg ${notif.type === 'badge' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                notif.type === 'points' ? 'bg-blue-500/20 text-blue-400' :
                                                                    'bg-slate-800 text-slate-400'
                                                            }`}>
                                                            {notif.type === 'badge' ? <Zap className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-slate-200">{notif.title}</p>
                                                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                                                            <p className="text-[9px] text-slate-600 mt-1.5 font-mono">
                                                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-white/5 bg-white/5 text-center">
                                    <button className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">
                                        View Full Log
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all">
                        <Activity className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Stats Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Banner */}
                    <div className="relative p-6 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-900/10 to-transparent overflow-hidden">
                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/50 flex items-center justify-center bg-emerald-500/10">
                                    <span className="text-emerald-400 font-bold">{userStats.level}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Level {userStats.level} Progress</h3>
                                    <p className="text-emerald-400/80 text-xs">{Math.floor(nextLevelXP - userStats.points)} XP remaining for Master Architect badge</p>
                                </div>
                            </div>
                            <div className="w-full sm:w-48">
                                <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                                    <span>{userStats.points} XP</span>
                                    <span>{nextLevelXP} XP</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${normalizedProgress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard icon={Zap} label="Logic" value="88" colorClass="text-emerald-400" />
                        <StatCard icon={Shield} label="Security" value="Top 2%" colorClass="text-blue-400" />
                        <StatCard icon={Clock} label="Speed" value="95" colorClass="text-purple-400" />
                        <StatCard icon={Bug} label="Bugs Fix" value="142" sub="+12%" colorClass="text-emerald-400" />
                    </div>

                    {/* Velocity Chart */}
                    <div className="sci-card p-6 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-white">Velocity Boost</h3>
                                <p className="text-slate-500 text-xs">Last 7 days avg.</p>
                            </div>
                            <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded">+25%</span>
                        </div>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={velocityData}>
                                    <defs>
                                        <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' }}
                                        itemStyle={{ color: '#10b981' }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="speed"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSpeed)"
                                    />
                                    <XAxis dataKey="name" hide />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* "Skill Matrix" Visual Mockup */}
                    <div className="sci-card p-6 rounded-xl flex flex-col items-center justify-center aspect-square relative">
                        <h3 className="absolute top-6 left-6 text-sm font-bold text-slate-400 uppercase tracking-wider">Skill Matrix</h3>

                        {/* Visual CSS Radar Chart */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <div className="absolute inset-0 border border-emerald-500/20 rotate-45"></div>
                            <div className="absolute inset-4 border border-emerald-500/20 rotate-45"></div>
                            <div className="absolute inset-8 border border-emerald-500/20 rotate-45"></div>

                            {/* The shape */}
                            <div className="absolute inset-0 w-full h-full" style={{
                                clipPath: 'polygon(50% 0%, 100% 25%, 80% 100%, 20% 100%, 0% 25%)',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '2px solid #10b981'
                            }}></div>

                            {/* Labels placed absolutely */}
                            <span className="absolute -top-6 text-[10px] font-bold text-slate-500">LOGIC</span>
                            <span className="absolute -right-8 top-10 text-[10px] font-bold text-slate-500">SPEED</span>
                            <span className="absolute -left-8 top-10 text-[10px] font-bold text-slate-500">DOCS</span>
                            <span className="absolute bottom-[-20px] left-0 text-[10px] font-bold text-slate-500">TESTING</span>
                            <span className="absolute bottom-[-20px] right-0 text-[10px] font-bold text-slate-500">SECURITY</span>
                        </div>
                    </div>

                    <div className="sci-card p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Recent Masteries</h3>
                        <div className="space-y-2">
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">B-Tree Indexing</span>
                                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">JWT Auth</span>
                                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">gRPC</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Badges</h3>
                            <div className="space-y-2">
                                {userStats.badges.slice(0, 3).map(b => <BadgeItem key={b.id} badge={b} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;