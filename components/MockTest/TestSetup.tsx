
import React, { useState } from 'react';
import { GateSubject, Difficulty, TestConfig } from '../../types';

interface Props {
  onStart: (config: TestConfig) => void;
  onBack: () => void;
}

const TestSetup: React.FC<Props> = ({ onStart, onBack }) => {
  const [subject, setSubject] = useState<GateSubject>('GATE - Aptitude');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const subjects: GateSubject[] = ['GATE - Aptitude', 'Common Part', 'Part B1', 'Part B2'];
  const levels: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <button 
          onClick={onBack}
          className="mb-10 flex items-center gap-2 text-gray-400 hover:text-[#3498DB] transition-all font-black uppercase tracking-[0.3em] text-xs group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-[#1A5276] mb-4 uppercase tracking-tighter">Mock Assessment</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Aerie Academy Professional Testing Environment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-[#f8fbff] p-12 rounded-[50px] border border-blue-50 shadow-sm">
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-[#3498DB] uppercase tracking-[0.4em] ml-1">Specialization</h3>
            <div className="grid grid-cols-1 gap-4">
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group ${
                    subject === s 
                      ? 'border-[#3498DB] bg-white text-[#1A5276] shadow-xl ring-8 ring-blue-50/50' 
                      : 'border-transparent bg-gray-100/50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-black text-sm uppercase tracking-wider">{s}</span>
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${subject === s ? 'bg-[#3498DB] border-[#3498DB] scale-125' : 'border-gray-200 group-hover:border-[#3498DB]'}`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-12 flex flex-col">
            <div className="space-y-8">
              <h3 className="text-[10px] font-black text-[#3498DB] uppercase tracking-[0.4em] ml-1">Difficulty Level</h3>
              <div className="flex gap-4">
                {levels.map(l => (
                  <button
                    key={l}
                    onClick={() => setDifficulty(l)}
                    className={`flex-1 py-5 rounded-3xl border-2 transition-all font-black uppercase text-xs tracking-widest ${
                      difficulty === l 
                        ? 'border-[#3498DB] bg-white text-[#1A5276] shadow-xl ring-8 ring-blue-50/50' 
                        : 'border-transparent bg-gray-100/50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
               <button
                onClick={() => onStart({ subject, difficulty })}
                className="w-full bg-[#3498DB] hover:bg-[#1A5276] text-white py-8 rounded-[32px] font-black text-2xl uppercase tracking-widest shadow-2xl transition-all transform hover:-translate-y-2 active:scale-95 shadow-[#3498DB]/30"
              >
                START TEST
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSetup;
