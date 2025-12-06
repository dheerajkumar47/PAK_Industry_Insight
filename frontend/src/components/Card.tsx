import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg border border-[#E5E7EB] p-6 ${
        hover ? 'hover:shadow-lg hover:border-[#10B981] transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
