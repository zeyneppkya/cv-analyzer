import React, { useState, useEffect } from 'react';
import { Welcome } from './pages/Welcome';
import { Dashboard } from './components/Dashboard';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for existing session
    const storedKey = localStorage.getItem('cv_nexus_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleLogin = (key: string) => {
    localStorage.setItem('cv_nexus_api_key', key);
    setApiKey(key);
  };

  const handleLogout = () => {
    localStorage.removeItem('cv_nexus_api_key');
    setApiKey(null);
  };

  return (
    <div className="antialiased text-gray-900 font-sans">
      {!apiKey ? (
        <Welcome onApiKeySubmit={handleLogin} />
      ) : (
        <Dashboard apiKey={apiKey} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;