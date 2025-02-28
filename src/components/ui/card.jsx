import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};