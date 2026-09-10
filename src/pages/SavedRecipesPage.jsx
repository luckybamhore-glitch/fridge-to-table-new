import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  History,
  Sparkles,
  Search,
  Trash2,
  Clock,
  ArrowRight,
  RotateCcw,
  Utensils,
  BookOpen,
} from 'lucide-react';
import { SectionEyebrow } from '../components/ui/SectionEyebrow';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { usePantry } from '../context/PantryContext';
import { useToast } from '../context/ToastContext';

export function SavedRecipesPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    savedRecipeIds,
    savedRecipesMap,
    recipeHistory,
    deleteHistorySession,
    clearRecipeHistory,
    setIngredients,
    setDietFilter,
    setActiveResults,
    setGenerationState,
    setGenerationMeta,
  } = usePantry();

  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'history'
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all saved recipe objects
  const savedRecipesList = useMemo(() => {
    return savedRecipeIds
      .map((id) => savedRecipesMap[id])
      .filter(Boolean);
  }, [savedRecipeIds, savedRecipesMap]);

  // Filter saved recipes by title or ingredient search
  const filteredSavedRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return savedRecipesList;
    return savedRecipesList.filter((r) => {
      const titleMatch = (r.title || '').toLowerCase().includes(q);
      const ingredientMatch = Array.isArray(r.ingredients) &&
        r.ingredients.some((i) => (i?.name || '').toLowerCase().includes(q));
      return titleMatch || ingredientMatch;
    });
  }, [savedRecipesList, searchQuery]);

  // Restore a past generation session to the active results page
  const handleRestoreSession = (session) => {
    if (!session || !Array.isArray(session.recipes)) return;

    if (Array.isArray(session.ingredients) && session.ingredients.length > 0) {
      setIngredients(session.ingredients);
    }
    if (session.diet) {
      setDietFilter(session.diet);
    }

    setActiveResults(session.recipes);
    setGenerationState('generated');
    setGenerationMeta({
      count: session.recipes.length,
      diet: session.diet || 'All',
      ingredients: session.ingredients || [],
      generatedAt: session.timestamp,
    });

    addToast(`Restored menu from ${new Date(session.timestamp).toLocaleDateString()}`, 'success');
    navigate('/cook/results');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E7DCD1]">
        <div className="space-y-2">
          <SectionEyebrow icon={Heart}>MY KITCHEN COLLECTION</SectionEyebrow>

          <h1 className="text-3xl sm:text-4xl font-serif text-[#2B2622] font-normal">
            Saved Recipes <span className="serif-italic text-[#E2673F]">& History</span>
          </h1>

          <p className="text-sm text-[#6B6259] max-w-xl">
            Access your favorite bookmarked meals and revisit previous AI culinary menus anytime.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex p-1.5 rounded-full bg-[#FDFBF8] hairline-border border-[#E7DCD1] shadow-xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-[#E2673F] text-white shadow-sm'
                : 'text-[#6B6259] hover:text-[#2B2622]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            Saved ({savedRecipesList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-[#E2673F] text-white shadow-sm'
                : 'text-[#6B6259] hover:text-[#2B2622]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History ({recipeHistory.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SAVED RECIPES */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {savedRecipesList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FDFBF8] p-4 rounded-2xl hairline-border border-[#E7DCD1]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#8E847A] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved recipes..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full bg-white text-[#2B2622] hairline-border border-[#E7DCD1] focus:outline-none focus:ring-2 focus:ring-[#E2673F]"
                />
              </div>

              <span className="text-xs text-[#8E847A] font-medium">
                Showing {filteredSavedRecipes.length} of {savedRecipesList.length} saved recipes
              </span>
            </div>
          )}

          {savedRecipesList.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[#FDFBF8] rounded-3xl hairline-border border-[#E7DCD1] space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-[#2B2622]">No saved recipes yet</h2>
              <p className="text-xs sm:text-sm text-[#6B6259]">
                Click the heart icon on any generated recipe card to save it to your personal collection.
              </p>
              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                onClick={() => navigate('/cook')}
              >
                Generate new recipes
              </Button>
            </div>
          ) : (
            <RecipeGrid
              recipes={filteredSavedRecipes}
              isLoading={false}
              onRetry={() => {}}
            />
          )}
        </div>
      )}

      {/* TAB 2: GENERATION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {recipeHistory.length > 0 && (
            <div className="flex items-center justify-between bg-[#FDFBF8] p-4 rounded-2xl hairline-border border-[#E7DCD1]">
              <span className="text-xs text-[#6B6259] font-medium">
                {recipeHistory.length} past generation session{recipeHistory.length > 1 ? 's' : ''} saved locally
              </span>
              <button
                type="button"
                onClick={() => {
                  clearRecipeHistory();
                  addToast('Cleared recipe history.', 'info');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All History
              </button>
            </div>
          )}

          {recipeHistory.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[#FDFBF8] rounded-3xl hairline-border border-[#E7DCD1] space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center mx-auto shadow-sm">
                <History className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-[#2B2622]">No recipe history found</h2>
              <p className="text-xs sm:text-sm text-[#6B6259]">
                Whenever you generate custom recipes from your fridge ingredients, your menus will automatically be saved here.
              </p>
              <Button
                variant="primary"
                size="md"
                icon={Utensils}
                onClick={() => navigate('/cook')}
              >
                Start cooking
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {recipeHistory.map((session) => (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#FDFBF8] p-6 rounded-3xl hairline-border border-[#E7DCD1] shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DCD1] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center font-bold text-xs">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#2B2622]">
                              {session.recipes?.length || 0} Custom Recipes Generated
                            </span>
                            {session.diet && session.diet !== 'All' && (
                              <Badge variant="diet" className="text-[10px] py-0.5 px-2">
                                {session.diet}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-[#8E847A] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(session.timestamp).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={RotateCcw}
                          onClick={() => handleRestoreSession(session)}
                        >
                          Restore Menu
                        </Button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteHistorySession(session.id);
                            addToast('Removed session from history', 'info');
                          }}
                          className="p-2 rounded-full text-[#8E847A] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Ingredients Used Chips */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6259]">
                        Ingredients Board ({session.ingredients?.length || 0}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(session.ingredients || []).map((ing) => (
                          <Badge key={ing} variant="soft" className="text-xs py-0.5 px-2.5">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recipes List Preview */}
                    <div className="pt-2 border-t border-[#E7DCD1]/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(session.recipes || []).map((r, idx) => (
                        <div
                          key={r.recipeId || r.id || idx}
                          onClick={() => navigate(`/recipe/${r.recipeId || r.id}`, { state: { recipe: r } })}
                          className="group cursor-pointer p-3 rounded-2xl bg-white hairline-border border-[#E7DCD1] hover:border-[#E2673F] transition-all flex items-center justify-between"
                        >
                          <div className="space-y-0.5 truncate pr-2">
                            <h4 className="text-xs font-semibold text-[#2B2622] group-hover:text-[#E2673F] transition-colors truncate">
                              {r.title}
                            </h4>
                            <p className="text-[11px] text-[#8E847A] truncate">
                              {r.timeMinutes || 25} mins • {r.matchPercent || 80}% match
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#8E847A] group-hover:text-[#E2673F] group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
