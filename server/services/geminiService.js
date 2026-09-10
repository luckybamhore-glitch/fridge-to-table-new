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



// import { GoogleGenAI } from '@google/genai';
// import { fetchImageAsBase64 } from './cloudinaryService.js';

// const GEMINI_MODEL = 'gemini-3.6-flash';

// function getGeminiClient() {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     throw new Error('GEMINI_API_KEY is missing from .env');
//   }

//   return new GoogleGenAI({
//     apiKey,
//   });
// }

// /**
//  * Remove markdown code fences from Gemini response.
//  */
// function cleanJson(text) {
//   if (!text) {
//     throw new Error('Gemini returned an empty response.');
//   }

//   return text
//     .trim()
//     .replace(/^```json\s*/i, '')
//     .replace(/^```\s*/i, '')
//     .replace(/\s*```$/i, '')
//     .trim();
// }

// /**
//  * Safely parse Gemini JSON.
//  */
// function parseJson(text) {
//   const cleaned = cleanJson(text);

//   try {
//     return JSON.parse(cleaned);
//   } catch (error) {
//     console.error(
//       '[Gemini] Invalid JSON:',
//       cleaned
//     );

//     throw new Error(
//       'Gemini returned invalid JSON.'
//     );
//   }
// }

// /**
//  * =========================================================
//  * IMAGE → INGREDIENTS
//  * =========================================================
//  */
// export async function detectIngredientsFromImage(imageUrl) {
//   if (!imageUrl) {
//     throw new Error(
//       'Image URL is required.'
//     );
//   }

//   try {
//     console.log(
//       '[Gemini Vision] Processing image:',
//       imageUrl
//     );

//     const {
//       base64Data,
//       mimeType,
//     } = await fetchImageAsBase64(imageUrl);

//     if (!base64Data) {
//       throw new Error(
//         'Unable to download image.'
//       );
//     }

//     const ai = getGeminiClient();

//     const prompt = `
// You are an expert culinary vision AI.

// Analyze the provided image.

// Identify food ingredients that are clearly visible.

// Look for:
// - vegetables
// - fruits
// - meat
// - fish
// - dairy
// - eggs
// - sauces
// - spices
// - grains
// - packaged food
// - pantry ingredients

// Rules:

// 1. Only identify ingredients that are actually visible.
// 2. Do not invent ingredients.
// 3. Do not guess ingredients that cannot reasonably be identified.
// 4. Ignore plates, containers, appliances and utensils.
// 5. Remove duplicate ingredients.
// 6. Use common ingredient names.
// 7. Return ONLY a JSON array.
// 8. Do not return markdown.
// 9. Do not return explanations.

// Example:

// [
//   "Tomatoes",
//   "Onions",
//   "Spinach",
//   "Paneer",
//   "Eggs"
// ]
// `;

//     const response = await ai.models.generateContent({
//       model: GEMINI_MODEL,

//       contents: [
//         {
//           role: 'user',
//           parts: [
//             {
//               text: prompt,
//             },
//             {
//               inlineData: {
//                 data: base64Data,
//                 mimeType:
//                   mimeType || 'image/jpeg',
//               },
//             },
//           ],
//         },
//       ],

//       config: {
//         responseMimeType: 'application/json',
//       },
//     });

//     const text = response.text;

//     console.log(
//       '[Gemini Vision] Raw response:',
//       text
//     );

//     const parsed = parseJson(text);

//     if (!Array.isArray(parsed)) {
//       throw new Error(
//         'Gemini did not return an ingredient array.'
//       );
//     }

//     const ingredients = [
//       ...new Set(
//         parsed
//           .map((item) =>
//             String(item).trim()
//           )
//           .filter(Boolean)
//       ),
//     ];

//     console.log(
//       '[Gemini Vision] Detected ingredients:',
//       ingredients
//     );

//     return {
//       ingredients,
//     };
//   } catch (error) {
//     console.error(
//       '[Gemini Vision] Error:',
//       error.message
//     );

//     return {
//       ingredients: [],
//     };
//   }
// }

