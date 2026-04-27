import React, { useState } from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children, activePage, setActivePage }) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  return (
    <div className="h-screen w-full bg-background flex font-sans text-text overflow-hidden transition-smooth">
      <Sidebar 
        activePage={activePage}
        setActivePage={setActivePage}
        isHovered={isSidebarHovered}
        setIsHovered={setIsSidebarHovered}
      />
      
      {/* Map occupies full width (ml-0). Other pages keep ml-20. */}
      <main 
        className={`flex-1 h-screen transition-smooth flex flex-col ${activePage === 'map' ? 'ml-0' : 'ml-20'}`}
      >
        <div className={`flex-1 flex w-full h-full relative ${activePage === 'map' ? 'p-0' : 'p-3 md:p-5 overflow-y-auto'}`}>
          {/* Inject isSidebarExpanded prop into children so Map UI knows how to position itself */}
          {React.cloneElement(children, { isSidebarExpanded: isSidebarHovered })}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
