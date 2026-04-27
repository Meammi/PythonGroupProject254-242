import React from 'react';
import { APP_BRANDING } from '../data/constants';

const TULongLogo = ({ className = '' }) => {
  const { tu, dot, long } = APP_BRANDING;

  return (
    <div className={`flex items-center font-bold tracking-tight select-none ${className}`}>
      <span className={tu.colorClass}>{tu.text}</span>
      <span className={`${dot.colorClass} mx-1.5`}>{dot.text}</span>
      <span className={long.colorClass}>{long.text}</span>
    </div>
  );
};

export default TULongLogo;