// /**
//  * =========================================================
//  * INGREDIENTS → RECIPES
//  * =========================================================
//  */
// export async function generateCustomRecipesWithAI({
//   ingredients = [],
//   diet = 'All',
// }) {
//   if (
//     !Array.isArray(ingredients) ||
//     ingredients.length === 0
//   ) {
//     console.log(
//       '[Gemini Recipe Generator] No ingredients.'
//     );

//     return [];
//   }

//   try {
//     const cleanedIngredients = [
//       ...new Set(
//         ingredients
//           .map((item) =>
//             String(item).trim()
//           )
//           .filter(Boolean)
//       ),
//     ];

//     console.log(
//       '[Gemini Recipe Generator] Ingredients:',
//       cleanedIngredients
//     );

//     console.log(
//       '[Gemini Recipe Generator] Diet:',
//       diet
//     );

//     const ai = getGeminiClient();

//     const dietInstruction =
//       diet && diet !== 'All'
//         ? `
// The user's dietary requirement is:
// ${diet}

// All recipes MUST follow this dietary requirement.
// `
//         : `
// There is no specific dietary requirement.
// `;

//     const prompt = `
// You are an expert executive chef.

// The user has these ingredients:

// ${cleanedIngredients.join(', ')}

// ${dietInstruction}

// Create exactly TWO different recipes.

// IMPORTANT RULES:

// 1. Use the user's available ingredients as the primary ingredients.
// 2. Do not pretend unavailable ingredients are available.
// 3. Basic ingredients such as salt, pepper, oil and water are allowed.
// 4. Set "have": true for ingredients from the user's list.
// 5. Set "have": false for ingredients not in the user's list.
// 6. Make the recipes practical and cookable.
// 7. Make both recipes different.
// 8. Calculate matchPercent based on available ingredients.
// 9. Return ONLY valid JSON.
// 10. Do not use markdown.
// 11. Do not add explanations.

// Return exactly this JSON structure:

// [
//   {
//     "recipeId": "gen-1",
//     "title": "Recipe Title",
//     "subtitle": "Short appetizing description",
//     "coverImageUrl": "",
//     "matchPercent": 90,
//     "timeMinutes": 25,
//     "servings": 2,
//     "difficulty": "Easy",
//     "diet": [],
//     "ingredients": [
//       {
//         "name": "Tomato",
//         "have": true
//       },
//       {
//         "name": "Cream",
//         "have": false
//       }
//     ],
//     "steps": [
//       "Prepare the ingredients.",
//       "Cook the ingredients.",
//       "Serve."
//     ],
//     "youtubeUrl": "",
//     "tips": "Chef tip."
//   }
// ]
// `;

//     const response = await ai.models.generateContent({
//       model: GEMINI_MODEL,

//       contents: [
//         {
//           role: 'user',
//           parts: [
//             {
//               text: prompt,
//             },
//           ],
//         },
//       ],

//       config: {
//         responseMimeType: 'application/json',
//       },
//     });

//     const text = response.text;

//     console.log(
//       '[Gemini Recipe Generator] Raw response:',
//       text
//     );

//     const parsed = parseJson(text);

//     if (!Array.isArray(parsed)) {
//       throw new Error(
//         'Gemini did not return a recipe array.'
//       );
//     }

//     const recipes = parsed.map(
//       (recipe, index) => ({
//         recipeId:
//           recipe.recipeId ||
//           `gen-${index + 1}`,

//         title:
//           recipe.title ||
//           'AI Generated Recipe',

//         subtitle:
//           recipe.subtitle || '',

//         coverImageUrl:
//           recipe.coverImageUrl || '',

//         matchPercent:
//           Number(
//             recipe.matchPercent
//           ) || 0,

//         timeMinutes:
//           Number(
//             recipe.timeMinutes
//           ) || 30,

//         servings:
//           Number(recipe.servings) || 2,

//         difficulty:
//           recipe.difficulty || 'Easy',

//         diet:
//           Array.isArray(recipe.diet)
//             ? recipe.diet
//             : [],

