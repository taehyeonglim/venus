
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "px-6 py-3.5 rounded-full font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "venus-btn text-[#0a1a1a]",
    secondary: "bg-[#FFB7C5]/20 hover:bg-[#FFB7C5]/30 text-[#FFB7C5] backdrop-blur-md border border-[#FFB7C5]/20",
    outline: "venus-btn-outline text-[#9FE2BF]",
    ghost: "bg-transparent hover:bg-white/5 text-[#9FE2BF]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
