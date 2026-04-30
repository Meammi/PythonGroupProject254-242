import React from 'react';
import tuLongImg from '../assets/images/TU_Long.png';

const TULongLogo = ({ className = '' }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img 
        src={tuLongImg} 
        alt="TU LONG" 
        className="h-48 object-contain" 
      />
    </div>
  );
};

export default TULongLogo;
