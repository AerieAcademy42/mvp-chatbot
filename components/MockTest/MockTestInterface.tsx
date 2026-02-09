
import React, { useState, useEffect } from 'react';
import { UserResponse, Question } from '../../types';
import MockTestResult from './MockTestResult';

interface Props {
  questions: Question[];
  onExit: () => void;
}

const MockTestInterface: React.FC<Props> = ({ questions, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responses, setResponses] = useState<UserResponse[]>(
    questions.map(q => ({
      questionId: q.id,
      selectedOption: null,
      selectedOptions: [],
      numericalValue: '',
      status: 'Not Visited'
    }))
  );
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setResponses(prev => prev.map((r, i) => {
      if (i === currentIdx && r.status === 'Not Visited') {
        return { ...r, status: 'Not Answered' };
      }
      return r;
    }));
  }, [currentIdx]);

  if (isSubmitted) {
    return (
      <MockTestResult 
        questions={questions} 
        responses={responses} 
        onBackToHome={onExit} 
        onRetake={() => {
          setIsSubmitted(false);
          setCurrentIdx(0);
          setResponses(questions.map(q => ({
            questionId: q.id,
            selectedOption: null,
            selectedOptions: [],
            numericalValue: '',
            status: 'Not Visited'
          })));
          setTimeLeft(15 * 60);
        }}
      />
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIdx];

  const handleSelection = (optIdx: number) => {
    if (currentQuestion.type === 'MSQ') {
      setResponses(prev => prev.map((r, i) => {
        if (i === currentIdx) {
          const currentSet = r.selectedOptions || [];
          const newSet = currentSet.includes(optIdx) 
            ? currentSet.filter(id => id !== optIdx)
            : [...currentSet, optIdx];
          return { ...r, selectedOptions: newSet };
        }
        return r;
      }));
    } else {
      setResponses(prev => prev.map((r, i) => {
        if (i === currentIdx) return { ...r, selectedOption: optIdx };
        return r;
      }));
    }
  };

  const handleNumericalChange = (val: string) => {
    setResponses(prev => prev.map((r, i) => {
      if (i === currentIdx) return { ...r, numericalValue: val };
      return r;
    }));
  };

  const isAnswered = (r: UserResponse, q: Question) => {
    if (q.type === 'NAT') return r.numericalValue !== '';
    if (q.type === 'MSQ') return (r.selectedOptions || []).length > 0;
    return r.selectedOption !== null;
  };

  const handleSaveAndNext = () => {
    setResponses(prev => prev.map((r, i) => {
      if (i === currentIdx) {
        return { ...r, status: isAnswered(r, currentQuestion) ? 'Answered' : 'Not Answered' };
      }
      return r;
    }));
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const handleMarkForReview = () => {
    setResponses(prev => prev.map((r, i) => {
      if (i === currentIdx) {
        const answered = isAnswered(r, currentQuestion);
        return { ...r, status: answered ? 'Answered & Marked' : 'Marked for Review' };
      }
      return r;
    }));
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Answered': return 'bg-[#27ae60] text-white border-[#27ae60]';
      case 'Not Answered': return 'bg-[#e67e22] text-white border-[#27ae60]';
      case 'Marked for Review': return 'bg-[#8e44ad] text-white border-[#8e44ad] rounded-full';
      case 'Answered & Marked': return 'bg-[#8e44ad] text-white border-[#8e44ad] relative after:content-[""] after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2 after:bg-green-400 after:rounded-full';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const renderQuestionOptions = () => {
    if (currentQuestion.type === 'NAT') {
      return (
        <div className="mt-6 lg:mt-10">
          <p className="text-[10px] lg:text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Enter Numerical Value</p>
          <input 
            type="text" 
            value={responses[currentIdx].numericalValue}
            onChange={(e) => handleNumericalChange(e.target.value)}
            className="w-full max-w-xs p-4 lg:p-5 text-xl lg:text-2xl font-black text-[#1A5276] border-4 border-gray-100 rounded-2xl focus:border-[#3498DB] focus:outline-none transition-all"
            placeholder="0.00"
          />
          <p className="mt-4 text-[10px] lg:text-xs text-gray-400">Numerical answer type: Use only digits and decimals if required.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 lg:gap-4">
        {currentQuestion.options?.map((opt, idx) => {
          const isSelected = currentQuestion.type === 'MSQ' 
            ? responses[currentIdx].selectedOptions?.includes(idx)
            : responses[currentIdx].selectedOption === idx;

          return (
            <button 
              key={idx} 
              onClick={() => handleSelection(idx)}
              className={`flex items-center gap-4 lg:gap-6 p-4 lg:p-6 border-2 rounded-2xl transition-all text-left group ${
                isSelected 
                  ? 'border-[#3498DB] bg-blue-50/30 shadow-md' 
                  : 'border-gray-50 hover:border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center font-bold text-xs lg:text-sm transition-colors shrink-0 ${
                isSelected 
                  ? 'bg-[#3498DB] text-white' 
                  : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
              }`}>
                {currentQuestion.type === 'MSQ' ? (
                  isSelected ? '✓' : ''
                ) : String.fromCharCode(65 + idx)}
              </div>
              <span className={`text-sm lg:text-lg ${isSelected ? 'text-[#1A5276] font-bold' : 'text-gray-600'}`}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f4f8] text-black overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-4 lg:px-6 py-3 lg:py-4 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-4 lg:gap-6">
          <button onClick={onExit} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors group">
             <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 group-hover:text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
             <span className="text-[10px] font-black text-gray-400 group-hover:text-[#3498DB] uppercase tracking-widest hidden sm:inline">Exit</span>
          </button>
          <div className="flex items-center gap-2 lg:gap-3">
             <div className="bg-[#1A5276] text-white w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-xl font-black shadow-sm text-sm">A</div>
             <div>
                <h1 className="font-black text-sm lg:text-lg tracking-tight text-[#1A5276] uppercase truncate max-w-[120px] lg:max-w-none">{currentQuestion.subject}</h1>
                <p className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aerie Assessment</p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-8">
           <div className="text-right">
              <p className="text-[8px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0 lg:mb-1">Time Left</p>
              <div className="font-mono text-lg lg:text-2xl font-black text-[#3498DB] leading-none">{formatTime(timeLeft)}</div>
           </div>
           <button onClick={() => setIsSubmitted(true)} className="bg-[#1A5276] text-white px-4 lg:px-8 py-2 lg:py-3 rounded-xl font-black hover:bg-black transition-all uppercase text-[10px] tracking-widest shadow-xl">
              SUBMIT
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Main Content Area (Question) */}
        <div className="flex-1 flex flex-col overflow-y-auto jee-scrollbar bg-white shadow-inner lg:m-4 lg:rounded-[32px] border-b lg:border border-gray-100 order-1 lg:order-none">
          <div className="p-6 lg:p-10 flex-1">
            <div className="flex justify-between items-start mb-6 lg:mb-10">
               <div>
                  <h2 className="text-2xl lg:text-4xl font-black text-gray-900 mb-1 lg:mb-2">Q{currentIdx + 1}</h2>
                  <div className="h-1 w-12 lg:w-20 bg-[#3498DB] rounded-full"></div>
                  <p className="text-[10px] font-black text-[#3498DB] mt-3 lg:mt-4 uppercase tracking-[0.2em]">{currentQuestion.type} Type</p>
               </div>
               <div className="px-3 py-1 lg:px-4 lg:py-2 bg-blue-50 border border-blue-100 rounded-xl">
                  <span className="text-[10px] font-black text-[#3498DB] uppercase tracking-widest">{currentQuestion.difficulty}</span>
               </div>
            </div>

            <div className="text-lg lg:text-2xl font-medium text-gray-800 leading-relaxed mb-8 lg:mb-12 whitespace-pre-wrap">
              {currentQuestion.text}
            </div>

            {renderQuestionOptions()}
          </div>

          {/* Action Bar (Save/Next) */}
          <div className="bg-gray-50/50 p-4 lg:p-8 border-t flex flex-wrap gap-3 lg:gap-4 items-center sticky bottom-0 z-10">
             <button onClick={handleSaveAndNext} className="flex-1 lg:flex-none bg-[#27ae60] hover:bg-[#219150] text-white px-6 lg:px-10 py-3 lg:py-4 rounded-2xl font-black shadow-lg shadow-green-100 transition-all text-xs lg:text-sm">
               SAVE & NEXT
             </button>
             <button onClick={handleMarkForReview} className="flex-1 lg:flex-none bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-6 lg:px-10 py-3 lg:py-4 rounded-2xl font-black transition-all text-xs lg:text-sm">
               REVIEW
             </button>
             <button onClick={() => {
               setResponses(prev => prev.map((r, i) => {
                 if (i === currentIdx) return { ...r, selectedOption: null, selectedOptions: [], numericalValue: '', status: 'Not Answered' };
                 return r;
               }));
             }} className="text-gray-400 font-bold hover:text-gray-600 px-2 lg:px-6 py-4 text-[10px] lg:text-xs">
               Clear
             </button>
             
             <div className="ml-auto flex gap-2 lg:gap-4">
               <button 
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="bg-white border border-gray-200 p-3 lg:p-4 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
               </button>
               <button 
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="bg-white border border-gray-200 p-3 lg:p-4 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
               </button>
             </div>
          </div>
        </div>

        {/* Sidebar / Palette */}
        <div className="w-full lg:w-[380px] bg-white border-t lg:border-t-0 lg:border-l p-4 lg:p-8 flex flex-col gap-4 lg:gap-8 order-2 lg:order-none overflow-y-auto shrink-0">
           <div className="hidden lg:block">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Question Palette</h3>
           </div>
           
           <div className="flex flex-row lg:grid lg:grid-cols-5 gap-2 lg:gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {questions.map((q, idx) => (
              <button 
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-10 h-10 lg:w-12 lg:h-12 shrink-0 flex items-center justify-center text-xs lg:text-sm font-black border-2 rounded-xl lg:rounded-2xl transition-all ${
                  currentIdx === idx ? 'ring-4 ring-blue-100 scale-110 z-10' : ''
                } ${getStatusColor(responses[idx].status)}`}
              >
                {idx + 1}
              </button>
            ))}
           </div>

           <div className="space-y-4 pt-4 lg:pt-8 border-t">
              <h3 className="text-[8px] lg:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 lg:mb-4">Legend</h3>
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-4">
                 <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs font-bold text-gray-500">
                    <div className="w-3 h-3 lg:w-5 lg:h-5 bg-[#27ae60] rounded-lg"></div>
                    <span>Answered</span>
                 </div>
                 <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs font-bold text-gray-500">
                    <div className="w-3 h-3 lg:w-5 lg:h-5 bg-[#e67e22] rounded-lg"></div>
                    <span>Not Answered</span>
                 </div>
                 <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs font-bold text-gray-500">
                    <div className="w-3 h-3 lg:w-5 lg:h-5 bg-gray-100 border-2 rounded-lg"></div>
                    <span>Not Visited</span>
                 </div>
                 <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs font-bold text-gray-500">
                    <div className="w-3 h-3 lg:w-5 lg:h-5 bg-[#8e44ad] rounded-full"></div>
                    <span>Review</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestInterface;
