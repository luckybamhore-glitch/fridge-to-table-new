import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal, ArrowLeft, RefreshCw, Search, Utensils } from 'lucide-react';
import { SectionEyebrow } from '../components/ui/SectionEyebrow';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { IngredientChip } from '../components/ui/IngredientChip';
import { DIET_OPTIONS, usePantry } from '../context/PantryContext';
import { generateRecipes } from '../api/recipeApi';
import { useToast } from '../context/ToastContext';

export function RecipeResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ingredients, dietFilter, setDietFilter, activeResults, setActiveResults } = usePantry();
  const { addToast } = useToast();

  // A photo scan navigates here with `scanIngredients` in router state —
  // just what was detected in that photo, not the whole pantry. When
  // present, it takes priority so a fresh scan's results reflect only
  // that photo instead of being diluted by everything else saved in the
  // pantry from past sessions. Any other entry point (editing the full
  // cutting board, refreshing, a diet filter change) has no router state
  // and falls back to the full pantry as before.
  const scanIngredients = location.state?.scanIngredients;
  const activeIngredients =
    Array.isArray(scanIngredients) && scanIngredients.length > 0
      ? scanIngredients
      : ingredients;

  const [recipes, setRecipes] = useState(activeResults || []);
  const [isLoading, setIsLoading] = useState(!activeResults);
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'time'
  const [searchQuery, setSearchQuery] = useState('');

  // Tracks which ingredients + diet the current `activeResults` cache was
  // generated for. If the pantry changes (e.g. a fresh photo scan) after
  // a previous visit already cached results, this lets us tell the cache
  // is stale and re-fetch — instead of silently showing old recipes for
  // a completely different set of ingredients.
  const lastFetchedSignatureRef = useRef(null);

  const buildSignature = (ingredientList, diet) =>
    `${diet}::${[...ingredientList].map((i) => i.toLowerCase()).sort().join('|')}`;

  const fetchResults = async (dietOverride) => {
    if (activeIngredients.length === 0) {
      navigate('/cook');
      return;
    }

    const dietToUse = dietOverride ?? dietFilter;

    setIsLoading(true);
    try {
      const response = await generateRecipes({
        ingredients: activeIngredients,
        diet: dietToUse,
      });

      setIsLoading(false);

      if (response && Array.isArray(response.recipes)) {
        lastFetchedSignatureRef.current = buildSignature(activeIngredients, dietToUse);
        setRecipes(response.recipes);
        setActiveResults(response.recipes);
      } else {
        setRecipes([]);
        setActiveResults([]);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      addToast('Error fetching recipes. Please try again.', 'error');
    }
  };

  useEffect(() => {
    const currentSignature = buildSignature(activeIngredients, dietFilter);
    const cacheIsFresh =
      activeResults && activeResults.length > 0 && lastFetchedSignatureRef.current === currentSignature;

    if (!cacheIsFresh) {
      fetchResults();
    }
    // Only re-run when the actual ingredients/diet change, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIngredients, dietFilter]);

  // Filter and sort recipes. Wrapped defensively — a single malformed
  // recipe (missing title/ingredients) should never be able to crash the
  // whole page with no error boundary to catch it.
  let filteredRecipes = [];
  try {
    filteredRecipes = recipes
      .filter((recipe) => {
        if (!recipe) return false;

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const title = recipe.title || '';
          const recipeIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

          const titleMatch = title.toLowerCase().includes(query);
          const ingredientMatch = recipeIngredients.some((i) =>
            String(i?.name || '').toLowerCase().includes(query)
          );
          return titleMatch || ingredientMatch;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return (b?.matchPercent || 0) - (a?.matchPercent || 0);
        if (sortBy === 'time') return (a?.timeMinutes || 0) - (b?.timeMinutes || 0);
        return 0;
      });
  } catch (err) {
    console.error('[RecipeResultsPage] Failed to filter/sort recipes:', err);
    filteredRecipes = [];
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7DCD1]">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => navigate('/cook')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E847A] hover:text-[#2B2622] transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Edit Cutting Board
          </button>

          <SectionEyebrow icon={Sparkles}>AI RECIPE MATCHES</SectionEyebrow>

          <h1 className="text-3xl sm:text-4xl font-serif text-[#2B2622] font-normal">
            Tonight's <span className="serif-italic text-[#E2673F]">Curated Menu</span>
          </h1>
        </div>

        {/* Active Board Quick Chip Summary */}
        <div className="bg-[#FDFBF8] p-4 rounded-2xl hairline-border border-[#E7DCD1] shadow-xs flex items-center gap-3">
          <div className="flex flex-wrap gap-1.5 max-w-sm">
            {activeIngredients.slice(0, 4).map((ing) => (
              <Badge key={ing} variant="soft" className="text-[11px] py-0.5 px-2">
                {ing}
              </Badge>
            ))}
            {activeIngredients.length > 4 && (
              <Badge variant="soft" className="text-[11px] py-0.5 px-2">
                +{activeIngredients.length - 4} more
              </Badge>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/cook')}>
            Edit
          </Button>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-[#FDFBF8] p-4 sm:p-5 rounded-2xl hairline-border border-[#E7DCD1] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8E847A] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within results..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full bg-white text-[#2B2622] hairline-border border-[#E7DCD1] focus:outline-none focus:ring-2 focus:ring-[#E2673F]"
          />
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Diet Filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6259]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#E2673F]" />
            <span>Diet:</span>
            <select
              value={dietFilter}
              onChange={(e) => {
                const newDiet = e.target.value;
                setDietFilter(newDiet);
                // Pass the new value directly — setDietFilter's update
                // won't be visible in this closure's `dietFilter` until
                // the next render, so relying on state here would fetch
                // with the OLD diet.
                fetchResults(newDiet);
              }}
              className="px-3 py-1.5 rounded-full bg-white text-xs font-medium text-[#2B2622] hairline-border border-[#E7DCD1]"
            >
              {DIET_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6259]">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-white text-xs font-medium text-[#2B2622] hairline-border border-[#E7DCD1]"
            >
              <option value="match">Highest Match %</option>
              <option value="time">Fastest Cooking Time</option>
            </select>
          </div>

          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={() => fetchResults()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Recipe Grid */}
      <RecipeGrid
        recipes={filteredRecipes}
        isLoading={isLoading}
        onRetry={() => fetchResults()}
      />
    </motion.div>
  );
}
