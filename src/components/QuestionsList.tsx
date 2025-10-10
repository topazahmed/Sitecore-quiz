import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/AdminService';
import { AdminQuestion } from '../types/admin';
import '../styles/Admin.scss';

interface QuestionsListProps {
  onEditQuestion: (question: AdminQuestion) => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({ onEditQuestion }) => {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const adminService = new AdminService();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    const allQuestions = adminService.getAllQuestions();
    setQuestions(allQuestions);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const success = adminService.deleteQuestion(id);
      if (success) {
        loadQuestions();
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="questions-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3>Manage Questions ({questions.length})</h3>
        <button 
          className="admin-button btn-primary"
          onClick={() => onEditQuestion({
            id: '',
            text: '',
            topic: '',
            type: 'single',
            answers: [
              { id: '1', text: '', weight: 1, topic: '', backgroundColor: '#ffffff' },
              { id: '2', text: '', weight: 2, topic: '', backgroundColor: '#ffffff' },
              { id: '3', text: '', weight: 3, topic: '', backgroundColor: '#ffffff' },
              { id: '4', text: '', weight: 4, topic: '', backgroundColor: '#ffffff' }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          })}
        >
          Add New Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6c757d' }}>
          <p>No questions found. Create your first question to get started!</p>
        </div>
      ) : (
        questions.map((question) => (
          <div key={question.id} className="question-item">
            <div className="question-header">
              <div className="question-info">
                <div className="question-text">{question.text}</div>
                <div className="question-meta">
                  <span className="topic-badge">{question.topic}</span>
                  <span>Type: {question.type}</span>
                  <span> • Created: {formatDate(question.createdAt)}</span>
                  {question.updatedAt > question.createdAt && (
                    <span> • Updated: {formatDate(question.updatedAt)}</span>
                  )}
                </div>
              </div>
              <div className="question-actions">
                <button 
                  className="edit-btn"
                  onClick={() => onEditQuestion(question)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(question.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="question-answers">
              {question.answers.map((answer, index) => (
                <div key={answer.id} className="answer-item">
                  <div 
                    className="answer-text"
                    style={{ 
                      backgroundColor: answer.backgroundColor || '#f8f9fa',
                      padding: '8px',
                      borderRadius: '4px'
                    }}
                  >
                    {answer.text || `Answer ${index + 1} (empty)`}
                  </div>
                  <div className="answer-weight">Weight: {answer.weight}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionsList;