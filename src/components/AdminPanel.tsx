import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/AdminService';
import AdminLogin from './AdminLogin';
import QuestionsList from './QuestionsList';
import QuestionForm from './QuestionForm';
import { AdminQuestion } from '../types/admin';
import '../styles/Admin.scss';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions');
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const [showForm, setShowForm] = useState(false);

  const adminService = new AdminService();

  useEffect(() => {
    setIsAuthenticated(adminService.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    adminService.logout();
    setIsAuthenticated(false);
    setActiveTab('questions');
    setEditingQuestion(null);
    setShowForm(false);
  };

  const handleEditQuestion = (question: AdminQuestion) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleSaveQuestion = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleExport = () => {
    const data = adminService.exportQuestions();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-questions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const success = adminService.importQuestions(data);
            if (success) {
              alert('Questions imported successfully!');
              window.location.reload(); // Refresh to show new questions
            } else {
              alert('Failed to import questions. Please check the file format.');
            }
          } catch (error) {
            alert('Error reading file. Please ensure it\'s a valid JSON file.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Quiz Administration</h1>
        <div className="admin-actions">
          <button className="admin-button btn-secondary" onClick={handleExport}>
            Export Questions
          </button>
          <button className="admin-button btn-secondary" onClick={handleImport}>
            Import Questions
          </button>
          <button className="admin-button btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {!showForm && (
        <>
          <div className="admin-tabs">
            <button
              className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions Management
            </button>
            <button
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Quiz Settings
            </button>
          </div>

          <div className="admin-content">
            {activeTab === 'questions' && (
              <QuestionsList onEditQuestion={handleEditQuestion} />
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h3>Quiz Settings</h3>
                <p>Quiz configuration options will be available here:</p>
                <ul>
                  <li>Default question weights</li>
                  <li>Quiz time limits</li>
                  <li>Result calculation methods</li>
                  <li>Theme customization</li>
                </ul>
                <p><em>This section will be implemented in future updates.</em></p>
              </div>
            )}
          </div>
        </>
      )}

      {showForm && (
        <div className="admin-content">
          <QuestionForm
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;