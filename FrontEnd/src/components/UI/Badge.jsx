import React from 'react';

export const Badge = ({ children, status = 'default' }) => {
  const statusColors = {
    default: 'bg-background text-text-muted',
    active: 'bg-primary/10 text-primary',
    warning: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {children}
    </span>
  );
};
