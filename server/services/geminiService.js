// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { fetchImageAsBase64 } from './cloudinaryService.js';

// const FALLBACK_INGREDIENTS = [
//   'Salmon Fillets',
//   'Garlic',
//   'Fresh Spinach',
//   'Heavy Cream',
//   'Sun-dried Tomatoes',
//   'Butter',
//   'Eggs',
//   'Zucchini',
//   'Avocado',
//   'Lemon',
//   'Mushrooms',
// ];

// /**
//  * Image-to-Text AI Pipeline: Extracts food ingredients from an image URL using Gemini Vision AI.
//  *
//  * @param {string} imageUrl
//  * @returns {Promise<{ ingredients: string[] }>}
//  */
// export async function detectIngredientsFromImage(imageUrl) {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (apiKey) {
//     try {
//       console.log('[Gemini Vision AI] Processing image URL:', imageUrl);
//       const { base64Data, mimeType } = await fetchImageAsBase64(imageUrl);

//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//       const prompt = `You are a world-class culinary vision AI assistant.
// Analyze this photo of a fridge, pantry, or food items.
// Identify every visible food ingredient, produce item, vegetable, protein, dairy item, condiment, or pantry staple.

// Return ONLY a clean valid JSON array of strings formatted like this:
// ["Salmon Fillets", "Fresh Spinach", "Heavy Cream", "Garlic", "Butter"]
// Do not wrap in markdown tags or extra text. Output strictly valid raw JSON.`;

//       const result = await model.generateContent([
//         prompt,
//         {
//           inlineData: {
//             data: base64Data,
//             mimeType: mimeType || 'image/jpeg',
//           },
//         },
//       ]);

//       const text = result.response.text().trim();
//       console.log('[Gemini Vision AI] Raw response:', text);

//       // Clean markdown code blocks if present
//       const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
//       const parsed = JSON.parse(cleaned);

//       if (Array.isArray(parsed) && parsed.length > 0) {
//         return { ingredients: parsed.map((item) => String(item).trim()) };
//       }
//     } catch (err) {
//       console.error('[Gemini Vision AI] Pipeline error:', err.message);
//     }
//   } else {
//     console.info('[Gemini Vision AI] GEMINI_API_KEY not found in process.env. Operating in high-precision simulated vision mode.');
//   }

//   // Simulated fallback response when key is missing or pipeline errors
//   return { ingredients: FALLBACK_INGREDIENTS };
// }

// /**
//  * Uses Gemini AI to generate custom recipes tailored to input ingredients.
//  *
//  * @param {Object} params
//  * @param {string[]} params.ingredients
//  * @param {string} [params.diet]
//  * @returns {Promise<Array>}
//  */
// export async function generateCustomRecipesWithAI({ ingredients = [], diet }) {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (apiKey && ingredients.length > 0) {
//     try {
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//       const prompt = `You are an executive chef.
// Given these available pantry ingredients: ${ingredients.join(', ')}
// ${diet ? `and diet requirement: ${diet}` : ''}

// Generate 2 gourmet, boutique restaurant recipes.
// Return ONLY valid JSON matching this schema array:
// [
//   {
//     "recipeId": "gen-1",
//     "title": "Recipe Title",
//     "subtitle": "Short editorial subtitle",
//     "coverImageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
//     "matchPercent": 95,
//     "timeMinutes": 25,
//     "servings": 2,
//     "difficulty": "Easy",
//     "diet": ["Vegetarian"],
//     "ingredients": [
//       { "name": "Ingredient 1", "have": true },
//       { "name": "Ingredient 2", "have": false }
//     ],
//     "steps": [
//       "Step 1 description",
//       "Step 2 description"
//     ],
//     "youtubeUrl": "https://www.youtube.com/watch?v=0k6M23jZ__w",
//     "tips": "Chef tip"
//   }
// ]`;

//       const result = await model.generateContent(prompt);
//       const cleaned = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
//       const parsed = JSON.parse(cleaned);

//       if (Array.isArray(parsed) && parsed.length > 0) {
//         return parsed;
//       }
//     } catch (err) {
//       console.error('[Gemini AI Recipe Generator] Error:', err.message);
//     }
//   }

//   return [];
// }



import { GoogleGenAI } from '@google/genai';
import { fetchImageAsBase64 } from './cloudinaryService.js';

const GEMINI_MODEL = 'gemini-3.6-flash';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from .env');
  }

  return new GoogleGenAI({
    apiKey,
  });
}

/**
 * Remove markdown code fences from Gemini response.
 */
function cleanJson(text) {
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Safely parse Gemini JSON.
 */
function parseJson(text) {
  const cleaned = cleanJson(text);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      '[Gemini] Invalid JSON:',
      cleaned
    );

    throw new Error(
      'Gemini returned invalid JSON.'
    );
  }
}

/**
 * =========================================================
 * IMAGE → INGREDIENTS
 * =========================================================
 */
