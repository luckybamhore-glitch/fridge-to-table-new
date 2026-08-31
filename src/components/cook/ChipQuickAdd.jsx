import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QUICK_ADD_CATEGORIES, usePantry } from '../../context/PantryContext';
import { IngredientChip } from '../ui/IngredientChip';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Layers } from 'lucide-react';
import { cn } from '../../lib/cn';

export function ChipQuickAdd({ className }) {
  const [activeCategory, setActiveCategory] = useState(QUICK_ADD_CATEGORIES[0].name);
  const { ingredients, addIngredient, removeIngredient } = usePantry();
  const { addToast } = useToast();

  const activeCategoryData = QUICK_ADD_CATEGORIES.find((c) => c.name === activeCategory);

  const handleChipClick = (item) => {
    const isSelected = ingredients.some((i) => i.toLowerCase() === item.toLowerCase());
    if (isSelected) {
      removeIngredient(item);
      addToast(`Removed "${item}" from board`, 'info');
    } else {
      const result = addIngredient(item);
      if (result === true) {
        addToast(`Added "${item}" to board`, 'success');
      }
    }
  };

  return (
    <div className={cn('space-y-4 bg-[#FDFBF8] p-6 rounded-3xl hairline-border border-[#E7DCD1]', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B6259]">
          <Sparkles className="w-3.5 h-3.5 text-[#E2673F]" />
          <span>OR TAP TO ADD POPULAR ITEMS</span>
        </div>
      </div>

      {/* Category Pills Header */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_ADD_CATEGORIES.map((cat) => {
          const isActive = cat.name === activeCategory;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveCategory(cat.name)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none',
                isActive
                  ? 'bg-[#2B2622] text-[#FDFBF8] shadow-xs'
                  : 'bg-cream-100 text-[#6B6259] hover:bg-cream-200 hover:text-[#2B2622]'
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Chip Grid */}
      <motion.div layout className="flex flex-wrap gap-2.5 pt-1">
        <AnimatePresence mode="popLayout">
          {activeCategoryData?.items.map((item) => {
            const isSelected = ingredients.some(
              (i) => i.toLowerCase() === item.toLowerCase()
            );
            return (
              <IngredientChip
                key={item}
                name={item}
                isSelected={isSelected}
                onClick={() => handleChipClick(item)}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
