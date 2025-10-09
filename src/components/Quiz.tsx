import React, { useState } from 'react';
import QuestionSlide from './QuestionSlide';
import Results from './Results';
import { quizQuestions } from '../data/questions';
import { QuizService } from '../services/QuizService';
import { Answer, QuizResult } from '../types/quiz';
import '../styles/Quiz.scss';

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [quizService] = useState(() => new QuizService());
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
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
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

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
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
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
            totalQuestions={quizQuestions.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;