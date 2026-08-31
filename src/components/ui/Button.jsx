import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const variants = {
    primary: 'bg-[#E2673F] text-white hover:bg-[#CC5A35] shadow-sm shadow-orange-900/10 active:bg-[#B84D2B]',
    secondary: 'bg-[#FDFBF8] text-[#2B2622] hairline-border border-[#E7DCD1] hover:border-[#D8C7B7] hover:bg-orange-50/50',
    outline: 'bg-transparent text-[#E2673F] border border-[#E2673F] hover:bg-orange-50',
    ghost: 'bg-transparent text-[#2B2622] hover:bg-orange-100/40 text-[#6B6259] hover:text-[#2B2622]',
    dark: 'bg-[#2B2622] text-white hover:bg-[#1A1715]',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && <Icon className={cn('shrink-0', size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />}
      {children}
    </motion.button>
  );
}
