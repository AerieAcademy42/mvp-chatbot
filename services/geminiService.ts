
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, Question, Difficulty } from "../types";
import { MOCK_QUESTIONS } from "../constants";

/**
 * Aerie AI Initialization
 * Safely extracts the API key from the environment.
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
    
    if (error.message === "API_KEY_MISSING") {
      return {
        text: "⚠️ **Setup Required:** I'm ready to help, but your **API Key** isn't detected yet. \n\n1. Create a file named `.env.local` in your root folder.\n2. Add this line: `API_KEY=your_actual_key_here`.\n3. Restart your terminal (npm run dev).",
        suggestions: ["Check Courses", "Retry Connection", "NATA Prep"]
      };
    }

    return {
      text: "I'm having a slight connection issue, but Aerie's resources are still available! Explore our **Mastery Courses** or start a **Mock Test** to keep your momentum.",
      suggestions: ["Take Gate Mock Test", "View Courses", "Study Tips"]
    };
  }
};

/**
 * Generates questions using AI, or falls back to local questions if AI fails.
 */
export const generateMockQuestions = async (subject: string, difficulty: Difficulty): Promise<Question[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 challenging architectural exam questions for ${subject} at ${difficulty} level. Use GATE/JEE standards.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["MCQ", "MSQ", "NAT", "MATCH"] },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["text", "type", "correctAnswer", "explanation"]
              }
            }
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '{"questions": []}');
    if (!rawData.questions || rawData.questions.length === 0) throw new Error("NO_QUESTIONS");

    return rawData.questions.map((q: any, index: number) => ({
      ...q,
      id: Date.now() + index,
      subject,
      difficulty,
      correctAnswer: q.type === 'NAT' ? q.correctAnswer : JSON.parse(q.correctAnswer)
    }));
  } catch (error) {
    console.error("AI Question Generation failed, using local fallback bank:", error);
    
    // FALLBACK LOGIC: Return relevant questions from the hardcoded bank
    const fallbackBank = MOCK_QUESTIONS.filter(q => 
      q.difficulty === difficulty || q.subject.includes(subject)
    ).slice(0, 5);
    
    // If filtered bank is too small, just give first 5
    return fallbackBank.length >= 5 ? fallbackBank : MOCK_QUESTIONS.slice(0, 5);
  }
};