//         ingredients:
//           Array.isArray(
//             recipe.ingredients
//           )
//             ? recipe.ingredients.map(
//                 (ingredient) => ({
//                   name:
//                     ingredient.name || '',

//                   have:
//                     Boolean(
//                       ingredient.have
//                     ),
//                 })
//               )
//             : [],

//         steps:
//           Array.isArray(recipe.steps)
//             ? recipe.steps
//             : [],

//         youtubeUrl:
//           recipe.youtubeUrl || '',

//         tips:
//           recipe.tips || '',
//       })
//     );

//     console.log(
//       `[Gemini Recipe Generator] Generated ${recipes.length} recipes.`
//     );

//     return recipes;
//   } catch (error) {
//     console.error(
//       '[Gemini Recipe Generator] Error:',
//       error.message
//     );

//     return [];
//   }
// }

import { GoogleGenAI } from '@google/genai';
import { fetchImageAsBase64 } from './cloudinaryService.js';
import { uploadImageFromBase64 } from './cloudinaryService.js';
import { attachYoutubeLinks } from './youtubeService.js';

const GEMINI_MODEL = 'gemini-3.6-flash';
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 1000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from .env');
  }

  return new GoogleGenAI({
    apiKey,
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * True for errors worth retrying: Gemini temporarily overloaded (503) or
 * rate-limited (429). Anything else (bad API key, invalid request, etc.)
 * fails fast instead of wasting time retrying a request that will never
 * succeed.
 */
function isRetryableGeminiError(error) {
  const message = error?.message || '';
  return (
    message.includes('"code":503') ||
    message.includes('UNAVAILABLE') ||
    message.includes('"code":429') ||
    message.includes('RESOURCE_EXHAUSTED')
  );
}

/**
 * Runs a Gemini call with retry-with-backoff for transient failures
 * (the model being temporarily overloaded is common and usually
 * resolves within a couple of seconds).
 */
async function callGeminiWithRetry(fn, label) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiError(error) || attempt === MAX_RETRIES) {
        throw error;
      }

      const delay = RETRY_BASE_DELAY_MS * 2 ** attempt;
      console.warn(
        `[Gemini] ${label} temporarily unavailable (attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${delay}ms...`
      );
      await sleep(delay);
    }
  }

  throw lastError;
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
    console.error('[Gemini] Invalid JSON:', cleaned);
    throw new Error('Gemini returned invalid JSON.');
  }
}

/**
 * Vision models will occasionally slip non-ingredient text into the
 * array — a caption, a URL, a "Recipe: ..." label read off the photo —
 * despite explicit prompt instructions not to. Prompting alone isn't
 * enforcement, so we filter defensively on our end before this list
 * ever reaches recipe generation or the UI.
 */
function isPlausibleIngredientName(name) {
  if (name.length > 40) return false; // real ingredient names are short
  if (/https?:\/\/|www\./i.test(name)) return false; // URLs
  if (/^(recipe|youtube|link|video|source)\s*:/i.test(name)) return false; // labels
  if (/[{}<>]/.test(name)) return false; // stray markup
  return true;
}

/**
 * =========================================================
 * IMAGE → INGREDIENTS
 * =========================================================
 *
 * Throws on failure instead of silently returning an empty list —
 * "Gemini is temporarily unavailable" and "no ingredients were visible
 * in this photo" are very different situations, and the caller
 * (visionController -> PhotoUploadModal) needs to tell them apart to
 * show the user an accurate, actionable message.
 */
