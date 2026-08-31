import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import { Flame, Sparkles } from 'lucide-react';

export function Badge({
  children,
  variant = 'default',
  className,
  icon: Icon,
  ...props
}) {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full tracking-wide uppercase select-none transition-all';

  const variants = {
    default: 'bg-orange-100/70 text-[#E2673F] border border-orange-200/50',
    match: 'bg-[#2B2622] text-[#FDFBF8] border border-amber-900/40 shadow-sm',
    diet: 'bg-[#FDFBF8] text-[#6B6259] border border-[#E7DCD1]',
    accent: 'bg-[#E2673F] text-white shadow-sm',
    soft: 'bg-cream-100 text-[#6B6259] border border-cream-200',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

/**
 * Match % badge with an animated count-up calculation
 */
export function MatchBadge({ percent = 95, className }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = percent / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= percent) {
        setDisplayValue(percent);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [percent]);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-[#2B2622] text-amber-300 border border-amber-500/30 shadow-md backdrop-blur-md',
        className
      )}
    >
      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      <span>{displayValue}% Match</span>
    </span>
  );
}
