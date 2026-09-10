import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { fetchPantry, replacePantryApi, addPantryItemApi, removePantryItemApi } from '../api/pantryApi';
import { fetchFavorites, toggleFavoriteApi } from '../api/favoritesApi';

const PantryContext = createContext(null);

const DEFAULT_INITIAL_INGREDIENTS = ['Garlic', 'Tomatoes', 'Olive Oil', 'Eggs'];
const DEFAULT_SAVED_RECIPES = ['recipe-1'];

export const QUICK_ADD_CATEGORIES = [
  {
    name: 'Vegetables & Herbs',
    items: ['Garlic', 'Spinach', 'Tomatoes', 'Zucchini', 'Bell Peppers', 'Onions', 'Mushrooms', 'Avocado', 'Basil']
  },
  {
    name: 'Proteins',
    items: ['Eggs', 'Salmon Fillets', 'Chicken Thighs', 'Chickpeas', 'Ground Turkey', 'Tofu']
  },
  {
    name: 'Dairy & Cheese',
    items: ['Heavy Cream', 'Butter', 'Parmesan', 'Feta Cheese', 'Burrata', 'Greek Yogurt', 'Milk']
  },
  {
    name: 'Pantry & Oil',
    items: ['Olive Oil', 'Lemon', 'Honey', 'Soy Sauce', 'Pasta', 'Rice', 'Sun-dried Tomatoes', 'Breadcrumbs']
  }
];

export const DIET_OPTIONS = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Pescatarian'];

// Case-insensitive de-dupe that keeps first-seen casing
function mergeUnique(...lists) {
  const seen = new Set();
  const merged = [];
  for (const list of lists) {
    for (const raw of list) {
      const trimmed = String(raw).trim();
      const key = trimmed.toLowerCase();
      if (trimmed && !seen.has(key)) {
        seen.add(key);
        merged.push(trimmed);
      }
    }
  }
  return merged;
}

