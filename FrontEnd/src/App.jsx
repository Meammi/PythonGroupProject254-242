import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';

// --- Page Components ---

const MapPage = () => (
  <div className="w-full h-full bg-surface rounded-[16px] border border-border shadow-sm flex flex-col items-center justify-center overflow-hidden relative group">
    {/* Immersive Map Placeholder Background using custom variables */}
    <div 
      className="absolute inset-0 opacity-10 transition-smooth group-hover:opacity-20" 
      style={{ 
        backgroundImage: 'radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)', 
        backgroundSize: '32px 32px' 
      }}
    ></div>
    
    <div className="z-10 flex flex-col items-center p-8 bg-surface/80 backdrop-blur-md rounded-[16px] border border-border shadow-sm">
      <h2 className="text-3xl font-bold text-primary mb-2 text-center">Interactive Campus Map</h2>
      <p className="text-text-muted text-center max-w-md">
        This immersive full-screen container is ready for your Google Maps integration.
      </p>
    </div>
  </div>
);

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

// --- Main Application ---

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
    <div className="h-screen w-full bg-background flex font-sans text-text overflow-hidden transition-smooth">
      <Sidebar 
        activePage={activePage}
        setActivePage={setActivePage}
      />
      
      {/* Main Layout Area - Margin left stays 20 so sidebar overlays smoothly on hover */}
      <main 
        className="flex-1 h-screen transition-smooth flex flex-col ml-20"
      >
        <div className={`flex-1 flex w-full h-full ${activePage === 'map' ? 'p-3 md:p-5' : 'overflow-y-auto'}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
