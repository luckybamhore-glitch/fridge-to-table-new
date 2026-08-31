import React from 'react';
import { cn } from '../../lib/cn';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-amber-900/5 bg-gradient-to-r from-orange-100/50 via-cream-200/40 to-orange-100/50',
        className
      )}
      {...props}
    />
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="rounded-3xl bg-[#FDFBF8] p-4 hairline-border border-[#E7DCD1] shadow-xs flex flex-col gap-4">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="flex justify-between items-center gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-7 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-md" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}
