
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import MockTestInterface from './components/MockTest/MockTestInterface';
import TestSetup from './components/MockTest/TestSetup';
import { generateMockQuestions } from './services/geminiService';
import { Question, TestConfig } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'testSetup' | 'mockTest'>('landing');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const startTest = async (config: TestConfig) => {
    setIsGenerating(true);
    try {
      const generated = await generateMockQuestions(config.subject, config.difficulty);
      setQuestions(generated);
      setView('mockTest');
    } catch (error) {
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGoHome = () => {
    setView('landing');
  };

  const handleStartTestAction = () => {
    setView('testSetup');
  };

  const renderContent = () => {
    if (view === 'mockTest') {
      return <MockTestInterface questions={questions} onExit={handleGoHome} />;
    }

    if (view === 'testSetup') {
      return isGenerating ? (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
          <div className="w-16 h-16 border-4 border-[#3498DB] border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-[#1A5276] font-black uppercase tracking-[0.4em] text-xs">Aerie Assessment System Loading...</p>
        </div>
      ) : (
        <TestSetup onStart={startTest} onBack={handleGoHome} />
      );
    }

    return (
      <>
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
          {/* Hero Section */}
          <section className="flex flex-col lg:flex-row gap-16 items-center mb-32 py-10">
            <div className="flex-1 space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EBF5FB] rounded-full border border-blue-100">
                 <span className="w-2 h-2 bg-[#3498DB] rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black text-[#1A5276] uppercase tracking-widest">Enrollment Open for GATE 2026</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[#1A5276] leading-tight tracking-tighter">
                Architecture & <span className="text-[#3498DB]">Planning</span> Mastery.
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
                Premier architectural education designed for global success. Excel in JEE/GATE and professional BIM mastery with Aerie Academy.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                 <button onClick={() => setView('testSetup')} className="bg-[#3498DB] hover:bg-[#1A5276] text-white px-10 py-5 rounded-[22px] font-black text-xs shadow-2xl transition-all transform hover:-translate-y-2 uppercase tracking-widest">
                   TAKE MOCK TEST
                 </button>
                 <button className="bg-[#1A5276] hover:bg-black text-white px-10 py-5 rounded-[22px] font-black text-xs shadow-xl transition-all transform hover:-translate-y-1 uppercase tracking-widest">
                   MENTORSHIP
                 </button>
                 <button onClick={() => window.open('https://www.aerieacademy.com/courses', '_blank')} className="bg-white border-2 border-gray-100 text-gray-400 hover:border-[#3498DB] hover:text-[#3498DB] px-10 py-5 rounded-[22px] font-black text-xs transition-all transform hover:-translate-y-1 uppercase tracking-widest">
                   COURSES
                 </button>
              </div>
            </div>
            
            {/* GATE Results Image Section - Using public/gate-results.png */}
            <div className="flex-1 relative w-full">
               <div className="absolute -z-10 bg-[#3498DB]/10 w-full h-[120%] -top-[10%] rounded-full blur-[100px] opacity-60"></div>
               <div className="relative overflow-hidden rounded-[40px] shadow-2xl border-8 border-white group">
                  <img 
                    src="/gate-results.png" 
                    alt="GATE 2025 Top All India Ranks" 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000 bg-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A5276]/10 via-transparent to-transparent opacity-40"></div>
               </div>
            </div>
          </section>

          {/* Offerings Grid */}
          <section className="grid md:grid-cols-3 gap-12 mb-32">
             {[
               {
                 title: "Expert Mentorship",
                 desc: "Direct 1-on-1 sessions with IIT/SPA alumni and industry directors.",
                 icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                 link: "View Mentors"
               },
               {
                 title: "Premium Courses",
                 desc: "NATA, JEE B.Arch Paper 2, and advanced GATE modules. Live coaching included.",
                 icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                 link: "Browse Courses",
                 action: () => window.open('https://www.aerieacademy.com/courses', '_blank')
               },
               {
                 title: "Free Mock Assessment",
                 desc: "Test your skills against AI-calibrated questions in a real JEE/GATE environment.",
                 icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
                 link: "Start Test",
                 action: handleStartTestAction
               }
             ].map((card, i) => (
                <div key={i} className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                   <div className="w-16 h-16 bg-[#EBF5FB] text-[#3498DB] rounded-3xl flex items-center justify-center mb-10 group-hover:bg-[#3498DB] group-hover:text-white transition-all transform group-hover:rotate-12">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} /></svg>
                   </div>
                   <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-[#1A5276]">{card.title}</h3>
                   <p className="text-gray-400 font-medium mb-10 leading-relaxed text-sm">{card.desc}</p>
                   <button 
                     onClick={card.action}
                     className="text-[#3498DB] font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 group-hover:gap-4 transition-all"
                   >
                     {card.link} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                   </button>
                </div>
             ))}
          </section>
        </main>

        <footer className="bg-white border-t border-gray-100 py-24 px-6 mt-32">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-6">
                 {/* Enhanced Footer Logo with dynamic image handling */}
                 <div className="relative inline-block mb-6">
                   <img 
                     src="/logo.png" 
                     alt="Aerie Academy" 
                     className="h-16 w-auto object-contain relative z-10"
                     onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.style.display = 'none';
                       const fallback = target.nextElementSibling as HTMLElement;
                       if (fallback) fallback.classList.remove('hidden');
                     }}
                   />
                   {/* Stylish Fallback UI */}
                   <div className="hidden flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1A5276] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                        A
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-[#1A5276] tracking-tighter leading-none">AERIE</span>
                        <span className="text-[9px] font-black text-[#3498DB] tracking-[0.4em] uppercase">Academy</span>
                      </div>
                   </div>
                 </div>
                 
                 <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">Empowering Architects since 2020</p>
                 <div className="flex flex-col gap-3 text-sm text-gray-500 font-bold">
                    <span className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       Wework Bannerghatta, Bengaluru
                    </span>
                    <span className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                       aerie.architecture@gmail.com
                    </span>
                    <span className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                       +91 9799333490
                    </span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-20">
                 <div>
                    <h5 className="font-black text-[#1A5276] mb-6 uppercase text-xs tracking-[0.2em]">Exams</h5>
                    <ul className="space-y-3 text-xs text-gray-400 font-black uppercase tracking-widest">
                       <li className="hover:text-[#3498DB] cursor-pointer transition-colors">GATE Architecture</li>
                       <li className="hover:text-[#3498DB] cursor-pointer transition-colors">JEE Paper 2</li>
                       <li className="hover:text-[#3498DB] cursor-pointer transition-colors">NATA</li>
                    </ul>
                 </div>
                 <div>
                    <h5 className="font-black text-[#1A5276] mb-6 uppercase text-xs tracking-[0.2em]">Quick Links</h5>
                    <ul className="space-y-3 text-xs text-gray-400 font-black uppercase tracking-widest">
                       <li onClick={() => setView('testSetup')} className="hover:text-[#3498DB] cursor-pointer transition-colors">Mock Test</li>
                       <li className="hover:text-[#3498DB] cursor-pointer transition-colors">Mentorship</li>
                       <li onClick={() => window.open('https://www.aerieacademy.com/courses', '_blank')} className="hover:text-[#3498DB] cursor-pointer transition-colors">Courses</li>
                    </ul>
                 </div>
              </div>
           </div>
           <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
              <p>© 2025 Aerie Academy. All Rights Reserved.</p>
              <div className="flex gap-8">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
              </div>
           </div>
        </footer>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#f8fbff]">
      {renderContent()}
      <Chatbot 
        onGoHome={handleGoHome} 
        onStartTestAction={handleStartTestAction}
      />
    </div>
  );
};

export default App;
