import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import { SitecoreService } from './services/sitecoreService';
import { SitecoreItem } from './types/sitecore';
import SitecoreItemDisplay from './components/SitecoreItemDisplay';

function App() {
  const [sitecoreData, setSitecoreData] = useState<SitecoreItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSitecoreData = async () => {
    setLoading(true);
    try {
      const service = new SitecoreService();
      const data = await service.getItem('/sitecore/content/Home');
      setSitecoreData(data);
    } catch (error) {
      console.error('Error fetching Sitecore data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Uncomment to fetch data on component mount
    // fetchSitecoreData();
  }, []);

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Sitecore Quiz Application</h1>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <div className="home">
                <h2>Welcome to Sitecore Quiz</h2>
                <button onClick={fetchSitecoreData} disabled={loading}>
                  {loading ? 'Loading...' : 'Fetch Sitecore Data'}
                </button>
                
                {sitecoreData && (
                  <div className="sitecore-data">
                    <h3>Sitecore Item Data:</h3>
                    <SitecoreItemDisplay item={sitecoreData} />
                  </div>
                )}
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;