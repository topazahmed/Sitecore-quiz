import { QuizResponse, TopicScore, QuizResult } from '../types/quiz';

export class QuizService {
  private responses: QuizResponse[] = [];

  addResponse(response: QuizResponse): void {
    // Remove any existing response for this question
    this.responses = this.responses.filter(r => r.questionId !== response.questionId);
    this.responses.push(response);
  }

  calculateResults(): QuizResult {
    const topicScores = this.calculateTopicScores();
    const totalScore = this.responses.reduce((sum, response) => sum + response.weight, 0);

    return {
      responses: [...this.responses],
      topicScores,
      totalScore,
      completedAt: new Date()
    };
  }

  private calculateTopicScores(): TopicScore[] {
    const topicMap = new Map<string, { totalWeight: number; count: number }>();

    this.responses.forEach(response => {
      const existing = topicMap.get(response.topic) || { totalWeight: 0, count: 0 };
      topicMap.set(response.topic, {
        totalWeight: existing.totalWeight + response.weight,
        count: existing.count + 1
      });
    });

    return Array.from(topicMap.entries()).map(([topic, data]) => ({
      topic,
      totalWeight: data.totalWeight,
      count: data.count,
      averageWeight: Math.round((data.totalWeight / data.count) * 100) / 100
    }));
  }

  getResponseCount(): number {
    return this.responses.length;
  }

  hasAnsweredQuestion(questionId: string): boolean {
    return this.responses.some(r => r.questionId === questionId);
  }

  reset(): void {
    this.responses = [];
  }
}