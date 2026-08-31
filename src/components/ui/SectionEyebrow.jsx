import React from 'react';
import { cn } from '../../lib/cn';

export function SectionEyebrow({
  children,
  icon: Icon,
  className,
  ...props
}) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 mb-3 select-none', className)} {...props}>
      {Icon && (
        <div className="bg-orange-100 text-[#E2673F] rounded-full p-1.5 shadow-2xs shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      <span className="text-xs font-bold tracking-widest text-[#E2673F] uppercase font-sans">
        {children}
      </span>
    </div>
  );
}
