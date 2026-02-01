import React, { useState } from 'react';
import { debugError } from '../services/geminiService';
import { DebugResult } from '../types';
import { Bug, AlertCircle, Wrench, Lightbulb, Loader2 } from 'lucide-react';

interface Props {
    onEarnPoints?: (amount: number) => void;
}

const Debugger: React.FC<Props> = ({ onEarnPoints }) => {
  const [errorLog, setErrorLog] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DebugResult | null>(null);

  const handleDebug = async () => {
    if (!errorLog) return;
    setLoading(true);
    try {
      const debugRes = await debugError(errorLog, context);
      setResult(debugRes);
      if (onEarnPoints) onEarnPoints(25);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8 animate-in fade-in duration-500">
      <div className="md:col-span-2 space-y-4">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <label className="block text-sm font-medium text-slate-400 mb-2">Error Log / Stack Trace</label>
          <textarea
            className="w-full h-32 bg-slate-900 border border-red-900/30 rounded-lg p-3 text-red-300 font-mono text-xs focus:ring-1 focus:ring-red-500 outline-none resize-none"
            placeholder="Uncaught TypeError: Cannot read properties of undefined..."
            value={errorLog}
            onChange={(e) => setErrorLog(e.target.value)}
          />
        </div>
        
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <label className="block text-sm font-medium text-slate-400 mb-2">Relevant Code (Optional)</label>
          <textarea
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            placeholder="const user = ...;"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <button
          onClick={handleDebug}
          disabled={loading || !errorLog}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-red-900/20"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Bug className="w-5 h-5" />}
          Debug Now
        </button>
      </div>

      <div className="md:col-span-3">
        {result ? (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <div className="bg-red-500/10 border-b border-red-500/20 p-4 flex items-center gap-3">
                <AlertCircle className="text-red-500 w-5 h-5" />
                <h3 className="font-semibold text-red-100">Root Cause Analysis</h3>
              </div>
              <div className="p-5 text-slate-300 leading-relaxed">
                {result.analysis}
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-4 flex items-center gap-3">
                <Wrench className="text-emerald-500 w-5 h-5" />
                <h3 className="font-semibold text-emerald-100">Suggested Fix</h3>
              </div>
              <div className="p-5">
                <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto">
                  <code className="text-emerald-400 font-mono text-sm">{result.fix}</code>
                </pre>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <div className="bg-blue-500/10 border-b border-blue-500/20 p-4 flex items-center gap-3">
                <Lightbulb className="text-blue-500 w-5 h-5" />
                <h3 className="font-semibold text-blue-100">Learning Opportunity</h3>
              </div>
              <div className="p-5 text-slate-300">
                {result.concept}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl p-8">
            <Bug className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-center">Paste an error log to start the <br/>AI Debugging Engine</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Debugger;
