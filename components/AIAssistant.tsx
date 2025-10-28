import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import XMarkIcon from './icons/XMarkIcon';

interface AIAssistantProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a helpful assistant integrated into a dashboard application called MeetWhiz. Be concise and helpful.',
        },
      });
      setMessages([
        {
          id: 'initial',
          text: 'Hello! How can I help you navigate MeetWhiz today?',
          sender: 'ai',
        },
      ]);
    } else {
      setMessages([]);
      chatRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingMessage: Message = { id: 'loading', text: '', sender: 'ai', isLoading: true };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
        if (!chatRef.current) {
            throw new Error("Chat not initialized");
        }
        const result = await chatRef.current.sendMessageStream({ message: input });
        
        let aiResponseText = '';
        setMessages((prev) => prev.filter(m => m.id !== 'loading'));
        const aiMessageId = Date.now().toString();
        setMessages((prev) => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);


        for await (const chunk of result) {
            aiResponseText += chunk.text;
            setMessages((prev) => prev.map(m => m.id === aiMessageId ? { ...m, text: aiResponseText } : m));
        }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter(m => m.id !== 'loading'));
      setMessages((prev) => [
        ...prev,
        {
          id: 'error',
          text: 'Sorry, something went wrong. Please try again.',
          sender: 'ai',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-full max-w-lg h-[70vh] bg-white rounded-lg shadow-2xl flex flex-col">
        <header className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-purple-600" />
            AI Assistant
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="w-6 h-6" />
            </button>
        </header>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            <div className="space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                >
                    {msg.isLoading ? (
                        <div className="flex items-center justify-center space-x-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                        </div>
                    ) : (
                        <p className="text-sm">{msg.text}</p>
                    )}
                </div>
                </div>
            ))}
            </div>
            <div ref={messagesEndRef} />
        </div>
        <footer className="p-4 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-purple-700 transition"
            >
                <PaperAirplaneIcon className="w-5 h-5" />
            </button>
            </form>
        </footer>
        </div>
    </div>
  );
};

export default AIAssistant;
