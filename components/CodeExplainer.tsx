import React, { useState } from 'react';
import { ExplainerMode } from '../types';
import { explainCodeStream } from '../services/geminiService';
import { Loader2, Play, Book, Briefcase, Zap, Copy, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
    onEarnPoints?: (amount: number) => void;
}

const CodeExplainer: React.FC<Props> = ({ onEarnPoints }) => {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<ExplainerMode>(ExplainerMode.BEGINNER);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setExplanation('');
    
    try {
      const stream = await explainCodeStream(code, mode);
      
      let hasContent = false;
      for await (const chunk of stream) {
        if (chunk.text) {
          setExplanation(prev => prev + chunk.text);
          hasContent = true;
        }
      }
      
      if (hasContent && onEarnPoints) {
          onEarnPoints(10); // Small reward for learning
      }

    } catch (error) {
      console.error(error);
      setExplanation("Error generating explanation. Please check your API Key.");
    } finally {
      setLoading(false);
    }
  };

  const ModeButton = ({ value, icon: Icon, label }: { value: ExplainerMode, icon: any, label: string }) => (
    <button
      onClick={() => setMode(value)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        mode === value 
        ? 'bg-blue-600 text-white' 
        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* Input Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2">
          <ModeButton value={ExplainerMode.BEGINNER} icon={Book} label="Beginner" />
          <ModeButton value={ExplainerMode.INTERVIEW} icon={Briefcase} label="Interview" />
          <ModeButton value={ExplainerMode.OPTIMIZED} icon={Zap} label="Optimized" />
        </div>
        
        <div className="flex-1 relative">
          <textarea
            className="w-full h-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={handleExplain}
            disabled={loading || !code}
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            Explain
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-200">AI Explanation</h3>
          <div className="flex gap-2">
            <button 
                onClick={() => {navigator.clipboard.writeText(explanation)}}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400" 
                title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setExplanation('')}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
                title="Clear"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto bg-slate-800 custom-markdown">
           {explanation ? (
             <div className="prose prose-invert prose-sm max-w-none">
               <ReactMarkdown>{explanation}</ReactMarkdown>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-500">
               <Book className="w-12 h-12 mb-4 opacity-20" />
               <p>Explanation will appear here...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CodeExplainer;
