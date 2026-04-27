import React from 'react';
import { Menu, Home, Map as MapIcon, Users, Settings, X } from 'lucide-react';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: MapIcon, label: 'Discovery Map' },
    { icon: Users, label: 'Culture Insights' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-surface border-r border-border transition-smooth z-20 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        {!isCollapsed && <span className="font-bold text-lg text-primary whitespace-nowrap">Campus Insight</span>}
        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-background text-text-muted transition-smooth">
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-2 px-3 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-background text-text transition-smooth hover:text-primary group"
          >
            <item.icon size={24} className="text-text-muted group-hover:text-primary" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
