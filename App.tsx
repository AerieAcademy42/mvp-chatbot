
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
  const [footerImgError, setFooterImgError] = useState(false);
  
  // Login States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('aerie_user'));
  const [loginInput, setLoginInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput.includes('@')) {
      setUserEmail(loginInput);
      localStorage.setItem('aerie_user', loginInput);
      setIsLoginModalOpen(false);
    } else {
      alert("Please enter a valid Gmail address.");
    }
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('aerie_user');
  };

  const startTest = async (config: TestConfig) => {
    setIsGenerating(true);
    try {
      const generated = await generateMockQuestions(config.subject, config.difficulty);
      setQuestions(generated);
      setView('mockTest');
    } catch (error) {
      console.error("App: Failed to start test:", error);
      alert("Test initialization failed. Please try again or contact support.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGoHome = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <Navbar 
          onLoginClick={() => setIsLoginModalOpen(true)} 
          user={userEmail}
          onLogout={handleLogout}
          onHomeClick={handleGoHome}
        />
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
            
            {/* GATE Results Image */}
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
          <section id="offerings" className="grid md:grid-cols-3 gap-12 mb-32">
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

          {/* Contact Section - Image 2 Implementation */}
          <section id="contact" className="mb-32">
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-50 flex flex-col lg:flex-row">
               {/* Left Content */}
               <div className="flex-1 p-12 lg:p-20 space-y-10">
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black text-[#1A5276] tracking-tighter leading-tight">Have More<br/>Questions?</h2>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-md">
                      If you have any queries or concerns, shoot them at us. Drop your details below and we'll get in touch with you.
                    </p>
                  </div>

                  <div className="space-y-8">
                     <div className="flex items-start gap-5">
                        <div className="p-3 bg-[#f8fbff] text-[#1A5276] rounded-2xl">
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        </div>
                        <p className="text-lg font-bold text-gray-600 leading-snug">Wework Bannerghatta, Arekere Main Rd,<br/>Bengaluru, Karnataka 560076</p>
                     </div>
                     <div className="flex items-center gap-5">
                        <div className="p-3 bg-[#f8fbff] text-[#1A5276] rounded-2xl">
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        </div>
                        <p className="text-lg font-black text-gray-700">+91 9799333490</p>
                     </div>
                     <div className="flex items-center gap-5">
                        <div className="p-3 bg-[#f8fbff] text-[#1A5276] rounded-2xl">
                           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        </div>
                        <p className="text-lg font-bold text-gray-600">aerie.architecture@gmail.com</p>
                     </div>
                  </div>
               </div>

               {/* Right Side Form */}
               <div className="flex-1 bg-[#f8fbff] p-12 lg:p-20">
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                     <input type="text" placeholder="Name" className="w-full bg-white border border-blue-100 px-8 py-5 rounded-2xl focus:border-[#3498DB] outline-none font-bold text-[#1A5276] shadow-sm transition-all" />
                     <input type="tel" placeholder="Phone Number" className="w-full bg-white border border-blue-100 px-8 py-5 rounded-2xl focus:border-[#3498DB] outline-none font-bold text-[#1A5276] shadow-sm transition-all" />
                     <input type="email" placeholder="Email ID" className="w-full bg-white border border-blue-100 px-8 py-5 rounded-2xl focus:border-[#3498DB] outline-none font-bold text-[#1A5276] shadow-sm transition-all" />
                     <textarea rows={4} placeholder="Your Message" className="w-full bg-white border border-blue-100 px-8 py-5 rounded-2xl focus:border-[#3498DB] outline-none font-bold text-[#1A5276] shadow-sm transition-all resize-none"></textarea>
                     <button className="bg-[#AED6F1] hover:bg-[#3498DB] hover:text-white text-[#1A5276] px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-100 transform hover:-translate-y-1">
                        SUBMIT
                     </button>
                  </form>
               </div>
            </div>
          </section>
        </main>

        <footer className="bg-white border-t border-gray-100 py-24 px-6 mt-32">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-8">
                 {/* Footer Logo Section */}
                 <div className="flex items-center mb-6">
                    {!footerImgError ? (
                      <img 
                        src="/logo.png" 
                        alt="Aerie Academy" 
                        className="h-12 w-auto object-contain"
                        onError={() => setFooterImgError(true)}
                      />
                    ) : (
                      <div className="flex items-center select-none">
                        <span className="text-2xl font-black text-[#1A5276] tracking-tighter">AERIE</span>
                        <div className="h-6 w-[1.5px] bg-gray-200 mx-4"></div>
                        <span className="text-[9px] font-black text-[#3498DB] uppercase tracking-[0.6em] mt-1">ACADEMY</span>
                      </div>
                    )}
                 </div>
                 <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">Empowering Architects since 2020</p>
                 <div className="flex flex-col gap-6 text-base text-gray-500 font-bold">
                    <span className="flex items-start gap-4">
                       <svg className="w-6 h-6 text-[#1A5276] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                       Wework Bannerghatta, Arekere Main Rd,<br/>Bengaluru, Karnataka 560076
                    </span>
                    <span className="flex items-center gap-4">
                       <svg className="w-6 h-6 text-[#1A5276]" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                       +91 9799333490
                    </span>
                    <span className="flex items-center gap-4">
                       <svg className="w-6 h-6 text-[#1A5276]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                       aerie.architecture@gmail.com
                    </span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-20">
                 <div>
                    <h5 className="font-black text-[#1A5276] mb-6 uppercase text-xs tracking-[0.2em]">Exams</h5>
                    <ul className="space-y-4 text-xs text-gray-400 font-black uppercase tracking-widest">
                       <li className="hover:text-[#3498DB] cursor-pointer">GATE Architecture</li>
                       <li className="hover:text-[#3498DB] cursor-pointer">JEE Paper 2</li>
                       <li className="hover:text-[#3498DB] cursor-pointer">NATA Prep</li>
                    </ul>
                 </div>
                 <div>
                    <h5 className="font-black text-[#1A5276] mb-6 uppercase text-xs tracking-[0.2em]">Quick Links</h5>
                    <ul className="space-y-4 text-xs text-gray-400 font-black uppercase tracking-widest">
                       <li onClick={handleGoHome} className="hover:text-[#3498DB] cursor-pointer">Home</li>
                       <li><a href="https://www.aerieacademy.com/courses" target="_blank" className="hover:text-[#3498DB]">Courses</a></li>
                       <li onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="hover:text-[#3498DB] cursor-pointer">Contact</li>
                    </ul>
                 </div>
              </div>
           </div>
        </footer>

        {/* Login Modal Overlay */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
             <div className="absolute inset-0 bg-[#1A5276]/60 backdrop-blur-xl" onClick={() => setIsLoginModalOpen(false)}></div>
             <div className="relative bg-white w-full max-w-md p-10 lg:p-12 rounded-[50px] shadow-2xl border border-white/20 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                <button 
                  onClick={() => setIsLoginModalOpen(false)}
                  className="absolute top-8 right-8 text-gray-400 hover:text-[#1A5276] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="text-center mb-10">
                   <div className="bg-[#EBF5FB] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#3498DB]">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   </div>
                   <h2 className="text-3xl font-black text-[#1A5276] uppercase tracking-tighter">Student Login</h2>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Access your Aerie Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#3498DB] uppercase tracking-[0.3em] ml-2">Gmail Address</label>
                      <div className="relative">
                         <input 
                           type="email" 
                           required
                           value={loginInput}
                           onChange={(e) => setLoginInput(e.target.value)}
                           placeholder="yourname@gmail.com"
                           className="w-full bg-gray-50 border-2 border-transparent focus:border-[#3498DB] focus:bg-white px-6 py-4 rounded-3xl outline-none transition-all font-bold text-[#1A5276]"
                         />
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.908 4.152-1.24 1.24-3.152 2.584-6.412 2.584-5.18 0-9.26-4.18-9.26-9.36s4.08-9.36 9.26-9.36c2.8 0 4.932 1.108 6.412 2.512l2.32-2.32c-2.108-2.024-4.832-3.572-8.732-3.572-7.148 0-13.044 5.896-13.044 13.044s5.896 13.044 13.044 13.044c3.84 0 6.744-1.268 9.072-3.68 2.4-2.4 3.152-5.772 3.152-8.34 0-.6-.052-1.172-.152-1.68h-11.972z"/></svg>
                         </div>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     className="w-full bg-[#1A5276] hover:bg-[#3498DB] text-white py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all transform hover:-translate-y-1"
                   >
                     Login with Google
                   </button>
                </form>

                <p className="mt-8 text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                   By logging in, you agree to Aerie Terms of Service.
                </p>
             </div>
          </div>
        )}
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
