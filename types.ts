
export type Category = 'funny' | 'thoughtful' | 'animal' | 'gross';

export interface Question {
  id: string;
  category: Category;
  optionA: string;
  optionB: string;
  timestamp: number;
}

export interface GeminiResponse {
  optionA: string;
  optionB: string;
}
