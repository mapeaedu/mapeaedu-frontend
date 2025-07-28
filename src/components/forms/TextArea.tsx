'use client';

import React, { TextareaHTMLAttributes, forwardRef, useId } from 'react';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      rows = 4,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    // Generate a stable unique ID
    const uniqueId = useId();
    const textareaId = id || `textarea-${uniqueId}`;
    
    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';
    
    // Error classes
    const errorClasses = error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    
    return (
      <div className={`${widthClasses} ${className}`}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`appearance-none block ${widthClasses} px-4 py-2 rounded-md shadow-sm ${errorClasses} placeholder-gray-400 focus:outline-none text-black`}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...rest}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${textareaId}-error`}>
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500" id={`${textareaId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;