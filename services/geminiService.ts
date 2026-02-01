
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, Question, Difficulty } from "../types";

/**
 * Aerie AI Initialization
 * Prioritizes the injected API key.
 */
const getAI = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined" || key.length < 10) {
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
    console.error("Gemini Error:", error);
    
    // Specific error for missing API key
    if (error.message === "API_KEY_MISSING") {
      return {
        text: "⚠️ **Configuration Error:** Your API Key is missing or invalid. \n\n**Local Fix:** Ensure `.env.local` has `API_KEY=your_key`. \n**Vercel Fix:** Add `API_KEY` in Environment Variables.",
        suggestions: ["How to set API Key?", "Check out our courses", "Contact Support"]
      };
    }

    return {
      text: "I'm having a slight connection issue, but I'm still here to help! For the best prep, check out our **Architecture Mastery Courses** or try the **Mock Test**.",
      suggestions: ["Take Gate Mock Test", "View Courses", "NATA Tips"]
    };
  }
};

export const generateMockQuestions = async (subject: string, difficulty: Difficulty): Promise<Question[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 challenging architectural exam questions for ${subject} at ${difficulty} level.`,
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
    return rawData.questions.map((q: any, index: number) => ({
      ...q,
      id: Date.now() + index,
      subject,
      difficulty,
      correctAnswer: q.type === 'NAT' ? q.correctAnswer : JSON.parse(q.correctAnswer)
    }));
  } catch (error) {
    console.error("Question Generation Error:", error);
    throw error;
  }
};
