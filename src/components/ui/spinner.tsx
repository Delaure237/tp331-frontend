// src/components/ui/spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-4',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'border-blue-500' }) => {
  const finalSizeClass = sizeClasses[size];
  const finalColor = color;

  return (
    <div
      className={`
        ${finalSizeClass}
        ${finalColor}
        rounded-full
        border-t-transparent
        animate-spin
      `}
    />
  );
};