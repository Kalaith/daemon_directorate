// components/ui/Card.tsx
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-daemon-panel rounded-lg border border-daemon-secondary p-6 shadow-lg transition-all duration-200 hover:border-daemon-primary hover:shadow-infernal ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
