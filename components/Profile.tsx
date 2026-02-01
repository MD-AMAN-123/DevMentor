import React, { useState } from 'react';
import { UserStats } from '../types';
import { User, Mail, Shield, Settings, LogOut, Award, Zap, X, Check, Bell, Volume2, Globe, Save, Loader2 } from 'lucide-react';

interface Props {
  userStats: UserStats;
  user: { name: string; role: string; email: string };
  onUpdateUser: (u: { name: string; role: string; email: string }) => void;
  onLogout: () => void;
}

const Profile: React.FC<Props> = ({ userStats, user, onUpdateUser, onLogout }) => {
    const [activeModal, setActiveModal] = useState<'edit' | 'achievements' | 'settings' | 'logout' | null>(null);
    
    // Edit Form State
    const [editForm, setEditForm] = useState(user);
    const [saving, setSaving] = useState(false);

    // Settings State
    const [settings, setSettings] = useState({
        notifications: true,
        sound: true,
        publicProfile: false,
        theme: 'Dark'
    });

    const handleSaveProfile = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateUser(editForm);
            setSaving(false);
            setActiveModal(null);
        }, 800);
    };

    const handleLogout = () => {
        setSaving(true);
        setTimeout(() => {
            onLogout();
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-24 relative">
            {/* Profile Header */}
            <div className="sci-card p-6 rounded-2xl border border-emerald-500/20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-emerald-900/20 to-transparent"></div>
                <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full p-1 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4 group cursor-pointer" onClick={() => setActiveModal('edit')}>
                        <div className="w-full h-full bg-slate-700 rounded-full flex items-center justify-center overflow-hidden relative">
                            <span className="text-2xl font-bold text-white">{user.name.split(' ').map(n => n[0]).join('')}</span>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    <p className="text-emerald-400 font-medium text-sm">Level {userStats.level} {user.role}</p>
                    
                    <div className="flex justify-center gap-6 mt-6">
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">{userStats.points}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Total XP</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">{userStats.streak}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Day Streak</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">{userStats.badges.length}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Badges</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Options */}
            <div className="space-y-3">
                 <button 
                    onClick={() => { setEditForm(user); setActiveModal('edit'); }}
                    className="w-full p-4 rounded-xl bg-[#0B1121] border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors group"
                 >
                     <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                         <User className="w-5 h-5" />
                     </div>
                     <span className="flex-1 text-left font-bold text-slate-300">Edit Profile</span>
                 </button>
                 
                 <button 
                    onClick={() => setActiveModal('achievements')}
                    className="w-full p-4 rounded-xl bg-[#0B1121] border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors group"
                 >
                     <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                         <Award className="w-5 h-5" />
                     </div>
                     <span className="flex-1 text-left font-bold text-slate-300">Achievements</span>
                 </button>
                 
                 <button 
                    onClick={() => setActiveModal('settings')}
                    className="w-full p-4 rounded-xl bg-[#0B1121] border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors group"
                 >
                     <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                         <Settings className="w-5 h-5" />
                     </div>
                     <span className="flex-1 text-left font-bold text-slate-300">Settings</span>
                 </button>
                 
                 <button 
                    onClick={() => setActiveModal('logout')}
                    className="w-full p-4 rounded-xl bg-[#0B1121] border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors group"
                 >
                     <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-red-400 group-hover:bg-red-500/10 transition-colors">
                         <LogOut className="w-5 h-5" />
                     </div>
                     <span className="flex-1 text-left font-bold text-slate-300">Log Out</span>
                 </button>
            </div>
            
            <div className="text-center pt-8">
                <p className="text-xs text-slate-600">DevMentor AI v2.4.0</p>
            </div>

            {/* MODALS */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[#0B1121] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
                        <button 
                            onClick={() => setActiveModal(null)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* EDIT PROFILE MODAL */}
                        {activeModal === 'edit' && (
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-6">Edit Profile</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Display Name</label>
                                        <input 
                                            type="text" 
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Role / Title</label>
                                        <input 
                                            type="text" 
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
                                        <input 
                                            type="email" 
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ACHIEVEMENTS MODAL */}
                        {activeModal === 'achievements' && (
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-6">Badges & Achievements</h3>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {userStats.badges.map(badge => (
                                        <div key={badge.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className={`p-3 rounded-full ${badge.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-bold ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                                                <p className="text-xs text-slate-500">{badge.description}</p>
                                            </div>
                                            {badge.unlocked && <Check className="w-5 h-5 text-emerald-500" />}
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 opacity-50">
                                            <div className="p-3 rounded-full bg-slate-800 text-slate-600">
                                                <Zap className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-500">Legendary Coder</h4>
                                                <p className="text-xs text-slate-500">Reach Level 100</p>
                                            </div>
                                            <Settings className="w-5 h-5 text-slate-700" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SETTINGS MODAL */}
                        {activeModal === 'settings' && (
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-6">App Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm font-medium text-white">Notifications</span>
                                        </div>
                                        <button 
                                            onClick={() => setSettings(s => ({...s, notifications: !s.notifications}))}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <Volume2 className="w-5 h-5 text-purple-400" />
                                            <span className="text-sm font-medium text-white">Sound Effects</span>
                                        </div>
                                        <button 
                                            onClick={() => setSettings(s => ({...s, sound: !s.sound}))}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.sound ? 'bg-blue-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.sound ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-emerald-400" />
                                            <span className="text-sm font-medium text-white">Public Profile</span>
                                        </div>
                                        <button 
                                            onClick={() => setSettings(s => ({...s, publicProfile: !s.publicProfile}))}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.publicProfile ? 'bg-blue-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.publicProfile ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LOGOUT MODAL */}
                        {activeModal === 'logout' && (
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                                    <LogOut className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
                                <p className="text-slate-400 mb-6 text-sm">You will be returned to the login screen. All unsaved progress will be lost.</p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setActiveModal(null)}
                                        className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        disabled={saving}
                                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors flex items-center justify-center"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Out"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;