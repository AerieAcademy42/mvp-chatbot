
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiChatResponse } from '../services/geminiService';
import { aerieLogger } from '../services/loggingService';
import { ChatMessage } from '../types';

interface ChatbotProps {
  onGoHome: () => void;
  onStartTestAction: () => void;
}

interface ExtendedChatMessage extends ChatMessage {
  suggestions?: string[];
  isError?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ onGoHome, onStartTestAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'synced'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized, isLoading, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const lowerText = textToSend.toLowerCase();
    
    // Quick actions
    if (lowerText.includes('take') && lowerText.includes('mock test')) {
      onStartTestAction();
      setIsOpen(false);
      return;
    }
    
    if (lowerText.includes('check out our courses') || lowerText.includes('view courses')) {
      window.open('https://www.aerieacademy.com/courses', '_blank');
      return;
    }

    const userMsg: ExtendedChatMessage = { role: 'user', parts: [{ text: textToSend }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setSyncStatus('idle');

    try {
      const result = await getGeminiChatResponse(messages, textToSend);
      
      const aiMsg: ExtendedChatMessage = { 
        role: 'model', 
        parts: [{ text: result.text }],
        suggestions: result.suggestions || []
      };

      aerieLogger.logInteraction(textToSend, result.text);
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      const errorMsg: ExtendedChatMessage = {
        role: 'model',
        parts: [{ text: "❌ **Connection Error**: I couldn't reach my brain. Please check your internet connection or API Key configuration." }],
        isError: true,
        suggestions: ["Retry", "Check Courses"]
      };
      setMessages(prev => [...prev, errorMsg]);
      aerieLogger.logInteraction(textToSend, "ERROR: UI Failure");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncToProject = () => {
    const result = aerieLogger.syncToMasterFile();
    if (result.success) {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } else {
      alert(result.message);
    }
  };

  const renderText = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, idx) => (
      <p key={idx} className={idx > 0 ? "mt-4" : ""}>
        {paragraph.split('\n').map((line, lidx) => {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <React.Fragment key={lidx}>
              {parts.map((part, pidx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={pidx} className="font-black text-[#1A5276]">{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
              {lidx < paragraph.split('\n').length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </p>
    ));
  };

  if (isMinimized && isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#1A5276] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border-2 border-white animate-pulse"
        >
          <div className="bg-green-400 w-2 h-2 rounded-full"></div>
          <span className="font-bold text-sm tracking-tight uppercase">Chat with Aerie Mentor</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showPromo && !isOpen && (
        <div className="absolute bottom-24 right-0 w-[280px] mb-2 transition-all animate-in slide-in-from-right-10 duration-700">
           <div className="bg-[#1A5276] text-white p-5 rounded-[24px] shadow-2xl relative border border-white/10 group">
              <div className="flex items-center gap-4">
                 <div className="bg-[#3498DB] p-2.5 rounded-2xl shadow-lg shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black leading-none uppercase tracking-[0.2em] mb-1.5 opacity-60">AI Mentor</p>
                    <p className="text-[13px] font-bold leading-tight text-white/90">Ask anything about Architecture</p>
                 </div>
              </div>
              {/* Tooltip Tail */}
              <div className="absolute -bottom-2 right-10 w-4 h-4 bg-[#1A5276] rotate-45 border-r border-b border-white/10 shadow-lg"></div>
              
              {/* Minimal Close Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); setShowPromo(false); }} 
                className="absolute -top-2 -right-2 bg-white text-[#1A5276] rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-transparent hover:border-[#3498DB] transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setShowPromo(false); }}
          className="bg-[#3498DB] hover:bg-[#1A5276] text-white p-5 rounded-full shadow-[0_20px_50px_rgba(52,152,219,0.3)] transition-all duration-500 flex items-center group border-4 border-white hover:scale-110 active:scale-95"
        >
          <svg className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[380px] md:w-[450px] max-h-[85vh] h-[650px] rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.15)] flex flex-col border border-gray-100 animate-in fade-in slide-in-from-bottom-8 mb-4">
          <div className="bg-[#1A5276] p-6 lg:p-8 rounded-t-[40px] flex justify-between items-center text-white shadow-lg relative">
            <div className="flex items-center gap-4">
              <button onClick={() => { onGoHome(); setIsOpen(false); }} className="bg-white/10 p-2.5 rounded-2xl hover:bg-white/20 transition-all">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </button>
              <div>
                <h3 className="font-black text-lg tracking-tight uppercase leading-none">Aerie AI</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-80 font-black mt-2">Professional Mentor</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleSyncToProject} title="Download Log" className={`p-2.5 rounded-2xl transition-all ${syncStatus === 'synced' ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
              </button>
              <button onClick={() => setIsMinimized(true)} className="hover:bg-white/10 p-2.5 rounded-2xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg></button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2.5 rounded-2xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 jee-scrollbar bg-white">
            {messages.length === 0 && (
              <div className="text-center text-gray-300 mt-20 space-y-6 animate-in fade-in duration-1000">
                <div className="w-20 h-20 bg-[#f8fbff] rounded-full flex items-center justify-center mx-auto text-[#3498DB] shadow-inner">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-[#1A5276]">Expert Architecture Guidance</p>
                  <p className="text-[11px] font-medium text-gray-400 mt-2 uppercase tracking-widest">GATE / JEE Paper 2 / Professional BIM</p>
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-[32px] text-[14px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#3498DB] text-white rounded-tr-none font-bold' 
                      : msg.isError ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-none font-medium'
                  }`}>
                    {msg.role === 'model' ? renderText(msg.parts[0].text) : msg.parts[0].text}
                  </div>
                </div>
                {msg.role === 'model' && idx === messages.length - 1 && msg.suggestions && (
                  <div className="flex flex-wrap gap-2 justify-start pl-4">
                    {msg.suggestions.map((suggestion, sidx) => (
                      <button
                        key={sidx}
                        onClick={() => handleSend(suggestion)}
                        className="bg-white border-2 border-[#EBF5FB] text-[#3498DB] px-5 py-2.5 rounded-full text-xs font-black hover:bg-[#3498DB] hover:text-white hover:border-[#3498DB] transition-all transform hover:-translate-y-1 shadow-sm active:scale-95"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 p-6 rounded-3xl rounded-tl-none flex gap-2">
                  <div className="w-2 h-2 bg-[#3498DB] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#1A5276] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[#3498DB] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 lg:p-10 border-t border-gray-50">
            <div className="flex items-center gap-4 bg-[#f8fbff] rounded-[32px] px-8 py-2 border-2 border-transparent focus-within:border-[#3498DB] focus-within:bg-white transition-all shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 bg-transparent py-4 text-sm focus:ring-0 outline-none text-gray-800 font-bold placeholder-gray-300"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-[#3498DB] text-white p-4 rounded-2xl hover:bg-[#1A5276] transition-all disabled:opacity-30 disabled:hover:bg-[#3498DB] shadow-lg shadow-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <p className="text-[9px] text-center text-gray-300 font-black uppercase tracking-widest mt-6">Aerie AI Expertise System v1.2</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
