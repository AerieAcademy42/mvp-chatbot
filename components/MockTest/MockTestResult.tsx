
import React from 'react';
import { Question, UserResponse } from '../../types';

interface Props {
  questions: Question[];
  responses: UserResponse[];
  onBackToHome: () => void;
  onRetake: () => void;
}

const MockTestResult: React.FC<Props> = ({ questions, responses, onBackToHome, onRetake }) => {
  const checkCorrect = (resp: UserResponse, q: Question) => {
    if (q.type === 'NAT') {
      return resp.numericalValue?.trim() === String(q.correctAnswer).trim();
    }
    if (q.type === 'MSQ') {
      const userSet = resp.selectedOptions || [];
      const correctSet = q.correctAnswer as number[];
      if (userSet.length !== correctSet.length) return false;
      return userSet.every(val => correctSet.includes(val));
    }
    return resp.selectedOption === q.correctAnswer;
  };

  const score = responses.reduce((acc, resp, idx) => {
    return checkCorrect(resp, questions[idx]) ? acc + 1 : acc;
  }, 0);

  const getAffirmation = (score: number) => {
    if (score === 5) return { text: "UNSTOPPABLE! You've mastered this subject. Perfect Score!", color: "text-green-600" };
    if (score === 4) return { text: "EXCELLENT! You are almost there. Great architectural focus.", color: "text-blue-600" };
    if (score === 3) return { text: "GOOD JOB! You can do better with a bit more technical practice.", color: "text-orange-600" };
    if (score === 2) return { text: "STEADY PROGRESS. Focus more on theoretical depth.", color: "text-yellow-600" };
    return { text: "KEEP GOING! Architecture is a journey. Review the explanations below.", color: "text-red-600" };
  };

  const affirmation = getAffirmation(score);

  const formatAnswer = (ans: any, q: Question) => {
    if (q.type === 'NAT') return String(ans);
    if (q.type === 'MSQ') {
      const arr = ans as number[];
      return arr.map(i => q.options?.[i]).join(', ');
    }
    if (q.type === 'MCQ' || q.type === 'MATCH') {
      return q.options?.[ans as number] || 'None';
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col p-6 animate-in fade-in zoom-in-95">
      <div className="max-w-4xl mx-auto w-full space-y-8 pb-20">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-blue-50">
          <div className="bg-[#1A5276] p-10 text-white text-center">
             <h1 className="text-sm font-black uppercase tracking-[0.4em] mb-4 opacity-70">Assessment Scorecard</h1>
             <div className="flex justify-center items-baseline gap-2">
                <span className="text-8xl font-black">{score}</span>
                <span className="text-3xl font-bold opacity-50">/ 5</span>
             </div>
             <p className={`mt-6 text-xl font-bold p-3 bg-white rounded-2xl ${affirmation.color} shadow-lg`}>
                {affirmation.text}
             </p>
          </div>

          <div className="p-10">
             <div className="grid grid-cols-3 gap-6 mb-10 text-center">
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                   <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">Correct</p>
                   <p className="text-2xl font-black text-green-700">{score}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                   <p className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-1">Incorrect</p>
                   <p className="text-2xl font-black text-red-700">{5 - score}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                   <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Review Items</p>
                   <p className="text-2xl font-black text-blue-700">
                      {responses.filter(r => r.status.includes('Marked')).length}
                   </p>
                </div>
             </div>

             <div className="space-y-8">
                <h3 className="text-xl font-black text-[#1A5276] flex items-center gap-3">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                   Detailed Review & Analysis
                </h3>
                
                {questions.map((q, idx) => {
                   const resp = responses[idx];
                   const isCorrect = checkCorrect(resp, q);
                   const isMarked = resp.status.includes('Marked');

                   let userAnswerText = '';
                   if (q.type === 'NAT') userAnswerText = resp.numericalValue || 'No Answer';
                   else if (q.type === 'MSQ') userAnswerText = (resp.selectedOptions || []).map(i => q.options?.[i]).join(', ') || 'No Answer';
                   else userAnswerText = resp.selectedOption !== null ? q.options?.[resp.selectedOption]! : 'No Answer';

                   return (
                      <div key={q.id} className={`p-6 rounded-3xl border-2 transition-all ${isCorrect ? 'border-green-100 bg-green-50/20' : 'border-red-100 bg-red-50/20'}`}>
                         <div className="flex justify-between items-start mb-4">
                            <span className="font-black text-[#1A5276]">Q{idx + 1} ({q.type})</span>
                            <div className="flex gap-2">
                               {isMarked && (
                                  <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Review Item</span>
                               )}
                               <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {isCorrect ? 'Correct' : 'Incorrect'}
                               </span>
                            </div>
                         </div>
                         <p className="font-bold text-gray-800 mb-4 whitespace-pre-wrap">{q.text}</p>
                         <div className="space-y-2 mb-6 text-sm">
                            <p className="text-gray-500">Your Answer: <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{userAnswerText}</span></p>
                            <p className="text-gray-500">Correct Answer: <span className="font-bold text-green-600">{formatAnswer(q.correctAnswer, q)}</span></p>
                         </div>
                         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-[10px] font-black text-[#3498DB] uppercase tracking-widest mb-2">Expert Explanation</p>
                            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{q.explanation}</p>
                         </div>
                      </div>
                   );
                })}
             </div>

             <div className="mt-12 flex gap-4">
                <button onClick={onRetake} className="flex-1 bg-[#3498DB] text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-[#1A5276] transition-all transform hover:-translate-y-1">
                   RETAKE MOCK TEST
                </button>
                <button onClick={onBackToHome} className="flex-1 bg-white border-4 border-gray-100 text-gray-400 py-5 rounded-3xl font-black text-lg hover:border-[#3498DB] hover:text-[#3498DB] transition-all">
                   BACK TO DASHBOARD
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestResult;
