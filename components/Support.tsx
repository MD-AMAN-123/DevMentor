import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Loader2, Bot, User, LifeBuoy } from 'lucide-react';
import { ChatMessage } from '../types';

const Support: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'Hello! I am the DevMentor Support Agent. How can I help you with the app or your account today?', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    { role: 'user', parts: [{ text: `You are a friendly customer support agent for DevMentor AI. Help the user with this query: ${input}` }] }
                ]
            });

            const botMsg: ChatMessage = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: response.text || "I'm having trouble connecting to the support server.", 
                timestamp: Date.now() 
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto h-[calc(100vh-8rem)] flex flex-col bg-[#0B1121] rounded-2xl border border-white/10 overflow-hidden relative">
            <div className="p-4 border-b border-white/10 bg-[#020617] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600">
                    <LifeBuoy className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white">Customer Support</h2>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-blue-600/20 text-blue-400'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                            msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl rounded-tl-none border border-white/5 flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-[#020617] border-t border-white/10">
                <div className="flex gap-2">
                    <input 
                        type="text"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="Type your issue..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input || loading}
                        className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
