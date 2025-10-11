import { QuizData, QuestionData, AnswerData } from '../types/quizData';
import { Question, Answer } from '../types/quiz';

export class QuizDataService {
  private quizData: QuizData | null = null;
  private readonly DATA_URL = '/quiz-data.json';

  // Load quiz data from JSON file
  async loadQuizData(): Promise<QuizData> {
    if (this.quizData) {
      return this.quizData;
    }

    try {
      const response = await fetch(this.DATA_URL);
      if (!response.ok) {
        throw new Error(`Failed to load quiz data: ${response.statusText}`);
      }
      
      this.quizData = await response.json();
      return this.quizData!;
    } catch (error) {
      console.error('Error loading quiz data:', error);
      throw error;
    }
  }

  // Convert backend question data to frontend format
  convertToQuizFormat(questionData: QuestionData): Question {
    return {
      id: questionData.id,
      text: questionData.text,
      topic: questionData.topic,
      answers: questionData.answers.map(answer => this.convertAnswerToQuizFormat(answer))
    };
  }

  // Convert backend answer data to frontend format
  convertAnswerToQuizFormat(answerData: AnswerData): Answer {
    return {
      id: answerData.id,
      text: answerData.text,
      weight: answerData.weight,
      topic: answerData.topic
    };
  }

  // Get all questions in quiz format
  async getQuizQuestions(): Promise<Question[]> {
    const data = await this.loadQuizData();
    return data.questions
      .sort((a, b) => a.order - b.order)
      .map(q => this.convertToQuizFormat(q));
  }

  // Get quiz metadata
  async getQuizMetadata() {
    const data = await this.loadQuizData();
    return data.quizMetadata;
  }

  // Get scoring configuration
  async getScoringConfig() {
    const data = await this.loadQuizData();
    return data.scoring;
  }

  // Get results configuration
  async getResultsConfig() {
    const data = await this.loadQuizData();
    return data.results;
  }

  // Get question by ID
  async getQuestionById(id: string): Promise<QuestionData | null> {
    const data = await this.loadQuizData();
    return data.questions.find(q => q.id === id) || null;
  }

  // Get questions by topic
  async getQuestionsByTopic(topic: string): Promise<QuestionData[]> {
    const data = await this.loadQuizData();
    return data.questions.filter(q => q.topic === topic);
  }

  // Get answer with full styling information
  async getAnswerWithStyling(questionId: string, answerId: string): Promise<AnswerData | null> {
    const question = await this.getQuestionById(questionId);
    if (!question) return null;
    
    return question.answers.find(a => a.id === answerId) || null;
  }

  // Calculate profile based on score
  async getProfileByScore(totalScore: number): Promise<any> {
    const resultsConfig = await this.getResultsConfig();
    
    for (const [profileKey, profile] of Object.entries(resultsConfig.profiles)) {
      const [min, max] = profile.scoreRange;
      if (totalScore >= min && totalScore <= max) {
        return {
          key: profileKey,
          ...profile
        };
      }
    }
    
    // Default to balanced professional if no match
    return {
      key: 'balanced_professional',
      ...resultsConfig.profiles.balanced_professional
    };
  }

  // Save updated quiz data (for admin functionality)
  async saveQuizData(data: QuizData): Promise<boolean> {
    try {
      // In a real application, this would make a PUT/POST request to save the data
      // For now, we'll just update the local cache and localStorage
      this.quizData = data;
      localStorage.setItem('quiz_data_backup', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving quiz data:', error);
      return false;
    }
  }

  // Export quiz data as JSON string
  async exportQuizData(): Promise<string> {
    const data = await this.loadQuizData();
    return JSON.stringify(data, null, 2);
  }

  // Import quiz data from JSON string
  async importQuizData(jsonString: string): Promise<boolean> {
    try {
      const data: QuizData = JSON.parse(jsonString);
      
      // Basic validation
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid quiz data format');
      }
      
      return await this.saveQuizData(data);
    } catch (error) {
      console.error('Error importing quiz data:', error);
      return false;
    }
  }

  // Get questions with full styling for admin display
  async getQuestionsWithStyling(): Promise<QuestionData[]> {
    const data = await this.loadQuizData();
    return data.questions.sort((a, b) => a.order - b.order);
  }

  // Validate quiz data structure
  validateQuizData(data: any): boolean {
    try {
      // Check required top-level properties
      if (!data.quizMetadata || !data.questions || !data.scoring || !data.results) {
        return false;
      }

      // Validate questions array
      if (!Array.isArray(data.questions)) {
        return false;
      }

      // Validate each question
      for (const question of data.questions) {
        if (!question.id || !question.text || !question.topic || !Array.isArray(question.answers)) {
          return false;
        }

        // Validate each answer
        for (const answer of question.answers) {
          if (!answer.id || !answer.text || typeof answer.weight !== 'number') {
            return false;
          }
        }
      }

      return true;
    } catch {
      return false;
    }
  }
}