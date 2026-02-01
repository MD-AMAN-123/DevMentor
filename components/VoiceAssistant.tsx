import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MicOff, X, Activity } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const VoiceAssistant: React.FC<Props> = ({ isOpen, onClose }) => {
    const [connected, setConnected] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [volume, setVolume] = useState(0);
    const [error, setError] = useState<string | null>(null);
    
    // Audio Context Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const sessionRef = useRef<Promise<any> | null>(null);
    const outputContextRef = useRef<AudioContext | null>(null);
    
    // Audio Scheduling
    const nextStartTimeRef = useRef<number>(0);
    const scheduledSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    useEffect(() => {
        if (isOpen) {
            setError(null);
            connectToLiveAPI();
        } else {
            disconnect();
        }
        return () => disconnect();
    }, [isOpen]);

    const connectToLiveAPI = async () => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Initialize Audio Contexts
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;
            
            // Get User Media
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setConnected(true);
                        setupAudioProcessing(sessionPromise);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData) {
                            setIsTalking(true);
                            await playAudio(audioData);
                        }
                    },
                    onclose: () => {
                        setConnected(false);
                        setIsTalking(false);
                    },
                    onerror: (err) => {
                        console.error("Live API Error:", err);
                        setError("Connection Error");
                        setConnected(false);
                        setIsTalking(false);
                    }
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                    },
                    systemInstruction: "You are DevMentor AI, a helpful and concise coding assistant. Keep answers brief and technical."
                }
            });
            
            sessionRef.current = sessionPromise;
            
            // Handle connection failures immediately
            sessionPromise.catch((err) => {
                console.error("Failed to connect:", err);
                setError("Network Error");
                setConnected(false);
            });

        } catch (error) {
            console.error("Failed to initialize:", error);
            setError("Initialization Error");
            setConnected(false);
        }
    };

    const setupAudioProcessing = (sessionPromise: Promise<any>) => {
        if (!audioContextRef.current || !streamRef.current) return;
        
        sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
        processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
        
        processorRef.current.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Volume visualization
            let sum = 0;
            for(let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
            setVolume(Math.sqrt(sum / inputData.length) * 100);

            const pcmBlob = createBlob(inputData);
            
            // Only send if connected
            sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
            }).catch(() => {
                // Ignore send errors if session is closed/failed
            });
        };

        sourceRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);
    };

    const playAudio = async (base64Audio: string) => {
        if (!outputContextRef.current) return;
        const ctx = outputContextRef.current;
        
        try {
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            
            // Scheduling to avoid overlap
            const currentTime = ctx.currentTime;
            if (nextStartTimeRef.current < currentTime) {
                nextStartTimeRef.current = currentTime;
            }
            
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            
            scheduledSourcesRef.current.add(source);
            
            source.onended = () => {
                scheduledSourcesRef.current.delete(source);
                if (scheduledSourcesRef.current.size === 0) {
                    setIsTalking(false);
                }
            };
        } catch (e) {
            console.error("Audio playback error", e);
        }
    };

    const disconnect = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current.onaudioprocess = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        
        // Stop all scheduled sources
        scheduledSourcesRef.current.forEach(source => {
            try { source.stop(); } catch(e) {}
        });
        scheduledSourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        if (outputContextRef.current && outputContextRef.current.state !== 'closed') {
            outputContextRef.current.close();
        }
        
        sessionRef.current?.then((session: any) => {
             // Checking if session has close method and call it
             if(session && typeof session.close === 'function') {
                 session.close();
             }
        }).catch(() => {}); // catch if session failed to open
        
        setConnected(false);
        setIsTalking(false);
        setVolume(0);
    };

    // Helper functions
    function createBlob(data: Float32Array): { data: string, mimeType: string } {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    }

    function encode(bytes: Uint8Array) {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function decode(base64: string) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
        // Assuming 24kHz sample rate from config
        const sampleRate = 24000; 
        const numChannels = 1;
        
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
        
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-8 relative">
                <div className="relative">
                    {/* Glowing Orb Animation */}
                    <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
                        error ? 'bg-red-900/50 shadow-[0_0_60px_rgba(220,38,38,0.5)]' :
                        connected 
                            ? isTalking 
                                ? 'bg-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.8)] scale-110' 
                                : `bg-blue-600 shadow-[0_0_60px_rgba(37,99,235,0.5)] scale-${100 + Math.min(volume, 20)}`
                            : 'bg-slate-700'
                    }`}>
                        {error ? (
                            <Activity className="w-16 h-16 text-red-500" />
                        ) : connected ? (
                             <Activity className={`w-16 h-16 text-white ${isTalking ? 'animate-pulse' : ''}`} />
                        ) : (
                             <MicOff className="w-12 h-12 text-slate-400" />
                        )}
                        
                        {/* Ripple Effects */}
                        {connected && !error && (
                            <>
                                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-[ping_2s_infinite]"></div>
                                <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_3s_infinite_0.5s]"></div>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">DevMentor Live</h2>
                    <p className={`text-sm font-medium ${error ? 'text-red-400' : connected ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {error ? `Error: ${error}` : connected ? (isTalking ? "Speaking..." : "Listening...") : "Connecting..."}
                    </p>
                    {error && (
                        <button 
                            onClick={() => { disconnect(); connectToLiveAPI(); }}
                            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors"
                        >
                            Retry Connection
                        </button>
                    )}
                </div>
                
                {!error && (
                    <div className="flex justify-center gap-4">
                         <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                             Native Audio
                         </div>
                         <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                             Real-time
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceAssistant;