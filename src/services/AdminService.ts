import { AdminUser, AdminQuestion, QuestionFormData } from '../types/admin';
import { Question } from '../types/quiz';
import { QuizDataService } from './QuizDataService';

export class AdminService {
  private readonly ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '@Dmin'
  };

  private readonly STORAGE_KEY = 'quiz_admin_questions';
  private readonly AUTH_KEY = 'quiz_admin_auth';
  private quizDataService = new QuizDataService();

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

  // Force reload questions from JSON backend (for admin use)
  async reloadFromJsonBackend(): Promise<void> {
    try {
      const jsonQuestions = await this.quizDataService.getQuizQuestions();
      
      // Convert Quiz questions to AdminQuestion format
      const adminQuestions: AdminQuestion[] = jsonQuestions.map(q => ({
        id: q.id,
        text: q.text,
        topic: q.topic,
        type: 'single' as const, // Default to single choice
        answers: q.answers.map(a => ({
          id: a.id,
          text: a.text,
          weight: a.weight,
          topic: a.topic
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Replace existing questions with JSON data
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(adminQuestions));
      console.log(`Reloaded ${adminQuestions.length} questions from JSON backend`);
    } catch (error) {
      console.error('Failed to reload questions from JSON backend:', error);
      throw error;
    }
  }

  // Initialize admin questions from JSON backend if localStorage is empty
  async initializeFromJsonBackend(): Promise<void> {
    const existingQuestions = this.getAllQuestions();
    
    // Only load from JSON if no admin questions exist
    if (existingQuestions.length === 0) {
      try {
        const jsonQuestions = await this.quizDataService.getQuizQuestions();
        
        // Convert Quiz questions to AdminQuestion format
        const adminQuestions: AdminQuestion[] = jsonQuestions.map(q => ({
          id: q.id,
          text: q.text,
          topic: q.topic,
          type: 'single' as const, // Default to single choice
          answers: q.answers.map(a => ({
            id: a.id,
            text: a.text,
            weight: a.weight,
            topic: a.topic
          })),
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(adminQuestions));
        console.log(`Loaded ${adminQuestions.length} questions from JSON backend into admin panel`);
      } catch (error) {
        console.error('Failed to load questions from JSON backend:', error);
      }
    }
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
  async getQuizQuestions(): Promise<Question[]> {
    // First try to get from localStorage (admin-managed questions)
    const localQuestions = this.getAllQuestions();
    
    if (localQuestions.length > 0) {
      return localQuestions.map(adminQ => ({
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

    // Fallback to JSON backend
    try {
      const jsonQuestions = await this.quizDataService.getQuizQuestions();
      return jsonQuestions;
    } catch (error) {
      console.error('Error loading questions from JSON backend:', error);
      return [];
    }
  }

  // Synchronous version for backward compatibility
  getQuizQuestionsSync(): Question[] {
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