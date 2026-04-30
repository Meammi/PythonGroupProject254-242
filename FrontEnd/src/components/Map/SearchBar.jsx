import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ isSidebarExpanded }) => {
  // Collapsed: left-[100px] (w-20 + padding), Expanded: left-[276px] (w-64 + padding)
  return (
    <div 
      className={`absolute top-5 z-20 transition-smooth
        ${isSidebarExpanded ? 'left-[276px]' : 'left-[100px]'}
      `}
    >
      <div className="flex items-center bg-surface/80 backdrop-blur-md rounded-xl border border-border shadow-sm px-4 py-3 w-80">
        <Search className="text-text-muted mr-3" size={20} />
        <input 
          type="text" 
          placeholder="Search campus..." 
          className="bg-transparent border-none outline-none w-full text-text placeholder-text-muted font-sans"
        />
      </div>
    </div>
  );
};

export default SearchBar;
