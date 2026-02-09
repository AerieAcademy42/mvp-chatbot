
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type GateSubject = 'GATE - Aptitude' | 'Common Part' | 'Part B1' | 'Part B2';

export type QuestionType = 'MCQ' | 'MSQ' | 'NAT' | 'MATCH';

export interface Question {
  id: number;
  subject: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: any; // number for MCQ/MATCH, number[] for MSQ, string/number for NAT
  explanation: string;
  difficulty: Difficulty;
  imageUrl?: string;
}

export interface UserResponse {
  questionId: number;
  selectedOption: number | null; // For MCQ/MATCH
  selectedOptions?: number[]; // For MSQ
  numericalValue?: string; // For NAT
  status: 'Answered' | 'Not Answered' | 'Marked for Review' | 'Answered & Marked' | 'Not Visited';
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface TestConfig {
  subject: GateSubject;
  difficulty: Difficulty;
}

export interface LogEntry {
  timestamp: string;
  prompt: string;
  context?: string;
}

export interface ProjectLog {
  sessionId: string;
  sessionStart: string;
  platform: string;
  entries: LogEntry[];
}
