export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  ASSESSMENT = 'ASSESSMENT',
  ROADMAP = 'ROADMAP',
  EXPLAINER = 'EXPLAINER',
  DEBUGGER = 'DEBUGGER',
  CHALLENGES = 'CHALLENGES',
  LEADERBOARD = 'LEADERBOARD',
  INTERVIEW = 'INTERVIEW',
  SUPPORT = 'SUPPORT',
  PROFILE = 'PROFILE'
}

export interface Skill {
  category: string;
  name: string;
  score: number; // 0-100
  status: 'weak' | 'moderate' | 'strong';
}

export interface RoadmapItem {
  day: string;
  topic: string;
  tasks: string[];
  resources: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DebugResult {
  analysis: string;
  fix: string;
  concept: string;
}

export enum ExplainerMode {
  BEGINNER = 'Beginner',
  INTERVIEW = 'Interview',
  OPTIMIZED = 'Optimized'
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  unlocked: boolean;
}

export interface UserStats {
  points: number;
  level: number;
  badges: Badge[];
  streak: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  starterCode: string;
}

export interface ChallengeResult {
  passed: boolean;
  feedback: string;
  score: number;
}