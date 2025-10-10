import React, { useState } from 'react';
import Quiz from './components/Quiz';
import AdminPanel from './components/AdminPanel';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  // Check if admin route is accessed via URL
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      setShowAdmin(true);
    }
  }, []);

  const toggleAdmin = () => {
    setShowAdmin(!showAdmin);
    // Update URL without page reload
    const newPath = showAdmin ? '/' : '/admin';
    window.history.pushState({}, '', newPath);
  };

  return (
    <div className="App">
      {showAdmin ? (
        <AdminPanel />
      ) : (
        <Quiz />
      )}
      
      {/* Admin access button */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={toggleAdmin}
          style={{
            padding: '12px 16px',
            backgroundColor: showAdmin ? '#dc3545' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          {showAdmin ? '← Back to Quiz' : '⚙️ Admin'}
        </button>
      </div>
    </div>
  );
}

export default App;
