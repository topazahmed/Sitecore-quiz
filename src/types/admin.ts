export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

export interface QuestionFormData {
  id: string;
  text: string;
  topic: string;
  type: 'single' | 'multiple' | 'rating';
  answers: AnswerFormData[];
}

export interface AnswerFormData {
  id: string;
  text: string;
  weight: number;
  topic: string;
  backgroundColor?: string;
}

export interface AdminQuestion extends QuestionFormData {
  createdAt: Date;
  updatedAt: Date;
}