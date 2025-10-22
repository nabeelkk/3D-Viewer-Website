import React from 'react';

const LoadingSpinner = ({size = 'md', text = 'Loading...',className = ''}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          border-4 border-primary-200 border-t-primary-600 
          rounded-full animate-spin
        `}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const InlineLoader = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  </div>
);

export default LoadingSpinner;