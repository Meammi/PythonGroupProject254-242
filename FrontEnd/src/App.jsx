import React, { useState } from 'react';
import MainLayout from './components/MainLayout';
import MapPage from './pages/MapPage';

// Simple mock pages for other routes (to keep App.jsx clean without deleting features)
const InsightsPage = () => (
  <div className="p-8 max-w-6xl mx-auto w-full">
    <h2 className="text-3xl font-bold text-text mb-2">Culture Insights</h2>
    <p className="text-text-muted mb-8">Discover campus trends and activities.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-card p-6 h-48 flex items-center justify-center">
          <span className="text-text-muted font-medium">Data Insight {i}</span>
        </div>
      ))}
    </div>
  </div>
);

const FavoritePage = () => (
  <div className="p-8 max-w-6xl mx-auto w-full">
    <h2 className="text-3xl font-bold text-text mb-2">Your Favorites</h2>
    <p className="text-text-muted mb-8">Saved locations and insights.</p>
    <div className="glass-card p-8 min-h-[400px] flex flex-col items-center justify-center text-text-muted">
       <span className="text-4xl mb-4">🤍</span>
       <p>No favorites added yet.</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="p-8 max-w-6xl mx-auto w-full">
    <h2 className="text-3xl font-bold text-text mb-2">Settings</h2>
    <p className="text-text-muted mb-8">Manage your application preferences.</p>
    <div className="glass-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background rounded-[16px]">
          <span className="font-medium text-text">Dark Mode</span>
          <div className="w-12 h-6 bg-border rounded-full"></div>
        </div>
        <div className="flex items-center justify-between p-4 bg-background rounded-[16px]">
          <span className="font-medium text-text">Notifications</span>
          <div className="w-12 h-6 bg-primary rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-surface rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [activePage, setActivePage] = useState('map'); // Default page is Map

  // Page Switcher Logic
  const renderContent = () => {
    switch (activePage) {
      case 'map': return <MapPage />;
      case 'insights': return <InsightsPage />;
      case 'favorite': return <FavoritePage />;
      case 'settings': return <SettingsPage />;
      default: return <MapPage />;
    }
  };

  return (
    <MainLayout activePage={activePage} setActivePage={setActivePage}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;
