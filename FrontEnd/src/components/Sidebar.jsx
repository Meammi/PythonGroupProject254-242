import React, { useState } from 'react';
import { User, Landmark } from 'lucide-react';
import { navigationItems } from '../data/navigation';
import TULongLogo from './TULongLogo';

/**
 * Sidebar — Minimalist Map-First Navigation
 *
 * Simplified sidebar with:
 *   - TU Logo and branding at top
 *   - Single "Campus Map" navigation item
 *   - Guest account section at bottom
 *   - Responsive design with hover states
 *   - Maximizes screen real estate for map view
 */
const Sidebar = ({ activePage, setActivePage, isHovered, setIsHovered }) => {
  const isCollapsed = !isHovered;

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-screen bg-surface border-r border-border transition-smooth z-40 flex flex-col shadow-sm ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      
      {/* Top Logo */}
      <div className={`flex items-center justify-center border-b border-border transition-all duration-300 ${isCollapsed ? 'h-20 p-5' : 'h-52 p-2'}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center shrink-0 shadow-sm transition-smooth">
            <Landmark className="text-surface" size={20} />
          </div>
        ) : (
          <div className="flex flex-col items-center overflow-hidden whitespace-nowrap">
            <TULongLogo />
          </div>
        )}
      </div>

      {/* Navigation — Single Map Item */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = activePage === item.id;
          const IconComponent = item.icon;
          
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
                 <IconComponent
                   size={22} 
                   className={`transition-smooth
                     ${!isCollapsed && isActive ? 'text-primary' : ''} 
                     ${isCollapsed && isActive ? 'text-surface' : ''}
                   `} 
                 />
              </div>
              {!isCollapsed && <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Account Section (Guest) */}
      <div className="p-4 border-t border-border mt-auto">
        <div 
          className={`flex items-center gap-3 cursor-pointer p-2 rounded-[16px] hover:bg-background transition-smooth ${isCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''}`}
          title="Guest Mode"
        >
          <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center shrink-0">
            <User size={20} className="text-text-muted" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap text-left">
              <span className="font-bold text-sm text-text">Guest</span>
              <span className="text-xs text-text-muted font-medium">not logged in yet?</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
