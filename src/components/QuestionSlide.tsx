import React from 'react';
import { Question, Answer } from '../types/quiz';
import '../styles/QuestionSlide.scss';

interface QuestionSlideProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: Answer) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  currentQuestion: number;
  totalQuestions: number;
}

const QuestionSlide: React.FC<QuestionSlideProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onBack,
  canGoBack,
  canGoNext,
  currentQuestion,
  totalQuestions,
}) => {
  return (
    <div className="question-slide">
      <div className="question-header">
        <div className="question-topic">{question.topic}</div>
        <h2 className="question-text">{question.text}</h2>
      </div>

      <div className="answers-container">
        {question.answers.map((answer) => (
          <div key={answer.id} className="answer-option">
            <input
              type="radio"
              id={answer.id}
              name={`question-${question.id}`}
              checked={selectedAnswer === answer.id}
              onChange={() => onAnswerSelect(answer)}
            />
            <label htmlFor={answer.id} className="answer-label">
              {answer.text}
            </label>
          </div>
        ))}
      </div>

      <div className="question-navigation">
        <button
          className="nav-button btn-back"
          onClick={onBack}
          disabled={!canGoBack}
        >
          Previous
        </button>

        <div className="question-counter">
          Question {currentQuestion} of {totalQuestions}
        </div>

        <button
          className="nav-button btn-next"
          onClick={onNext}
          disabled={!canGoNext}
        >
          {currentQuestion === totalQuestions ? 'View Results' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuestionSlide;