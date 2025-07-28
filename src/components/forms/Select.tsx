'use client';

import React, { SelectHTMLAttributes, forwardRef, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      fullWidth = false,
      options,
      placeholder,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    // Generate a stable unique ID
    const uniqueId = useId();
    const selectId = id || `select-${uniqueId}`;
    
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };
    
    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';
    
    // Error classes
    const errorClasses = error
      ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    
    return (
      <div className={`${widthClasses} ${className}`}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`appearance-none block ${widthClasses} ${sizeClasses[size]} rounded-md shadow-sm ${errorClasses} bg-white focus:outline-none pr-10`}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${selectId}-error`}>
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500" id={`${selectId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;