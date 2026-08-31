import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChefHat,
  Sparkles,
  CheckSquare,
  Square,
  BookOpen,
} from 'lucide-react';
import { getRecipeById } from '../api/recipeApi';
import { MatchBadge, Badge } from '../components/ui/Badge';
import { YouTubeEmbedLite } from '../components/recipe/YouTubeEmbedLite';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { usePantry } from '../context/PantryContext';
import { useToast } from '../context/ToastContext';

export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  const { savedRecipeIds, toggleSavedRecipe } = usePantry();
  const { addToast } = useToast();

  useEffect(() => {
    async function loadRecipe() {
      setIsLoading(true);
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error(err);
        addToast('Recipe not found', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-serif text-[#2B2622]">Recipe Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/cook/results')}>
          Back to Recipes
        </Button>
      </div>
    );
  }

  const isSaved = savedRecipeIds.includes(recipe.id);

  const toggleIngredientCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleStepCheck = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Recipe link copied to clipboard!', 'success');
    }
  };

  const handleFavoriteClick = () => {
    toggleSavedRecipe(recipe.id);
    addToast(
      isSaved ? `Removed "${recipe.title}" from favorites` : `Saved "${recipe.title}" to favorites!`,
      isSaved ? 'info' : 'success'
    );
  };

  const haveIngredients = recipe.ingredients.filter((ing) => ing.have);
  const needIngredients = recipe.ingredients.filter((ing) => !ing.have);

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10"
    >
      {/* Top Bar Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/cook/results')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B6259] hover:text-[#2B2622] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </button>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={Share2} onClick={handleShare}>
            Share
          </Button>
          <Button
            variant={isSaved ? 'primary' : 'secondary'}
            size="sm"
            icon={Heart}
            onClick={handleFavoriteClick}
          >
            {isSaved ? 'Saved' : 'Favorite'}
          </Button>
        </div>
      </div>

      {/* Hero Cover Image Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl hairline-border border-[#E7DCD1] aspect-[16/9] sm:aspect-[21/9] bg-orange-100">
        <img
          src={recipe.coverImageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Floating Match Badge Top Left */}
        <div className="absolute top-6 left-6">
          <MatchBadge percent={recipe.matchPercent} />
        </div>

        {/* Overlay Title & Meta */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap gap-2">
            {recipe.diet?.map((d) => (
              <span
                key={d}
                className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider"
              >
                {d}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white drop-shadow-md">
            {recipe.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-white/90 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> {recipe.timeMinutes} mins prep & cook
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" /> {recipe.servings} servings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-amber-400" /> {recipe.difficulty} difficulty
            </span>
          </div>
        </div>
      </div>

      {/* Subtitle / Description */}
      {recipe.subtitle && (
        <p className="text-base sm:text-lg text-[#6B6259] leading-relaxed italic font-serif">
          "{recipe.subtitle}"
        </p>
      )}

      {/* Main Content Layout: Left Ingredients (4 cols) & Right Steps (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ingredients Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#FDFBF8] hairline-border border-[#E7DCD1] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DCD1]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#E2673F]" />
                <h3 className="text-xl font-serif text-[#2B2622]">Ingredients</h3>
              </div>
              <span className="text-xs text-[#8E847A]">
                {recipe.ingredients.length} total
              </span>
            </div>

            {/* IN FRIDGE (HAVE) */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> IN YOUR FRIDGE ({haveIngredients.length})
              </span>
              <ul className="space-y-2">
                {haveIngredients.map((ing, idx) => {
                  const globalIdx = recipe.ingredients.indexOf(ing);
                  const isChecked = checkedIngredients[globalIdx];
                  return (
                    <li
                      key={ing.name}
                      onClick={() => toggleIngredientCheck(globalIdx)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 cursor-pointer select-none transition-colors"
                    >
                      <button type="button" className="text-emerald-600 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-[#E7DCD1]" />
                        )}
                      </button>
                      <span
                        className={`text-sm font-medium text-[#2B2622] ${
                          isChecked ? 'line-through opacity-50' : ''
                        }`}
                      >
                        {ing.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* NEED (MISSING STAPLES) */}
            {needIngredients.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E7DCD1]">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> YOU MAY NEED ({needIngredients.length})
                </span>
                <ul className="space-y-2">
                  {needIngredients.map((ing) => {
                    const globalIdx = recipe.ingredients.indexOf(ing);
                    const isChecked = checkedIngredients[globalIdx];
                    return (
                      <li
                        key={ing.name}
                        onClick={() => toggleIngredientCheck(globalIdx)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 cursor-pointer select-none transition-colors"
                      >
                        <button type="button" className="text-amber-600 shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-amber-600" />
                          ) : (
                            <Square className="w-5 h-5 text-[#E7DCD1]" />
                          )}
                        </button>
                        <span
                          className={`text-sm font-medium text-[#6B6259] ${
                            isChecked ? 'line-through opacity-50' : ''
                          }`}
                        >
                          {ing.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Chef Tip Card */}
          {recipe.tips && (
            <div className="p-6 rounded-3xl bg-orange-100/60 hairline-border border-orange-200/80 space-y-2 text-[#2B2622]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E2673F]">
                💡 Chef's Secret Tip
              </span>
              <p className="text-xs sm:text-sm leading-relaxed">{recipe.tips}</p>
            </div>
          )}
        </div>

        {/* Right Column: Step-by-Step Instructions & YouTube Embed (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* YouTube Lite Embed */}
          {recipe.youtubeUrl && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#E2673F]">
                VIDEO TUTORIAL
              </h3>
              <YouTubeEmbedLite
                youtubeUrl={recipe.youtubeUrl}
                title={recipe.title}
              />
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FDFBF8] hairline-border border-[#E7DCD1] shadow-xs space-y-6">
            <div className="pb-3 border-b border-[#E7DCD1] flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#2B2622]">Step-by-Step Instructions</h3>
              <span className="text-xs text-[#8E847A]">
                {Object.keys(completedSteps).filter((k) => completedSteps[k]).length} of{' '}
                {recipe.steps.length} completed
              </span>
            </div>

            <div className="space-y-6">
              {recipe.steps.map((stepText, idx) => {
                const isDone = completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStepCheck(idx)}
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer select-none ${
                      isDone
                        ? 'bg-emerald-50/60 hairline-border border-emerald-200/60 opacity-60'
                        : 'hover:bg-orange-50/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-serif ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-100 text-[#E2673F]'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="space-y-1 pt-1">
                      <p
                        className={`text-sm sm:text-base text-[#2B2622] leading-relaxed ${
                          isDone ? 'line-through text-[#6B6259]' : ''
                        }`}
                      >
                        {stepText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
