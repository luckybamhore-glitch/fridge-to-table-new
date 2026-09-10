import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, RefreshCw, Utensils, Clock, Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function RecipeGeneratedStateBanner({
  recipeCount = 0,
  ingredients = [],
  diet = 'All',
  generatedAt = null,
  onRegenerate,
  onEditIngredients,
}) {
  const timeFormatted = useMemo(() => {
    return generatedAt
      ? new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Just now';
  }, [generatedAt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-900/10 via-amber-950/5 to-orange-900/10 hairline-border border-emerald-500/30 shadow-md space-y-4 text-[#2B2622]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Status Title & Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> Recipe Generated
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E2673F]" /> AI Matched
            </span>
            <span className="text-xs text-[#8E847A] flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeFormatted}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif text-[#2B2622]">
            Found <span className="text-emerald-700 font-medium">{recipeCount} delicious recipes</span> tailored for your pantry
          </h2>

          {/* Active Ingredients & Diet Summary */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-[#6B6259] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#E2673F]" /> Based on:
            </span>
            {ingredients.slice(0, 5).map((ing) => (
              <Badge key={ing} variant="soft" className="text-xs py-0.5 px-2.5 bg-white hairline-border border-[#E7DCD1]">
                {ing}
              </Badge>
            ))}
            {ingredients.length > 5 && (
              <Badge variant="soft" className="text-xs py-0.5 px-2.5 bg-white">
                +{ingredients.length - 5} more
              </Badge>
            )}
            {diet && diet !== 'All' && (
              <Badge variant="emerald" className="text-xs py-0.5 px-2.5">
                {diet} Diet
              </Badge>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onEditIngredients && (
            <Button variant="secondary" size="sm" icon={Utensils} onClick={onEditIngredients}>
              Edit Ingredients
            </Button>
          )}
          {onRegenerate && (
            <Button variant="primary" size="sm" icon={RefreshCw} onClick={onRegenerate}>
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