export async function detectIngredientsFromImage(imageUrl) {
  if (!imageUrl) {
    throw new Error('Image URL is required.');
  }

  console.log('[Gemini Vision] Processing image:', imageUrl);

  const { base64Data, mimeType } = await fetchImageAsBase64(imageUrl);

  if (!base64Data) {
    throw new Error('Unable to download image.');
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

  try {
    const response = await callGeminiWithRetry(
      () =>
        ai.models.generateContent({
          model: GEMINI_MODEL,

          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: mimeType || 'image/jpeg',
                  },
                },
              ],
            },
          ],

          config: {
            responseMimeType: 'application/json',
          },
        }),
      'Vision detection'
    );

    const text = response.text;

    console.log('[Gemini Vision] Raw response:', text);

    const parsed = parseJson(text);

    if (!Array.isArray(parsed)) {
      throw new Error('Gemini did not return an ingredient array.');
    }

    const ingredients = [
      ...new Set(
        parsed
          .map((item) => String(item).trim())
          .filter(Boolean)
          .filter(isPlausibleIngredientName)
      ),
    ];

    console.log('[Gemini Vision] Detected ingredients:', ingredients);

    return { ingredients };
  } catch (error) {
    console.error('[Gemini Vision] Error:', error.message);

    if (isRetryableGeminiError(error)) {
      throw new Error(
        'The AI vision service is temporarily busy. Please try again in a moment.'
      );
    }

    throw new Error('Could not analyze the photo. Please try a clearer image.');
  }
}

// Fast/cheap tier of Gemini's image model — good enough for food photos,
// and this runs twice (once per recipe) on every generation request, so
// keeping it on the flash tier matters for both latency and cost. Swap
// to 'gemini-3-pro-image' if quality ever needs to outweigh that.
const RECIPE_IMAGE_MODEL = 'gemini-2.5-flash-image';

/**
 * Generates a real, recipe-specific food photo with Gemini's image
 * model, then re-hosts it on Cloudinary so the rest of the app gets
 * back a normal, permanent HTTPS URL — exactly what it already expects
 * for coverImageUrl (same shape as the seeded DB recipes' images).
 *
 * Returns '' on any failure (missing key, model error, upload error)
 * rather than throwing, so one bad image never breaks the whole
 * recipe response — the frontend's FALLBACK_COVER_IMAGE already
 * handles an empty coverImageUrl.
 */
async function generateRecipeCoverImage(recipe) {
  try {
    const ai = getGeminiClient();

    const prompt = `A professional food-magazine photograph of this dish: "${recipe.title}". ${recipe.subtitle || ''}
Overhead or 45-degree angle, on a simple plate or bowl, natural daylight, shallow depth of field, restaurant-quality plating and styling.
Photorealistic. No text, no watermark, no logos, no people, no hands, no utensils mid-motion.`;

    const response = await callGeminiWithRetry(
      () =>
        ai.models.generateContent({
          model: RECIPE_IMAGE_MODEL,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
      `Recipe image (${recipe.title})`
    );

    const parts = response?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part) => part.inlineData?.data);

    if (!imagePart) {
      console.warn(`[Gemini Image] No image data returned for "${recipe.title}".`);
      return '';
    }

    const mimeType = imagePart.inlineData.mimeType || 'image/png';
    const dataUri = `data:${mimeType};base64,${imagePart.inlineData.data}`;

    const { url } = await uploadImageFromBase64(dataUri, 'fridge-to-table/recipe-covers');

    return url;
  } catch (error) {
    console.error(
      `[Gemini Image] Failed to generate image for "${recipe.title}":`,
      error.message
    );
    return '';
  }
}

/**
 * =========================================================
 * INGREDIENTS → RECIPES
 * =========================================================
 *
 * Keeps returning [] on failure (rather than throwing) because
 * recipeController.js has a legitimate MongoDB fallback for this case —
 * unlike ingredient detection, there's a good second option here.
 */
