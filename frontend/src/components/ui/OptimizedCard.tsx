// components/ui/OptimizedCard.tsx - Performance optimized Card component
import React, { memo } from 'react';

interface OptimizedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const OptimizedCard: React.FC<OptimizedCardProps> = memo(({
  children,
  className = '',
  isLoading = false,
  ...props
}) => {
  return (
    <div
      className={`bg-surface rounded-lg border border-card-border p-6 shadow-sm transition-shadow hover:shadow-md ${
        isLoading ? 'animate-pulse' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

export default OptimizedCard;