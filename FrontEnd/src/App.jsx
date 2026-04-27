import React, { useState } from 'react';
import { Map as MapIcon } from 'lucide-react';
import Sidebar from './components/Sidebar/Sidebar';
import { Card } from './components/UI/Card';
import { Badge } from './components/UI/Badge';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen bg-background flex font-sans text-text transition-smooth">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <main 
        className={`flex-1 flex flex-col min-h-screen transition-smooth ${isCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        <header className="h-16 bg-surface border-b border-border flex items-center px-6 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-text">Welcome Back</h1>
        </header>
        
        <div className="p-6 md:p-8 flex-1">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Campus Discovery</h2>
              <Badge status="active">Live Updates</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <h3 className="font-medium text-text-muted mb-2">Total Insights</h3>
                <p className="text-3xl font-bold text-primary">1,248</p>
              </Card>
              <Card>
                <h3 className="font-medium text-text-muted mb-2">Active Locations</h3>
                <p className="text-3xl font-bold text-secondary">36</p>
              </Card>
              <Card>
                <h3 className="font-medium text-text-muted mb-2">Crowd Status</h3>
                <p className="text-3xl font-bold text-text">Moderate</p>
              </Card>
            </div>
            
            <Card className="h-[400px] flex items-center justify-center bg-background border-dashed">
              <div className="text-center text-text-muted flex flex-col items-center gap-2">
                <MapIcon size={48} className="opacity-50" />
                <p>Google Maps Integration Container (src/components/Map/)</p>
              </div>
            </Card>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
