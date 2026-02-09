
import React, { useState } from 'react';

interface NavbarProps {
  onLoginClick: () => void;
  user: string | null;
  onLogout: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, user, onLogout, onHomeClick }) => {
  const [imgError, setImgError] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        {/* Brand Logo Section */}
        <div className="flex items-center cursor-pointer" onClick={onHomeClick}>
          {!imgError ? (
            <img 
              src="/logo.png" 
              alt="Aerie Academy" 
              className="h-10 md:h-12 w-auto object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Precision Text-based Logo Fallback */
            <div className="flex items-center select-none">
              <span className="text-2xl md:text-3xl font-black text-[#1A5276] tracking-tighter">AERIE</span>
              <div className="h-8 w-[1.5px] bg-gray-200 mx-6 md:mx-8"></div>
              <span className="text-[10px] md:text-[11px] font-black text-[#3498DB] uppercase tracking-[0.6em] md:tracking-[0.8em] mt-1">ACADEMY</span>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        <button onClick={onHomeClick} className="hover:text-[#3498DB] transition-all hover:tracking-[0.3em]">Home</button>
        <button onClick={() => scrollToSection('offerings')} className="hover:text-[#3498DB] transition-all hover:tracking-[0.3em]">Mentorship</button>
        <a href="https://www.aerieacademy.com/courses" target="_blank" rel="noopener noreferrer" className="hover:text-[#3498DB] transition-all hover:tracking-[0.3em]">Courses</a>
        <button onClick={() => scrollToSection('contact')} className="hover:text-[#3498DB] transition-all hover:tracking-[0.3em]">Contact</button>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Active Student</p>
              <p className="text-[10px] font-bold text-[#1A5276] truncate max-w-[120px]">{user}</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 p-2.5 rounded-full transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="bg-[#1A5276] hover:bg-[#21618C] text-white px-8 md:px-10 py-3 md:py-3.5 rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-[0.15em] transition-all shadow-[0_10px_30px_rgba(26,82,118,0.2)] hover:shadow-[0_15px_35px_rgba(26,82,118,0.35)] hover:-translate-y-0.5 active:scale-95"
          >
            STUDENT LOGIN
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
