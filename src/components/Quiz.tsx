import React, { useState, useEffect } from 'react';
import QuestionSlide from './QuestionSlide';
import Results from './Results';
import { quizQuestions } from '../data/questions';
import { QuizService } from '../services/QuizService';
import { AdminService } from '../services/AdminService';
import { QuizDataService } from '../services/QuizDataService';
import { Answer, QuizResult, Question } from '../types/quiz';
import '../styles/Quiz.scss';

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [quizService] = useState(() => new QuizService());
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to load from JSON file first
        const quizDataService = new QuizDataService();
        const jsonQuestions = await quizDataService.getQuizQuestions();
        if (jsonQuestions.length > 0) {
          setQuestions(jsonQuestions);
        } else {
          // Fallback to admin questions
          const adminService = new AdminService();
          const adminQuestions = await adminService.getQuizQuestions();
          if (adminQuestions.length > 0) {
            setQuestions(adminQuestions);
          } else {
            // Final fallback to default questions
            setQuestions(quizQuestions);
          }
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load quiz questions');
        
        // Fallback to default questions on error
        try {
          const adminService = new AdminService();
          const adminQuestions = await adminService.getQuizQuestions();
          if (adminQuestions.length > 0) {
            setQuestions(adminQuestions);
          } else {
            setQuestions(quizQuestions);
          }
        } catch {
          setQuestions(quizQuestions);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const selectedAnswer = selectedAnswers[currentQuestion?.id] || null;

  const handleAnswerSelect = (answer: Answer) => {
    if (!currentQuestion) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer.id
    }));

    quizService.addResponse({
      questionId: currentQuestion.id,
      answerId: answer.id,
      weight: answer.weight,
      topic: answer.topic
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Complete the quiz
      const quizResult = quizService.calculateResults();
      setResult(quizResult);
      setIsComplete(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsComplete(false);
    setResult(null);
    quizService.reset();
  };

  const canGoNext = selectedAnswer !== null;
  const canGoBack = currentQuestionIndex > 0;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Don't render until questions are loaded
  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div className="loading-spinner"></div>
            <p>Loading quiz questions...</p>
            {error && (
              <div style={{ color: '#ff6600', marginTop: '16px' }}>
                <p>⚠️ {error}</p>
                <p>Loading from fallback source...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <p>No quiz questions available. Please contact an administrator.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && result) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <Results result={result} onRestart={handleRestart} />
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h1>Find Your Perfect Work Style</h1>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        <div className="question-container">
          <QuestionSlide
            key={currentQuestionIndex}
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onBack={handleBack}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;