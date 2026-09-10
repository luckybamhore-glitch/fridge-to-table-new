import axios from 'axios';

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const youtubeCache = new Map();

/**
 * Finds a real, verified YouTube video for a recipe title.
 *
 * IMPORTANT: We never let Gemini invent a youtubeUrl/video ID directly —
 * without live search grounding it has no way to know a real, current
 * video ID, so it hallucinates plausible-looking but broken links. This
 * function instead queries the actual YouTube Data API, so every link
 * returned points to a real, currently-live video.
 *
 * @param {string} recipeTitle
 * @returns {Promise<string>} A youtube.com/watch?v=... URL, or '' if
 *   no API key is configured or no result was found.
 */
export async function findRecipeVideoUrl(recipeTitle) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.info('[YouTube] YOUTUBE_API_KEY not set — skipping video lookup.');
    return '';
  }

  if (!recipeTitle || typeof recipeTitle !== 'string') {
    return '';
  }

  const cacheKey = recipeTitle.trim().toLowerCase();
  if (youtubeCache.has(cacheKey)) {
    return youtubeCache.get(cacheKey);
  }

  try {
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        key: apiKey,
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        videoEmbeddable: 'true',
        safeSearch: 'strict',
        q: `${recipeTitle} recipe`,
      },
      timeout: 8000,
    });

    const videoId = response.data?.items?.[0]?.id?.videoId;

    if (!videoId) {
      console.info(`[YouTube] No video found for "${recipeTitle}".`);
      youtubeCache.set(cacheKey, '');
      return '';
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    youtubeCache.set(cacheKey, videoUrl);
    return videoUrl;
  } catch (err) {
    console.error('[YouTube] Search failed:', err.response?.data?.error?.message || err.message);
    return '';
  }
}

/**
 * Attaches a real youtubeUrl to each recipe in parallel. Recipes that
 * already carry a curated URL (e.g. from the seeded database) are left
 * untouched — this only fills in AI-generated recipes that came back
 * with an empty/hallucinated link.
 *
 * @param {Array<Object>} recipes
 * @returns {Promise<Array<Object>>}
 */
export async function attachYoutubeLinks(recipes) {
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return recipes;
  }

  return Promise.all(
    recipes.map(async (recipe) => {
      if (recipe.youtubeUrl) {
        return recipe;
      }

      const youtubeUrl = await findRecipeVideoUrl(recipe.title);
      return { ...recipe, youtubeUrl };
    })
  );
}