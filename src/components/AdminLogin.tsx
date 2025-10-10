import React, { useState } from 'react';
import { AdminService } from '../services/AdminService';
import '../styles/Admin.scss';

interface LoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const adminService = new AdminService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay for better UX
    setTimeout(() => {
      const success = adminService.login(username, password);
      
      if (success) {
        onLogin();
      } else {
        setError('Invalid username or password');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="quiz-container">
      <div className="admin-login">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;