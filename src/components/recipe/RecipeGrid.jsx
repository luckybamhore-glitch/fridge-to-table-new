import React from 'react';
import { motion } from 'framer-motion';
import { RecipeCard } from './RecipeCard';
import { RecipeCardSkeleton } from '../ui/Skeleton';
import { Utensils, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function RecipeGrid({ recipes = [], isLoading = false, onRetry }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <RecipeCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-[#FDFBF8] rounded-3xl hairline-border border-[#E7DCD1] max-w-xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center mx-auto">
          <Utensils className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-serif text-[#2B2622]">No matching recipes found</h3>
        <p className="text-sm text-[#6B6259]">
          Try tweaking your ingredient list or relaxing diet filters to see more delicious options.
        </p>
        {onRetry && (
          <Button variant="primary" icon={RefreshCw} onClick={onRetry} className="mt-2">
            Reset Filters & Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.map((recipe, index) => (
        <RecipeCard key={recipe.id} recipe={recipe} index={index} />
      ))}
    </motion.div>
  );
}