export function PantryProvider({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();

  const [ingredients, setIngredientsState] = useState(() => {
    try {
      const saved = localStorage.getItem('ftt_pantry_ingredients');
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_INGREDIENTS;
    } catch {
      return DEFAULT_INITIAL_INGREDIENTS;
    }
  });

  const [dietFilter, setDietFilter] = useState('All');
  const [savedRecipeIds, setSavedRecipeIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ftt_saved_recipes');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_RECIPES;
    } catch {
      return DEFAULT_SAVED_RECIPES;
    }
  });

  // Full recipe objects indexed by identifier for offline & persistent access
  const [savedRecipesMap, setSavedRecipesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('ftt_saved_recipes_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // History of past AI recipe generations
  const [recipeHistory, setRecipeHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ftt_recipe_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [duplicateShakeItem, setDuplicateShakeItem] = useState(null);
  const [activeResults, setActiveResults] = useState(null);
  const [generationState, setGenerationState] = useState('idle'); // 'idle' | 'generating' | 'generated' | 'error'
  const [generationMeta, setGenerationMeta] = useState({
    count: 0,
    diet: 'All',
    ingredients: [],
    generatedAt: null,
  });

  // Tracks whether we've reconciled local vs. server state for the current
  // login session, so we only do the merge-and-push-back once per login —
  // not on every render.
  const hasSyncedRef = useRef(false);

  // Sync local state to localStorage (keeps working for anonymous users,
  // and acts as an offline cache for logged-in ones too)
  useEffect(() => {
    try {
      localStorage.setItem('ftt_pantry_ingredients', JSON.stringify(ingredients));
    } catch (e) {
      console.error(e);
    }
  }, [ingredients]);

  useEffect(() => {
    try {
      localStorage.setItem('ftt_saved_recipes', JSON.stringify(savedRecipeIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedRecipeIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ftt_saved_recipes_map', JSON.stringify(savedRecipesMap));
    } catch (e) {
      console.error(e);
    }
  }, [savedRecipesMap]);

  useEffect(() => {
    try {
      localStorage.setItem('ftt_recipe_history', JSON.stringify(recipeHistory));
    } catch (e) {
      console.error(e);
    }
  }, [recipeHistory]);

  // On login (or on silent session restore), reconcile local + server state:
  // anything the user added anonymously before logging in gets merged into
  // their account rather than discarded.
  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated) {
      hasSyncedRef.current = false;
      return;
    }

    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    (async () => {
      try {
        const [{ pantry: serverPantry }, { savedRecipes: serverFavorites }] = await Promise.all([
          fetchPantry(),
          fetchFavorites(),
        ]);

        const serverIngredientNames = serverPantry.map((item) => item.name);
        const mergedIngredients = mergeUnique(serverIngredientNames, ingredients);
        setIngredientsState(mergedIngredients);

        // Push back only if the merge actually added something the server didn't have
        const serverLower = new Set(serverIngredientNames.map((n) => n.toLowerCase()));
        const hasLocalOnlyItems = mergedIngredients.some((n) => !serverLower.has(n.toLowerCase()));
        if (hasLocalOnlyItems) {
          await replacePantryApi(mergedIngredients);
        }

        const mergedFavorites = mergeUnique(serverFavorites, savedRecipeIds);
        setSavedRecipeIds(mergedFavorites);

        const favoritesToPush = mergedFavorites.filter((id) => !serverFavorites.includes(id));
        for (const id of favoritesToPush) {
          await toggleFavoriteApi(id); // toggle adds it, since server doesn't have it yet
        }
      } catch (err) {
        console.error('[Pantry sync] Failed to reconcile with server, continuing offline:', err?.message);
      }
    })();
  }, [isAuthenticated, isInitializing]); // eslint-disable-line react-hooks/exhaustive-deps

  const addIngredient = useCallback((rawName) => {
    if (!rawName || typeof rawName !== 'string') return false;
    const name = rawName.trim();
    if (!name) return false;

    // Read current ingredients synchronously (from closure) rather than via
    // the setState updater, so the duplicate/success result we return is
    // accurate immediately — React may defer the updater callback itself.
    const exists = ingredients.some((item) => item.toLowerCase() === name.toLowerCase());
    if (exists) {
      setDuplicateShakeItem(name);
      setTimeout(() => setDuplicateShakeItem(null), 600);
      return 'duplicate';
    }

    setIngredientsState((prev) => [...prev, name]);

    if (isAuthenticated) {
      addPantryItemApi(name).catch((err) =>
        console.error('[Pantry sync] Failed to save ingredient to server:', err?.message)
      );
    }

    return true;
  }, [ingredients, isAuthenticated]);

  const removeIngredient = useCallback((nameToRemove) => {
    setIngredientsState((prev) =>
      prev.filter((item) => item.toLowerCase() !== nameToRemove.toLowerCase())
    );

    if (isAuthenticated) {
      removePantryItemApi(nameToRemove).catch((err) =>
        console.error('[Pantry sync] Failed to remove ingredient on server:', err?.message)
      );
    }
  }, [isAuthenticated]);

  const clearIngredients = useCallback(() => {
    setIngredientsState([]);
    if (isAuthenticated) {
      replacePantryApi([]).catch((err) =>
        console.error('[Pantry sync] Failed to clear pantry on server:', err?.message)
      );
    }
  }, [isAuthenticated]);

  const setIngredients = useCallback((newIngredients) => {
    if (!Array.isArray(newIngredients)) return;
    const unique = mergeUnique(newIngredients);
    setIngredientsState(unique);

    if (isAuthenticated) {
      replacePantryApi(unique).catch((err) =>
        console.error('[Pantry sync] Failed to sync pantry to server:', err?.message)
      );
    }
  }, [isAuthenticated]);

  const toggleSavedRecipe = useCallback((id, recipeObj = null) => {
    setSavedRecipeIds((prev) => {
      const isSaving = !prev.includes(id);
      if (isSaving && recipeObj) {
        setSavedRecipesMap((mapPrev) => ({ ...mapPrev, [id]: recipeObj }));
      } else if (!isSaving) {
        setSavedRecipesMap((mapPrev) => {
          const updated = { ...mapPrev };
          delete updated[id];
          return updated;
        });
      }
      return isSaving ? [...prev, id] : prev.filter((rId) => rId !== id);
    });

    if (isAuthenticated) {
      toggleFavoriteApi(id).catch((err) =>
        console.error('[Pantry sync] Failed to sync favorite to server:', err?.message)
      );
    }
  }, [isAuthenticated]);

  const saveGenerationToHistory = useCallback(({ ingredients: ingList, diet, recipes }) => {
    if (!Array.isArray(recipes) || recipes.length === 0) return;
    const newSession = {
      id: `history-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ingredients: Array.isArray(ingList) ? ingList : [],
      diet: diet || 'All',
      recipes,
    };

    setRecipeHistory((prev) => {
      const filtered = prev.filter(
        (session) =>
          JSON.stringify(session.ingredients.sort()) !== JSON.stringify([...newSession.ingredients].sort()) ||
          session.diet !== newSession.diet
      );
      return [newSession, ...filtered].slice(0, 20); // keep 20 latest sessions
    });
  }, []);

  const clearRecipeHistory = useCallback(() => {
    setRecipeHistory([]);
  }, []);

  const deleteHistorySession = useCallback((sessionId) => {
    setRecipeHistory((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  const contextValue = React.useMemo(
    () => ({
      ingredients,
      addIngredient,
      removeIngredient,
      clearIngredients,
      setIngredients,
      dietFilter,
      setDietFilter,
      savedRecipeIds,
      savedRecipesMap,
      toggleSavedRecipe,
      recipeHistory,
      saveGenerationToHistory,
      clearRecipeHistory,
      deleteHistorySession,
      uploadedPhotoUrl,
      setUploadedPhotoUrl,
      duplicateShakeItem,
      activeResults,
      setActiveResults,
      generationState,
      setGenerationState,
      generationMeta,
      setGenerationMeta,
    }),
    [
      ingredients,
      addIngredient,
      removeIngredient,
      clearIngredients,
      setIngredients,
      dietFilter,
      savedRecipeIds,
      savedRecipesMap,
      toggleSavedRecipe,
      recipeHistory,
      saveGenerationToHistory,
      clearRecipeHistory,
      deleteHistorySession,
      uploadedPhotoUrl,
      duplicateShakeItem,
      activeResults,
      generationState,
      generationMeta,
    ]
  );

  return (
    <PantryContext.Provider value={contextValue}>
      {children}
    </PantryContext.Provider>
  );
}

export function usePantry() {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return context;
}
