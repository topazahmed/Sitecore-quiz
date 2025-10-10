import { AdminUser, AdminQuestion, QuestionFormData } from '../types/admin';
import { Question } from '../types/quiz';

export class AdminService {
  private readonly ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '@Dmin'
  };

  private readonly STORAGE_KEY = 'quiz_admin_questions';
  private readonly AUTH_KEY = 'quiz_admin_auth';

  // Authentication
  login(username: string, password: string): boolean {
    const isValid = username === this.ADMIN_CREDENTIALS.username && 
                   password === this.ADMIN_CREDENTIALS.password;
    
    if (isValid) {
      const user: AdminUser = { username, isAuthenticated: true };
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
    }
    
    return isValid;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    try {
      const authData = localStorage.getItem(this.AUTH_KEY);
      if (!authData) return false;
      
      const user: AdminUser = JSON.parse(authData);
      return user.isAuthenticated === true;
    } catch {
      return false;
    }
  }

  getCurrentUser(): AdminUser | null {
    try {
      const authData = localStorage.getItem(this.AUTH_KEY);
      if (!authData) return null;
      
      return JSON.parse(authData);
    } catch {
      return null;
    }
  }

  // Question Management
  saveQuestion(questionData: QuestionFormData): AdminQuestion {
    const questions = this.getAllQuestions();
    const now = new Date();
    
    const existingIndex = questions.findIndex(q => q.id === questionData.id);
    
    const question: AdminQuestion = {
      ...questionData,
      createdAt: existingIndex >= 0 ? questions[existingIndex].createdAt : now,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      questions[existingIndex] = question;
    } else {
      questions.push(question);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questions));
    return question;
  }

  getAllQuestions(): AdminQuestion[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      
      return JSON.parse(data).map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
        updatedAt: new Date(q.updatedAt)
      }));
    } catch {
      return [];
    }
  }

  getQuestion(id: string): AdminQuestion | null {
    const questions = this.getAllQuestions();
    return questions.find(q => q.id === id) || null;
  }

  deleteQuestion(id: string): boolean {
    const questions = this.getAllQuestions();
    const filteredQuestions = questions.filter(q => q.id !== id);
    
    if (filteredQuestions.length !== questions.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredQuestions));
      return true;
    }
    
    return false;
  }

  // Convert admin questions to quiz format
  getQuizQuestions(): Question[] {
    return this.getAllQuestions().map(adminQ => ({
      id: adminQ.id,
      text: adminQ.text,
      topic: adminQ.topic,
      answers: adminQ.answers.map(answer => ({
        id: answer.id,
        text: answer.text,
        weight: answer.weight,
        topic: answer.topic
      }))
    }));
  }

  // Import/Export functionality
  exportQuestions(): string {
    const questions = this.getAllQuestions();
    return JSON.stringify(questions, null, 2);
  }

  importQuestions(jsonData: string): boolean {
    try {
      const questions = JSON.parse(jsonData);
      if (Array.isArray(questions)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questions));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}