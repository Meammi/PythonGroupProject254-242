import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-surface rounded shadow-sm border border-border p-6 ${className}`}>
    {children}
  </div>
);
