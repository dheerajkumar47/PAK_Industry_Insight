import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg transition-all duration-200 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#10B981] text-white hover:bg-[#059669]',
    secondary: 'bg-[#0F172A] text-white hover:bg-[#1E293B]',
    outline: 'bg-transparent text-[#0F172A] border-2 border-[#E5E7EB] hover:border-[#10B981]'
  };
  
  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
