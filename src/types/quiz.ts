export interface Answer {
  id: string;
  text: string;
  weight: number;
  topic: string;
}

export interface Question {
  id: string;
  text: string;
  topic: string;
  answers: Answer[];
}

export interface QuizResponse {
  questionId: string;
  answerId: string;
  weight: number;
  topic: string;
}

export interface TopicScore {
  topic: string;
  totalWeight: number;
  count: number;
  averageWeight: number;
}

export interface QuizResult {
  responses: QuizResponse[];
  topicScores: TopicScore[];
  totalScore: number;
  completedAt: Date;
}