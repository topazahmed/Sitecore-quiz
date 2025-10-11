export interface QuizData {
  quizMetadata: QuizMetadata;
  questions: QuestionData[];
  scoring: ScoringConfig;
  results: ResultsConfig;
}

export interface QuizMetadata {
  title: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionData {
  id: string;
  text: string;
  topic: string;
  type: 'single' | 'multiple' | 'rating';
  required: boolean;
  order: number;
  metadata: QuestionMetadata;
  answers: AnswerData[];
}

export interface QuestionMetadata {
  createdAt: string;
  updatedAt: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AnswerData {
  id: string;
  text: string;
  weight: number;
  topic: string;
  backgroundColor: string;
  textColor: string;
  answerType: string;
  description: string;
}

export interface ScoringConfig {
  algorithm: string;
  maxScore: number;
  categories: Record<string, CategoryConfig>;
}

export interface CategoryConfig {
  weight: number;
  description: string;
}

export interface ResultsConfig {
  profiles: Record<string, ProfileConfig>;
}

export interface ProfileConfig {
  name: string;
  description: string;
  scoreRange: [number, number];
  characteristics: string[];
}