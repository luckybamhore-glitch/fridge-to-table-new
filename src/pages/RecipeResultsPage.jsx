import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal, ArrowLeft, RefreshCw, Search } from 'lucide-react';
import { SectionEyebrow } from '../components/ui/SectionEyebrow';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { RecipeGeneratingLoadingScreen } from '../components/recipe/RecipeGeneratingLoadingScreen';
import { RecipeGeneratedStateBanner } from '../components/recipe/RecipeGeneratedStateBanner';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DIET_OPTIONS, usePantry } from '../context/PantryContext';
import { generateRecipes } from '../api/recipeApi';
import { useToast } from '../context/ToastContext';

export function RecipeResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    ingredients,
    dietFilter,
    setDietFilter,
    activeResults,
    setActiveResults,
    generationState,
    setGenerationState,
    generationMeta,
    setGenerationMeta,
    saveGenerationToHistory,
  } = usePantry();
  const { addToast } = useToast();

  const scanIngredients = location.state?.scanIngredients || (location.state?.aiGenerated ? location.state?.ingredients : null);
  const activeIngredients = useMemo(
    () => (Array.isArray(scanIngredients) && scanIngredients.length > 0 ? scanIngredients : ingredients),
    [scanIngredients, ingredients]
  );

  const [recipes, setRecipes] = useState(activeResults || []);
  const [isLoading, setIsLoading] = useState(!activeResults || activeResults.length === 0);
  const [sortBy, setSortBy] = useState('match');
  const [searchQuery, setSearchQuery] = useState('');

  const buildSignature = useCallback(
    (ingredientList, diet) =>
      `${diet}::${[...(ingredientList || [])].map((i) => String(i).toLowerCase()).sort().join('|')}`,
    []
  );

  const lastFetchedSignatureRef = useRef(
    generationMeta?.ingredients && generationMeta.ingredients.length > 0
      ? buildSignature(generationMeta.ingredients, generationMeta.diet || 'All')
      : null
  );

  // Sync recipes state with context's activeResults when updated
  useEffect(() => {
    if (Array.isArray(activeResults) && activeResults.length > 0) {
      setRecipes(activeResults);
    }
  }, [activeResults]);

  const metaSignature = useMemo(() => {
    if (!generationMeta?.ingredients || generationMeta.ingredients.length === 0) return null;
    return buildSignature(generationMeta.ingredients, generationMeta.diet || 'All');
  }, [generationMeta, buildSignature]);

  const fetchResults = useCallback(
    async (dietOverride) => {
      if (activeIngredients.length === 0) {
        navigate('/cook');
        return;
      }

      const dietToUse = dietOverride ?? dietFilter;

      setIsLoading(true);
      setGenerationState('generating');
      try {
        const response = await generateRecipes({
          ingredients: activeIngredients,
          diet: dietToUse,
        });

        setIsLoading(false);

        if (response && Array.isArray(response.recipes)) {
          const newSignature = buildSignature(activeIngredients, dietToUse);
          lastFetchedSignatureRef.current = newSignature;
          setRecipes(response.recipes);
          setActiveResults(response.recipes);
          setGenerationState('generated');
          setGenerationMeta({
            count: response.recipes.length,
            diet: dietToUse,
            ingredients: activeIngredients,
            generatedAt: new Date().toISOString(),
          });
          saveGenerationToHistory({
            ingredients: activeIngredients,
            diet: dietToUse,
            recipes: response.recipes,
          });
        } else {
          setRecipes([]);
          setActiveResults([]);
          setGenerationState('idle');
        }
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        setGenerationState('error');
        addToast('Error fetching recipes. Please try again.', 'error');
      }
    },
    [
      activeIngredients,
      dietFilter,
      navigate,
      setGenerationState,
      setGenerationMeta,
      setActiveResults,
      saveGenerationToHistory,
      buildSignature,
      addToast,
    ]
  );

  useEffect(() => {
    const currentSignature = buildSignature(activeIngredients, dietFilter);
    const hasCachedResults =
      Array.isArray(activeResults) &&
      activeResults.length > 0 &&
      generationState === 'generated' &&
      (metaSignature === currentSignature || lastFetchedSignatureRef.current === currentSignature);

    if (hasCachedResults) {
      lastFetchedSignatureRef.current = currentSignature;
      setIsLoading(false);
      return;
    }

    fetchResults();
  }, [activeIngredients, dietFilter, activeResults, generationState, metaSignature, buildSignature, fetchResults]);

  const filteredRecipes = useMemo(() => {
    try {
      const query = searchQuery.trim().toLowerCase();
      return recipes
        .filter((recipe) => {
          if (!recipe) return false;
          if (!query) return true;

          const titleMatch = (recipe.title || '').toLowerCase().includes(query);
          const recipeIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
          const ingredientMatch = recipeIngredients.some((i) =>
            String(i?.name || '').toLowerCase().includes(query)
          );
          return titleMatch || ingredientMatch;
        })
        .sort((a, b) => {
          if (sortBy === 'match') return (b?.matchPercent || 0) - (a?.matchPercent || 0);
          if (sortBy === 'time') return (a?.timeMinutes || 0) - (b?.timeMinutes || 0);
          return 0;
        });
    } catch (err) {
      console.error('[RecipeResultsPage] Failed to filter/sort recipes:', err);
      return [];
    }
  }, [recipes, searchQuery, sortBy]);

  if (isLoading || generationState === 'generating') {
    return (
      <RecipeGeneratingLoadingScreen
        ingredients={activeIngredients}
        diet={dietFilter}
      />
    );
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

      {/* Generated Recipe State Banner */}
      {generationState === 'generated' && (
        <RecipeGeneratedStateBanner
          recipeCount={recipes.length}
          ingredients={activeIngredients}
          diet={dietFilter}
          generatedAt={generationMeta?.generatedAt}
          onRegenerate={() => fetchResults()}
          onEditIngredients={() => navigate('/cook')}
        />
      )}

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
