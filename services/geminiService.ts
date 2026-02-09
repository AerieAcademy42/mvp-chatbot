
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, Question, Difficulty } from "../types";
import { MOCK_QUESTIONS } from "../constants";

/**
 * Aerie AI Initialization
 */
const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined" || key === "" || key.length < 5) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: key });
};

const SYSTEM_INSTRUCTION = `
You are the "Aerie AI Expert", the lead mentor for Aerie Academy (https://www.aerieacademy.com).
Aerie Academy is the premier coaching institute for Architecture students (GATE, NATA, JEE Paper 2).

TONE: Extremely optimistic, encouraging, technical, and sales-oriented.

YOUR MISSIONS:
1. Provide expert architectural advice (History, Structures, Design, Planning).
2. SALES: If the user mentions preparation, exams, or specific subjects, warmly recommend our paid courses at: https://www.aerieacademy.com/courses
3. FREE MOCK TEST: Always mention that users can take a FREE high-quality mock test right here on this dashboard.

RESPONSE FORMAT:
You MUST respond with a valid JSON object:
{
  "text": "Your answer with **bolding**.",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
`;

export const getGeminiChatResponse = async (history: ChatMessage[], message: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["text", "suggestions"]
        },
        temperature: 0.7,
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    return JSON.parse(text);
  } catch (error: any) {
    console.warn("Gemini Chat Error, providing fallback:", error);
    return {
      text: "I'm having a slight connection issue, but Aerie's resources are still available! Explore our **Mastery Courses** or start a **Mock Test** to keep your momentum.",
      suggestions: ["Take Gate Mock Test", "View Courses", "Study Tips"]
    };
  }
};

/**
 * Generates high-quality questions using Gemini 3 Pro with Thinking Budget.
 */
export const generateMockQuestions = async (subject: string, difficulty: Difficulty): Promise<Question[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        Task: Generate 5 high-fidelity, competitive-level architectural exam questions.
        Subject: ${subject}
        Difficulty Level: ${difficulty}
        Standard: GATE Architecture / JEE B.Arch Paper 2 / NATA.

        Guidelines for High Quality:
        1. CONCEPTUAL DEPTH: Focus on "why" and "how" rather than simple facts. Use scenarios where possible.
        2. PLAUSIBLE DISTRACTORS: For MCQs, ensure the 3 wrong options represent common student misconceptions or related but incorrect architectural principles.
        3. TECHNICAL ACCURACY: Ensure all structural formulas, historical dates, and planning regulations are 100% accurate.
        4. DOMAINS: Include topics like Sustainability, Building Services (HVAC, Acoustics, Lighting), Structural Systems, Urban Planning, and Contemporary Architecture.
        5. EXPLANATIONS: Provide a "Mentor's Logic" explanation that doesn't just give the answer but teaches the underlying architectural principle.

        Return a JSON object with a 'questions' array.
      `,
      config: {
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "The question text, clear and concise." },
                  type: { type: Type.STRING, enum: ["MCQ", "MSQ", "NAT", "MATCH"] },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "For MCQ/MSQ, exactly 4 options."
                  },
                  correctAnswer: { 
                    type: Type.STRING, 
                    description: "MCQ: Index (0-3). MSQ: JSON array of indices like [0,2]. NAT: Numerical string." 
                  },
                  explanation: { type: Type.STRING, description: "A deep technical explanation of the correct choice." },
                },
                required: ["text", "type", "correctAnswer", "explanation"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("NO_QUESTIONS");
    
    const rawData = JSON.parse(text);
    
    return rawData.questions.map((q: any, index: number) => {
      let processedAnswer;
      try {
        // Handle potential variations in how the AI returns the answer
        processedAnswer = (q.type === 'MCQ' || q.type === 'MSQ' || q.type === 'MATCH') 
          ? JSON.parse(q.correctAnswer) 
          : q.correctAnswer;
      } catch {
        processedAnswer = q.correctAnswer;
      }

      return {
        ...q,
        id: Date.now() + index,
        subject,
        difficulty,
        correctAnswer: processedAnswer
      };
    });
  } catch (error) {
    console.error("AI Question Generation failed, using local fallback bank:", error);
    const fallbackBank = MOCK_QUESTIONS.filter(q => 
      q.difficulty === difficulty || q.subject.includes(subject)
    ).slice(0, 5);
    return fallbackBank.length >= 5 ? fallbackBank : MOCK_QUESTIONS.slice(0, 5);
  }
};