export async function generateCustomRecipesWithAI({ ingredients = [], diet = 'All' }) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    console.log('[Gemini Recipe Generator] No ingredients.');
    return [];
  }

  try {
    const cleanedIngredients = [
      ...new Set(ingredients.map((item) => String(item).trim()).filter(Boolean)),
    ];

    console.log('[Gemini Recipe Generator] Ingredients:', cleanedIngredients);
    console.log('[Gemini Recipe Generator] Diet:', diet);

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

    // NOTE: We deliberately do NOT ask Gemini for a youtubeUrl here.
    // Without live search grounding, the model cannot know a real,
    // currently-live video ID — it hallucinates a plausible-looking
    // but usually broken link. A verified link is attached afterwards
    // via the YouTube Data API (see attachYoutubeLinks below).
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
      { "name": "Tomato", "have": true },
      { "name": "Cream", "have": false }
    ],
    "steps": [
      "Prepare the ingredients.",
      "Cook the ingredients.",
      "Serve."
    ],
    "tips": "Chef tip."
  }
]
`;

    const response = await callGeminiWithRetry(
      () =>
        ai.models.generateContent({
          model: GEMINI_MODEL,

          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],

          config: {
            responseMimeType: 'application/json',
          },
        }),
      'Recipe generation'
    );

    const text = response.text;

    console.log('[Gemini Recipe Generator] Raw response:', text);

    const parsed = parseJson(text);

    if (!Array.isArray(parsed)) {
      throw new Error('Gemini did not return a recipe array.');
    }

    const recipes = parsed.map((recipe, index) => ({
      recipeId: recipe.recipeId || `gen-${index + 1}`,
      title: recipe.title || 'AI Generated Recipe',
      subtitle: recipe.subtitle || '',
      coverImageUrl: recipe.coverImageUrl || '',
      matchPercent: Number(recipe.matchPercent) || 0,
      timeMinutes: Number(recipe.timeMinutes) || 30,
      servings: Number(recipe.servings) || 2,
      difficulty: recipe.difficulty || 'Easy',
      diet: Array.isArray(recipe.diet) ? recipe.diet : [],
      ingredients: Array.isArray(recipe.ingredients)
        ? recipe.ingredients.map((ingredient) => ({
            name: ingredient.name || '',
            have: Boolean(ingredient.have),
          }))
        : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps : [],
      youtubeUrl: '', // filled in below with a verified real link
      tips: recipe.tips || '',
    }));

    // Recompute `have` and matchPercent ourselves instead of trusting
    // the model's self-reported values. LLMs are unreliable graders of
    // their own output — especially when given a noisy ingredient list —
    // and there was previously nothing here catching a recipe that
    // claims "100% match" while actually using ingredients the user
    // never listed. The model's ingredient *names* and *steps* stay
    // authoritative; only the numbers that drive the match badge are
    // re-derived from the real input list.
    const normalizedUserIngredients = cleanedIngredients.map((item) =>
      item.toLowerCase()
    );

    const verifiedRecipes = recipes.map((recipe) => {
      const verifiedIngredients = recipe.ingredients.map((ingredient) => {
        const name = ingredient.name.toLowerCase();
        const isMatch = normalizedUserIngredients.some(
          (userIngredient) =>
            name.includes(userIngredient) || userIngredient.includes(name)
        );
        return { ...ingredient, have: isMatch };
      });

      const haveCount = verifiedIngredients.filter((i) => i.have).length;
      const totalCount = verifiedIngredients.length || 1;

      return {
        ...recipe,
        ingredients: verifiedIngredients,
        matchPercent: Math.round((haveCount / totalCount) * 100),
      };
    });

    // Look up a real, verified YouTube video AND generate a real,
    // recipe-specific cover photo per recipe — run together since
    // neither depends on the other, so we only pay the slower of the
    // two in wall-clock time instead of both back-to-back.
    const [recipesWithVideos, generatedImageUrls] = await Promise.all([
      attachYoutubeLinks(verifiedRecipes),
      Promise.all(verifiedRecipes.map((recipe) => generateRecipeCoverImage(recipe))),
    ]);

    const recipesWithImages = recipesWithVideos.map((recipe, index) => ({
      ...recipe,
      // Fall back to whatever Gemini's text call returned (normally '')
      // rather than forcing an empty string, in case that ever changes.
      coverImageUrl: generatedImageUrls[index] || recipe.coverImageUrl || '',
    }));

    console.log(`[Gemini Recipe Generator] Generated ${recipesWithImages.length} recipes.`);

    return recipesWithImages;
  } catch (error) {
    console.error('[Gemini Recipe Generator] Error:', error.message);
    return [];
  }
}