export async function detectIngredientsFromImage(imageUrl) {
  if (!imageUrl) {
    throw new Error(
      'Image URL is required.'
    );
  }

  try {
    console.log(
      '[Gemini Vision] Processing image:',
      imageUrl
    );

    const {
      base64Data,
      mimeType,
    } = await fetchImageAsBase64(imageUrl);

    if (!base64Data) {
      throw new Error(
        'Unable to download image.'
      );
    }

    const ai = getGeminiClient();

    const prompt = `
You are an expert culinary vision AI.

Analyze the provided image.

Identify food ingredients that are clearly visible.

Look for:
- vegetables
- fruits
- meat
- fish
- dairy
- eggs
- sauces
- spices
- grains
- packaged food
- pantry ingredients

Rules:

1. Only identify ingredients that are actually visible.
2. Do not invent ingredients.
3. Do not guess ingredients that cannot reasonably be identified.
4. Ignore plates, containers, appliances and utensils.
5. Remove duplicate ingredients.
6. Use common ingredient names.
7. Return ONLY a JSON array.
8. Do not return markdown.
9. Do not return explanations.

Example:

[
  "Tomatoes",
  "Onions",
  "Spinach",
  "Paneer",
  "Eggs"
]
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,

      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                data: base64Data,
                mimeType:
                  mimeType || 'image/jpeg',
              },
            },
          ],
        },
      ],

      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;

    console.log(
      '[Gemini Vision] Raw response:',
      text
    );

    const parsed = parseJson(text);

    if (!Array.isArray(parsed)) {
      throw new Error(
        'Gemini did not return an ingredient array.'
      );
    }

    const ingredients = [
      ...new Set(
        parsed
          .map((item) =>
            String(item).trim()
          )
          .filter(Boolean)
      ),
    ];

    console.log(
      '[Gemini Vision] Detected ingredients:',
      ingredients
    );

    return {
      ingredients,
    };
  } catch (error) {
    console.error(
      '[Gemini Vision] Error:',
      error.message
    );

    return {
      ingredients: [],
    };
  }
}

/**
 * =========================================================
 * INGREDIENTS → RECIPES
 * =========================================================
 */
export async function generateCustomRecipesWithAI({
  ingredients = [],
  diet = 'All',
}) {
  if (
    !Array.isArray(ingredients) ||
    ingredients.length === 0
  ) {
    console.log(
      '[Gemini Recipe Generator] No ingredients.'
    );

    return [];
  }

  try {
    const cleanedIngredients = [
      ...new Set(
        ingredients
          .map((item) =>
            String(item).trim()
          )
          .filter(Boolean)
      ),
    ];

    console.log(
      '[Gemini Recipe Generator] Ingredients:',
      cleanedIngredients
    );

    console.log(
      '[Gemini Recipe Generator] Diet:',
      diet
    );

    const ai = getGeminiClient();

    const dietInstruction =
      diet && diet !== 'All'
        ? `
The user's dietary requirement is:
${diet}

All recipes MUST follow this dietary requirement.
`
        : `
There is no specific dietary requirement.
`;

    const prompt = `
You are an expert executive chef.

The user has these ingredients:

${cleanedIngredients.join(', ')}

${dietInstruction}

Create exactly TWO different recipes.

IMPORTANT RULES:

1. Use the user's available ingredients as the primary ingredients.
2. Do not pretend unavailable ingredients are available.
3. Basic ingredients such as salt, pepper, oil and water are allowed.
4. Set "have": true for ingredients from the user's list.
5. Set "have": false for ingredients not in the user's list.
6. Make the recipes practical and cookable.
7. Make both recipes different.
8. Calculate matchPercent based on available ingredients.
9. Return ONLY valid JSON.
10. Do not use markdown.
11. Do not add explanations.

Return exactly this JSON structure:

[
  {
    "recipeId": "gen-1",
    "title": "Recipe Title",
    "subtitle": "Short appetizing description",
    "coverImageUrl": "",
    "matchPercent": 90,
    "timeMinutes": 25,
    "servings": 2,
    "difficulty": "Easy",
    "diet": [],
    "ingredients": [
      {
        "name": "Tomato",
        "have": true
      },
      {
        "name": "Cream",
        "have": false
      }
    ],
    "steps": [
      "Prepare the ingredients.",
      "Cook the ingredients.",
      "Serve."
    ],
    "youtubeUrl": "",
    "tips": "Chef tip."
  }
]
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,

      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;

    console.log(
      '[Gemini Recipe Generator] Raw response:',
      text
    );

    const parsed = parseJson(text);

    if (!Array.isArray(parsed)) {
      throw new Error(
        'Gemini did not return a recipe array.'
      );
    }

    const recipes = parsed.map(
      (recipe, index) => ({
        recipeId:
          recipe.recipeId ||
          `gen-${index + 1}`,

        title:
          recipe.title ||
          'AI Generated Recipe',

        subtitle:
          recipe.subtitle || '',

        coverImageUrl:
          recipe.coverImageUrl || '',

        matchPercent:
          Number(
            recipe.matchPercent
          ) || 0,

        timeMinutes:
          Number(
            recipe.timeMinutes
          ) || 30,

        servings:
          Number(recipe.servings) || 2,

        difficulty:
          recipe.difficulty || 'Easy',

        diet:
          Array.isArray(recipe.diet)
            ? recipe.diet
            : [],

        ingredients:
          Array.isArray(
            recipe.ingredients
          )
            ? recipe.ingredients.map(
                (ingredient) => ({
                  name:
                    ingredient.name || '',

                  have:
                    Boolean(
                      ingredient.have
                    ),
                })
              )
            : [],

        steps:
          Array.isArray(recipe.steps)
            ? recipe.steps
            : [],

        youtubeUrl:
          recipe.youtubeUrl || '',

        tips:
          recipe.tips || '',
      })
    );

    console.log(
      `[Gemini Recipe Generator] Generated ${recipes.length} recipes.`
    );

    return recipes;
  } catch (error) {
    console.error(
      '[Gemini Recipe Generator] Error:',
      error.message
    );

    return [];
  }
}