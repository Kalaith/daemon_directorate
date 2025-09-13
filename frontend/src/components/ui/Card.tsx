// components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-900 rounded-lg border border-gray-700 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
