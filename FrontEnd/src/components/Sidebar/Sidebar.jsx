import React, { useState } from 'react';
import { Map, Activity, Heart, Settings, User, Landmark } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  // Mock login state for demonstration (Clicking the profile toggles this!)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isHovered, setIsHovered] = useState(false);

  const isCollapsed = !isHovered;
  
  const menuItems = [
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'insights', icon: Activity, label: 'Insights' },
    { id: 'favorite', icon: Heart, label: 'Favorite' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-screen bg-surface border-r border-border transition-smooth z-30 flex flex-col shadow-sm ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      
      {/* Top Logo */}
      <div className="flex items-center gap-3 p-5 h-20 border-b border-border">
        <div 
          className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center shrink-0 shadow-sm transition-smooth" 
        >
          <Landmark className="text-surface" size={20} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <span className="font-bold text-primary text-lg leading-tight tracking-tight">TU Discovery</span>
            <span className="text-text-muted text-[10px] tracking-wide uppercase font-medium">Campus Navigator</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center transition-smooth group outline-none relative
                ${isCollapsed ? 'justify-center p-0 h-12 w-12 mx-auto rounded-[14px]' : 'justify-start p-3 rounded-[14px] gap-4 w-full'}
                ${isActive && !isCollapsed ? 'bg-primary/10 text-primary' : ''}
                ${!isActive && !isCollapsed ? 'hover:bg-background text-text-muted hover:text-text' : ''}
                ${!isActive && isCollapsed ? 'text-text-muted hover:bg-background' : ''}
              `}
              title={item.label}
            >
              <div className={`flex items-center justify-center transition-smooth
                ${isCollapsed ? 'w-12 h-12 rounded-[14px]' : ''} 
                ${isCollapsed && isActive ? 'bg-primary text-surface shadow-md' : ''}
              `}>
                 <item.icon 
                   size={22} 
                   className={`transition-smooth
                     ${!isCollapsed && isActive ? 'text-primary' : ''} 
                     ${isCollapsed && isActive ? 'text-surface' : ''}
                   `} 
                 />
              </div>
              {!isCollapsed && <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom Account Section */}
      <div className="p-4 border-t border-border mt-auto">
        {isLoggedIn ? (
          <div 
            className={`flex items-center gap-3 cursor-pointer p-2 rounded-[14px] hover:bg-background transition-smooth ${isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''}`}
            onClick={() => setIsLoggedIn(false)}
            title="Click to logout"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai" alt="Dr. Somchai P." className="w-10 h-10 rounded-full shrink-0 bg-surface border border-border" />
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap text-left">
                <span className="font-bold text-sm text-text">Dr. Somchai P.</span>
                <span className="text-xs text-text-muted">Thammasat Faculty</span>
              </div>
            )}
          </div>
        ) : (
          <div 
            className={`flex items-center gap-3 cursor-pointer p-2 rounded-[14px] hover:bg-background transition-smooth ${isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''}`}
            onClick={() => setIsLoggedIn(true)}
            title="Click to login"
          >
            <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center shrink-0">
              <User size={20} className="text-text-muted" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap text-left">
                <span className="font-bold text-sm text-text">Guest</span>
                <span className="text-xs text-primary font-medium hover:underline">Click to login</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
