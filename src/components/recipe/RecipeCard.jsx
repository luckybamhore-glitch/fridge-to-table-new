import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Heart, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { MatchBadge, Badge } from '../ui/Badge';
import { usePantry } from '../../context/PantryContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../lib/cn';
import { getRecipeCoverImage } from '../../lib/recipeImageHelper';

export function RecipeCard({ recipe, index = 0 }) {
  const navigate = useNavigate();
  const { savedRecipeIds, toggleSavedRecipe } = usePantry();
  const { addToast } = useToast();

  // The backend looks recipes up by `recipeId` (see getRecipeByIdController),
  // not the Mongo `_id` / Mongoose's default `id` virtual. Gemini-generated
  // recipes never have an `id` field at all — only `recipeId`. Standardizing
  // on `recipeId` here (with `id` as a legacy fallback) keeps navigation,
  // favoriting and the React key correct for every recipe source.
  const recipeIdentifier = recipe?.recipeId || recipe?.id;

  const isSaved = savedRecipeIds.includes(recipeIdentifier);

  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const haveCount = ingredients.filter((i) => i?.have).length;
  const totalCount = ingredients.length;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleSavedRecipe(recipeIdentifier, recipe);
    addToast(
      isSaved ? `Removed "${recipe?.title || 'recipe'}" from saved recipes` : `Saved "${recipe?.title || 'recipe'}" to favorites!`,
      isSaved ? 'info' : 'success'
    );
  };

  const handleCardClick = () => {
    if (!recipeIdentifier) {
      addToast('This recipe is missing an ID and cannot be opened.', 'error');
      return;
    }
    // Pass the already-fetched recipe object along via router state.
    // AI-generated recipes are never persisted to the database, so
    // RecipeDetailPage re-fetching by ID would always 404 for them —
    // this lets it use the data we already have instead, falling back
    // to a real fetch only for direct/bookmarked links.
    navigate(`/recipe/${recipeIdentifier}`, { state: { recipe } });
  };

  return (
    <motion.article
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col rounded-3xl bg-[#FDFBF8] overflow-hidden hairline-border border-[#E7DCD1] shadow-sm hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-100">
        <img
          src={getRecipeCoverImage(recipe, index)}
          alt={recipe?.title || 'Recipe'}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            const fallback = getRecipeCoverImage(recipe, index + 1);
            if (e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
            }
          }}
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <MatchBadge percent={recipe?.matchPercent || 0} />
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={cn(
              'pointer-events-auto p-2.5 rounded-full backdrop-blur-md transition-all shadow-md',
              isSaved
                ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                : 'bg-black/30 text-white hover:bg-black/50 hover:scale-110'
            )}
            aria-label="Save recipe"
          >
            <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
          </button>
        </div>

        {/* Bottom image gradient shadow */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Diet tags */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {(Array.isArray(recipe?.diet) ? recipe.diet : []).map((d) => (
              <Badge key={d} variant="diet" className="text-[10px] py-0.5 px-2.5">
                {d}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-serif text-[#2B2622] group-hover:text-[#E2673F] transition-colors leading-snug line-clamp-2">
            {recipe?.title || 'Untitled recipe'}
          </h3>

          {/* Subtitle */}
          {recipe?.subtitle && (
            <p className="text-xs text-[#6B6259] mt-1.5 line-clamp-2 leading-relaxed">
              {recipe.subtitle}
            </p>
          )}
        </div>

        {/* Meta Row & Ingredient overlap */}
        <div className="pt-3 border-t border-[#E7DCD1] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6B6259]">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#E2673F]" />
                {recipe?.timeMinutes ?? '—'} mins
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-[#E2673F]" />
                {recipe?.servings ?? '—'} servings
              </span>
            </div>
            <span className="text-[#E2673F] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
              View <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Ingredient Overlap Indicator */}
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-orange-50/60 hairline-border border-orange-200/50">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#2B2622]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {haveCount} of {totalCount} ingredients in fridge
            </span>
            {totalCount - haveCount > 0 && (
              <span className="text-[11px] font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                +{totalCount - haveCount} missing
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
