import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../lib/cn';

export function IngredientInput({ className }) {
  const [inputValue, setInputValue] = useState('');
  const { addIngredient } = usePantry();
  const { addToast } = useToast();

  const handleAdd = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const result = addIngredient(inputValue);
    if (result === 'duplicate') {
      addToast(`"${inputValue.trim()}" is already on your board`, 'info');
    } else if (result === true) {
      addToast(`Added "${inputValue.trim()}" to cutting board`, 'success');
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleAdd} className={cn('relative flex items-center w-full', className)}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type an ingredient (e.g. Avocado, Spinach, Eggs)..."
        className="w-full pl-5 pr-28 py-3.5 rounded-full bg-[#FDFBF8] text-[#2B2622] placeholder-[#8E847A] text-sm sm:text-base hairline-border border-[#E7DCD1] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E2673F] focus:border-transparent transition-all"
      />
      <button
        type="submit"
        disabled={!inputValue.trim()}
        className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-full bg-[#E2673F] text-white text-xs sm:text-sm font-medium hover:bg-[#CC5A35] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 shadow-xs cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add</span>
      </button>
    </form>
  );
}
