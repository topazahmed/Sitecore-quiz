import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/AdminService';
import { AdminQuestion, QuestionFormData, AnswerFormData } from '../types/admin';
import '../styles/QuestionForm.scss';

interface QuestionFormProps {
  question: AdminQuestion | null;
  onSave: () => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    id: '',
    text: '',
    topic: '',
    type: 'single',
    answers: [
      { id: '1', text: '', weight: 1, topic: '', backgroundColor: '#ffffff' },
      { id: '2', text: '', weight: 2, topic: '', backgroundColor: '#ffffff' },
      { id: '3', text: '', weight: 3, topic: '', backgroundColor: '#ffffff' },
      { id: '4', text: '', weight: 4, topic: '', backgroundColor: '#ffffff' }
    ]
  });

  const adminService = new AdminService();

  useEffect(() => {
    if (question) {
      setFormData({
        id: question.id,
        text: question.text,
        topic: question.topic,
        type: question.type,
        answers: question.answers.map(answer => ({
          ...answer,
          backgroundColor: answer.backgroundColor || '#ffffff'
        }))
      });
    }
  }, [question]);

  const generateId = () => {
    return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text.trim() || !formData.topic.trim()) {
      alert('Please fill in the question text and topic');
      return;
    }

    const validAnswers = formData.answers.filter(answer => answer.text.trim());
    if (validAnswers.length < 2) {
      alert('Please provide at least 2 answers');
      return;
    }

    const questionToSave: QuestionFormData = {
      ...formData,
      id: formData.id || generateId(),
      answers: validAnswers.map(answer => ({
        ...answer,
        topic: formData.topic,
        id: answer.id || generateId()
      }))
    };

    adminService.saveQuestion(questionToSave);
    onSave();
  };

  const updateAnswer = (index: number, field: keyof AnswerFormData, value: string | number) => {
    const updatedAnswers = [...formData.answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      [field]: value
    };
    setFormData({ ...formData, answers: updatedAnswers });
  };

  const addAnswer = () => {
    const newAnswer: AnswerFormData = {
      id: generateId(),
      text: '',
      weight: formData.answers.length + 1,
      topic: formData.topic,
      backgroundColor: '#ffffff'
    };
    setFormData({
      ...formData,
      answers: [...formData.answers, newAnswer]
    });
  };

  const removeAnswer = (index: number) => {
    if (formData.answers.length <= 2) {
      alert('You must have at least 2 answers');
      return;
    }
    const updatedAnswers = formData.answers.filter((_, i) => i !== index);
    setFormData({ ...formData, answers: updatedAnswers });
  };

  return (
    <div className="question-form">
      <h3>{question?.id ? 'Edit Question' : 'Create New Question'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h4>Question Details</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="questionText">Question Text</label>
              <textarea
                id="questionText"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Enter your question here..."
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <input
                type="text"
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Communication, Motivation"
                required
              />
            </div>
            
            <div className="form-group form-group-small">
              <label htmlFor="type">Question Type</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'single' | 'multiple' | 'rating' })}
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
                <option value="rating">Rating Scale</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section answers-section">
          <h4>Answers ({formData.answers.length})</h4>
          
          {formData.answers.map((answer, index) => (
            <div key={answer.id} className="answer-item">
              <div 
                className="answer-preview"
                style={{ backgroundColor: answer.backgroundColor }}
              >
                {index + 1}
              </div>
              
              <div className="form-group">
                <label>Answer Text</label>
                <input
                  type="text"
                  value={answer.text}
                  onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                />
              </div>
              
              <div className="form-group form-group-small">
                <label>Weight</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={answer.weight}
                  onChange={(e) => updateAnswer(index, 'weight', parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div className="form-group form-group-small">
                <label>Background</label>
                <input
                  type="color"
                  value={answer.backgroundColor}
                  onChange={(e) => updateAnswer(index, 'backgroundColor', e.target.value)}
                />
              </div>
              
              {formData.answers.length > 2 && (
                <button
                  type="button"
                  className="remove-answer"
                  onClick={() => removeAnswer(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            className="add-answer"
            onClick={addAnswer}
          >
            + Add Another Answer
          </button>
        </div>

        <div className="preview-section">
          <h4>Preview</h4>
          <div className="preview-question">
            {formData.topic && (
              <div className="preview-topic">{formData.topic}</div>
            )}
            <div className="preview-text">
              {formData.text || 'Your question will appear here...'}
            </div>
            <div className="preview-answers">
              {formData.answers.map((answer, index) => (
                <div 
                  key={answer.id} 
                  className="preview-answer"
                  style={{ backgroundColor: answer.backgroundColor }}
                >
                  <div className="preview-radio"></div>
                  <div className="preview-answer-text">
                    {answer.text || `Answer ${index + 1}`}
                  </div>
                  <div className="preview-weight">
                    Weight: {answer.weight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="form-button btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="form-button btn-primary">
            {question?.id ? 'Update Question' : 'Create Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;