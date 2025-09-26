// components/ui/DesignSystem.tsx - Reusable components using design tokens
import React, { forwardRef } from 'react';
import {
  COMPONENT_VARIANTS,
  ANIMATIONS,
  LAYOUT_PRESETS,
} from '../../theme/tokens';

// Enhanced Button component with variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof COMPONENT_VARIANTS.button;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${ANIMATIONS.transition.normal}
  `;

    return (
      <button
        ref={ref}
        className={`
        ${baseClasses}
        ${COMPONENT_VARIANTS.button[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {icon && !loading && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Enhanced Badge component
interface BadgeProps {
  variant?: keyof typeof COMPONENT_VARIANTS.badge;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full
        ${COMPONENT_VARIANTS.badge[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Enhanced Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof COMPONENT_VARIANTS.card;
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', children, className = '', ...props },
    ref
  ) => {
    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={`
        ${COMPONENT_VARIANTS.card[variant]}
        ${paddingClasses[padding]}
        ${className}
      `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Progress Bar component
interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'health' | 'morale' | 'default';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const getBarColor = () => {
    if (variant === 'health') {
      return percentage >= 70
        ? COMPONENT_VARIANTS.status.health.good
        : percentage >= 40
          ? COMPONENT_VARIANTS.status.health.warning
          : COMPONENT_VARIANTS.status.health.critical;
    }
    if (variant === 'morale') {
      return percentage >= 70
        ? COMPONENT_VARIANTS.status.morale.good
        : percentage >= 40
          ? COMPONENT_VARIANTS.status.morale.warning
          : COMPONENT_VARIANTS.status.morale.critical;
    }
    return 'bg-primary-500';
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-600">{label}</span>
          <span className="font-semibold text-neutral-900">
            {value}
            {max === 100 ? '%' : `/${max}`}
          </span>
        </div>
      )}
      <div
        className={`w-full bg-neutral-200 rounded-full ${sizeClasses[size]}`}
      >
        <div
          className={`${getBarColor()} ${sizeClasses[size]} rounded-full ${ANIMATIONS.transition.normal}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Status Indicator component
interface StatusIndicatorProps {
  status: 'good' | 'warning' | 'critical';
  label: string;
  value?: string | number;
  variant?: 'health' | 'morale' | 'lifespan';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  value,
  variant = 'health',
  className = '',
}) => {
  const getStatusColor = () => {
    if (variant === 'lifespan') {
      return COMPONENT_VARIANTS.status.lifespan[status];
    }
    return variant === 'health'
      ? COMPONENT_VARIANTS.status.health[status]
      : COMPONENT_VARIANTS.status.morale[status];
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-sm text-neutral-600">{label}</span>
      {value !== undefined && (
        <span
          className={`text-sm font-semibold ${variant === 'lifespan' ? getStatusColor() : 'text-neutral-900'}`}
        >
          {value}
        </span>
      )}
    </div>
  );
};

// Layout components using presets
export const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`${LAYOUT_PRESETS.container} ${className}`}>{children}</div>
);

export const FlexBetween: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`${LAYOUT_PRESETS.flexBetween} ${className}`}>{children}</div>
);

export const GridResponsive: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`${LAYOUT_PRESETS.gridResponsive} ${className}`}>
    {children}
  </div>
);

export const Stack: React.FC<{
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, direction = 'vertical', spacing = 'md', className = '' }) => {
  const spacingClasses = {
    vertical: {
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
    },
    horizontal: {
      sm: 'space-x-2',
      md: 'space-x-4',
      lg: 'space-x-6',
    },
  };

  const flexClass = direction === 'horizontal' ? 'flex' : '';

  return (
    <div
      className={`${flexClass} ${spacingClasses[direction][spacing]} ${className}`}
    >
      {children}
    </div>
  );
};
