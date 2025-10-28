import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import MicrophoneIcon from './icons/MicrophoneIcon';

type TaggedItem = {
    id: number;
    text: string;
    type: 'Action' | 'Decision' | 'Question';
};

const LiveMeetingView: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState<string[]>([]);
    const [taggedItems, setTaggedItems] = useState<TaggedItem[]>([]);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    const recognitionRef = useRef<any>(null);
    // FIX: The type for the timeout ref was incorrect for a browser environment. Changed NodeJS.Timeout to number.
    const aiTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        // FIX: Cast window to `any` to access browser-specific SpeechRecognition APIs.
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        const finalTranscript = event.results[i][0].transcript.trim() + '. ';
                        setTranscript(prev => [...prev, finalTranscript]);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
             if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current);
            }
        };
    }, []);
    
    useEffect(() => {
        if (isListening && transcript.length > 0) {
            if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current);
            }
            aiTimeoutRef.current = setTimeout(getAiInsights, 5000);
        }
    }, [transcript, isListening]);


    const getAiInsights = async () => {
        if (isLoadingAi) return;
        setIsLoadingAi(true);

        const recentTranscript = transcript.slice(-5).join(' ');
        if (recentTranscript.length < 50) { // Don't run on very short text
            setIsLoadingAi(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `From the following live meeting transcript, identify potential action items, key decisions, or unanswered questions. Be concise. Transcript: "${recentTranscript}"`,
            });
            const newSuggestion = response.text.trim();
            if (newSuggestion && !aiSuggestions.includes(newSuggestion)) {
                 setAiSuggestions(prev => [newSuggestion, ...prev].slice(0, 5));
            }
        } catch (error) {
            console.error("Error getting AI insights:", error);
        } finally {
            setIsLoadingAi(false);
        }
    };

    const handleToggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript([]);
            setTaggedItems([]);
            setAiSuggestions([]);
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleTagItem = (text: string, type: TaggedItem['type']) => {
        const newItem: TaggedItem = { id: Date.now(), text, type };
        setTaggedItems(prev => [...prev, newItem]);
    };
    
    const acceptSuggestion = (suggestion: string) => {
        handleTagItem(suggestion, 'Action'); // Defaulting to Action for simplicity
        setAiSuggestions(prev => prev.filter(s => s !== suggestion));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Live Meeting Scribe</h1>
            <p className="mt-2 text-gray-600 mb-6">Capture your meeting in real-time with AI-powered assistance.</p>

            <div className="text-center mb-6">
                <button
                    onClick={handleToggleListen}
                    className={`px-8 py-4 text-white font-bold rounded-full transition-all duration-300 flex items-center mx-auto ${
                        isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                >
                    <MicrophoneIcon className="w-6 h-6 mr-3" />
                    {isListening ? 'End Session' : 'Start Session'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Transcript */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Transcript</h2>
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-md">
                        {transcript.length === 0 && !isListening && (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Click "Start Session" to begin transcription.
                            </div>
                        )}
                        {transcript.map((line, index) => (
                            <div key={index} className="group flex items-start mb-2">
                                <p className="flex-1 text-gray-700">{line}</p>
                                <button onClick={() => handleTagItem(line, 'Action')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md">Tag Action</button>
                            </div>
                        ))}
                         {isListening && <div className="text-gray-400">Listening...</div>}
                    </div>
                </div>

                {/* AI Insights & Tagged Items */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Suggestions</h2>
                         <div className="h-40 overflow-y-auto space-y-2">
                             {isLoadingAi && <p className="text-gray-500 text-sm">Analyzing...</p>}
                             {aiSuggestions.map((s, i) => (
                                 <div key={i} className="p-2 bg-purple-50 rounded-md text-sm text-purple-800">
                                     <p>{s}</p>
                                     <button onClick={() => acceptSuggestion(s)} className="font-bold text-purple-600 mt-1">Accept</button>
                                 </div>
                             ))}
                             {!isLoadingAi && aiSuggestions.length === 0 && <p className="text-gray-500 text-sm">AI insights will appear here.</p>}
                         </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tagged Items</h2>
                         <div className="h-40 overflow-y-auto space-y-2">
                             {taggedItems.map(item => (
                                 <div key={item.id} className="p-2 bg-green-50 rounded-md text-sm text-green-800">
                                     <strong>{item.type}: </strong>{item.text}
                                 </div>
                             ))}
                              {taggedItems.length === 0 && <p className="text-gray-500 text-sm">Your tagged items will appear here.</p>}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveMeetingView;
