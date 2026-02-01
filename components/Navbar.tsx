
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        {/* Brand Identity - Logo Image from public/logo.png */}
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Aerie Academy Logo" 
            className="h-10 md:h-12 w-auto object-contain"
            onError={(e) => {
              // Fallback text if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                const span = document.createElement('span');
                span.className = "text-xl font-black text-[#1A5276]";
                span.innerText = "AERIE";
                parent.appendChild(span);
              }
            }}
          />
        </div>
        
        <div className="hidden lg:block border-l-2 border-gray-100 h-8 ml-6 pl-6">
           <span className="text-[10px] font-black text-[#3498DB] uppercase tracking-[0.5em]">ACADEMY</span>
        </div>
      </div>

      <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-widest text-gray-400">
        <a href="#" className="hover:text-[#3498DB] transition-all hover:tracking-[0.2em]">Home</a>
        <a href="#" className="hover:text-[#3498DB] transition-all hover:tracking-[0.2em]">Mentorship</a>
        <a href="#" className="hover:text-[#3498DB] transition-all hover:tracking-[0.2em]">Courses</a>
        <a href="#" className="hover:text-[#3498DB] transition-all hover:tracking-[0.2em]">Contact</a>
      </div>

      <button className="bg-[#1A5276] hover:bg-[#3498DB] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95">
        Student Login
      </button>
    </nav>
  );
};

export default Navbar;
