// 






import { Recipe } from '../models/Recipe.js';
import { isMongoConnected } from '../config/db.js';
import {
  inMemoryRecipes,
  seedInitialRecipes,
  INITIAL_RECIPES_SEED,
} from '../services/seedService.js';

import {
  detectIngredientsFromImage,
  generateCustomRecipesWithAI,
} from '../services/geminiService.js';

/**
 * POST /api/recipes/generate
 *
 * Body:
 * {
 *   imageUrl?: string,
 *   ingredients?: string[],
 *   diet?: string
 * }
 *
 * Flow:
 *
 * Image
 *   ↓
 * Gemini Vision
 *   ↓
 * Ingredients
 *   ↓
 * Gemini Recipe Generator
 *   ↓
 * Recipes
 *
 * If AI is unavailable, MongoDB recipes are used as fallback.
 */
export async function generateRecipesController(req, res, next) {
  try {
    let {
      imageUrl = null,
      ingredients = [],
      diet = 'All',
    } = req.body;

    // --------------------------------------------------
    // 1. Validate ingredients
    // --------------------------------------------------

    if (!Array.isArray(ingredients)) {
      ingredients = [];
    }

    ingredients = ingredients
      .map((ingredient) => String(ingredient).trim())
      .filter(Boolean);

    // --------------------------------------------------
    // 2. If an image was uploaded, analyze it with Gemini
    // --------------------------------------------------

    if (imageUrl) {
      console.log(
        '[Recipe AI] Analyzing uploaded image:',
        imageUrl
      );

      const detected = await detectIngredientsFromImage(imageUrl);

      if (
        detected &&
        Array.isArray(detected.ingredients) &&
        detected.ingredients.length > 0
      ) {
        ingredients = detected.ingredients
          .map((ingredient) => String(ingredient).trim())
          .filter(Boolean);
      }

      console.log(
        '[Recipe AI] Detected ingredients:',
        ingredients
      );
    }

    // --------------------------------------------------
    // 3. Remove duplicate ingredients
    // --------------------------------------------------

    ingredients = [
      ...new Set(
        ingredients.map((ingredient) =>
          ingredient.toLowerCase()
        )
      ),
    ];

    console.log(
      '[Recipe AI] Final ingredients:',
      ingredients
    );

    // --------------------------------------------------
    // 4. Generate custom recipes with Gemini
    // --------------------------------------------------

    if (
      process.env.GEMINI_API_KEY &&
      ingredients.length > 0
    ) {
      console.log(
        '[Recipe AI] Generating recipes with Gemini...'
      );

      const aiRecipes =
        await generateCustomRecipesWithAI({
          ingredients,
          diet,
        });

      if (
        Array.isArray(aiRecipes) &&
        aiRecipes.length > 0
      ) {
        console.log(
          `[Recipe AI] Generated ${aiRecipes.length} recipes`
        );

        return res.status(200).json({
          source: 'gemini',
          ingredients,
          recipes: aiRecipes,
        });
      }
    }

    // --------------------------------------------------
    // 5. FALLBACK: Get recipes from MongoDB
    // --------------------------------------------------

    console.log(
      '[Recipe AI] Gemini unavailable. Using database recipes.'
    );

    let allRecipes = [];

    if (isMongoConnected) {
      const recipeDocs = await Recipe.find({});

      allRecipes = recipeDocs.map((recipe) =>
        recipe.toJSON()
      );
    } else {
      allRecipes = [...inMemoryRecipes];
    }

    // --------------------------------------------------
    // 6. Calculate ingredient matches
    // --------------------------------------------------

    const normalizedUserIngredients = ingredients.map(
      (ingredient) => ingredient.toLowerCase()
    );

    let processedRecipes = allRecipes.map((recipe) => {
      const updatedIngredients = (
        recipe.ingredients || []
      ).map((ingredient) => {
        const recipeIngredient = String(
          ingredient.name || ''
        ).toLowerCase();

        const hasMatch =
          normalizedUserIngredients.some(
            (userIngredient) =>
              recipeIngredient.includes(userIngredient) ||
              userIngredient.includes(recipeIngredient)
          );

        return {
          ...ingredient,
          name: ingredient.name,
          // Only trust the real overlap we just computed — never OR it
          // with the seed data's placeholder `have` flag, or every
          // recipe silently inherits a fake 100% match regardless of
          // what the user actually has.
          have: hasMatch,
        };
      });

      const haveCount = updatedIngredients.filter(
        (ingredient) => ingredient.have
      ).length;

      const totalCount =
        updatedIngredients.length || 1;

      const matchPercent = Math.round(
        (haveCount / totalCount) * 100
      );

      return {
        ...recipe,
        ingredients: updatedIngredients,
        matchPercent,
      };
    });

    // --------------------------------------------------
    // 7. Diet filtering
    // --------------------------------------------------

    if (diet && diet !== 'All') {
      const normalizedDiet = diet.toLowerCase();

      const filteredRecipes =
        processedRecipes.filter((recipe) =>
          Array.isArray(recipe.diet)
            ? recipe.diet.some(
                (recipeDiet) =>
                  String(recipeDiet).toLowerCase() ===
                  normalizedDiet
              )
            : false
        );

      // Only replace results if matching recipes exist
      if (filteredRecipes.length > 0) {
        processedRecipes = filteredRecipes;
      }
    }

    // --------------------------------------------------
    // 8. Sort recipes by ingredient match
    // --------------------------------------------------

    processedRecipes.sort(
      (a, b) => b.matchPercent - a.matchPercent
    );

    // --------------------------------------------------
    // 9. Return response
    // --------------------------------------------------

    return res.status(200).json({
      source: 'database',
      ingredients,
      recipes: processedRecipes,
    });
  } catch (error) {
    console.error(
      '[Recipe Controller] Error:',
      error
    );

    next(error);
  }
}

/**
 * GET /api/recipes/:id
 */
export async function getRecipeByIdController(
  req,
  res,
  next
) {
  try {
    const { id } = req.params;

    // Try MongoDB first
    if (isMongoConnected) {
      const recipe = await Recipe.findOne({
        recipeId: id,
      });

      if (recipe) {
        return res.status(200).json({
          recipe: recipe.toJSON(),
        });
      }
    }

    // Fallback to in-memory recipes
    const foundRecipe =
      inMemoryRecipes.find(
        (recipe) =>
          recipe.recipeId === id ||
          recipe.id === id
      ) ||
      INITIAL_RECIPES_SEED.find(
        (recipe) =>
          recipe.recipeId === id ||
          recipe.id === id
      );

    if (!foundRecipe) {
      return res.status(404).json({
        message: 'Recipe not found.',
      });
    }

    return res.status(200).json({
      recipe: foundRecipe,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/recipes/seed
 */
export async function seedRecipesController(
  req,
  res,
  next
) {
  try {
    await seedInitialRecipes();

    return res.status(200).json({
      message: 'Recipes seeded successfully.',
      count: INITIAL_RECIPES_SEED.length,
    });
  } catch (error) {
    next(error);
  }
}