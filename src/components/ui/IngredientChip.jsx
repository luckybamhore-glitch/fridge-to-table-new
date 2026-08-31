import React from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Check } from 'lucide-react';
import { cn } from '../../lib/cn';

export function IngredientChip({
  name,
  onRemove,
  onAdd,
  isSelected = false,
  isDetected = false,
  isDuplicate = false,
  className,
  ...props
}) {
  const chipVariants = {
    initial: { scale: 0.8, opacity: 0, y: 5 },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      x: isDuplicate ? [0, -6, 6, -4, 4, 0] : 0,
    },
    exit: { scale: 0.7, opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <motion.span
      variants={chipVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors select-none shadow-xs hairline-border',
        isDetected
          ? 'bg-amber-100/70 text-amber-900 border-amber-300/70'
          : isSelected
          ? 'bg-[#E2673F] text-white border-[#CC5A35]'
          : 'bg-[#FDFBF8] text-[#2B2622] border-[#E7DCD1] hover:border-[#D8C7B7] hover:bg-orange-50/50',
        isDuplicate && 'border-rose-400 bg-rose-50 text-rose-800',
        className
      )}
      {...props}
    >
      <span>{name}</span>

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(name);
          }}
          className="p-0.5 rounded-full hover:bg-black/10 transition-colors text-current shrink-0"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {onAdd && !isSelected && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(name);
          }}
          className="p-0.5 rounded-full hover:bg-orange-200/50 transition-colors text-orange-700 shrink-0"
          aria-label={`Add ${name}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}

      {isSelected && !onRemove && (
        <Check className="w-3.5 h-3.5 text-white shrink-0" />
      )}
    </motion.span>
  );
}
