import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children, activePage, setActivePage }) => {
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
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
