'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  noPadding?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  footer,
  headerActions,
  noPadding = false,
  bordered = true,
  shadow = 'md',
}) => {
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  // Border classes
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  // Padding classes
  const paddingClasses = noPadding ? '' : 'p-4';
  
  // Base classes
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  return (
    <div className={`${baseClasses} ${borderClasses} ${shadowClasses[shadow]} ${className}`}>
      {(title || headerActions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      
      <div className={paddingClasses}>{children}</div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;