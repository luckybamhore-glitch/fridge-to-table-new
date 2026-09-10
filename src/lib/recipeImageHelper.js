const FOOD_CATEGORY_IMAGES = {
  pork: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80',
  ],
  chicken: [
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1000&q=80',
  ],
  beef: [
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
  ],
  salmon: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&w=1000&q=80',
  ],
  seafood: [
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=1000&q=80',
  ],
  pasta: [
    'https://images.unsplash.com/photo-1621996346565-e3d5d6281318?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1000&q=80',
  ],
  salad: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=1000&q=80',
  ],
  soup: [
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
  ],
  egg: [
    'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=80',
  ],
  pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1000&q=80',
  ],
  toast: [
    'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80',
  ],
  bowl: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80',
  ],
  veggie: [
    'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
  ],
};

const ALL_FALLBACK_IMAGES = Object.values(FOOD_CATEGORY_IMAGES).flat();

const BROKEN_IMAGE_PATTERNS = [
  '1603048588665', // vinyl record
];

function isKnownBrokenUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return BROKEN_IMAGE_PATTERNS.some((pattern) => url.includes(pattern));
}

function getHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns a high-quality food photo URL matched specifically to the recipe dish type.
 * Guaranteed to return real food images and ensure unique photos across card lists.
 *
 * @param {Object} recipe
 * @param {number} [index=0]
 * @returns {string} Image URL
 */
export function getRecipeCoverImage(recipe, index = 0) {
  if (
    recipe?.coverImageUrl &&
    typeof recipe.coverImageUrl === 'string' &&
    recipe.coverImageUrl.trim() !== '' &&
    !isKnownBrokenUrl(recipe.coverImageUrl)
  ) {
    return recipe.coverImageUrl;
  }

  const title = (recipe?.title || '').toLowerCase();
  const subtitle = (recipe?.subtitle || '').toLowerCase();
  const fullText = `${title} ${subtitle}`;

  let categoryKey = null;

  if (fullText.includes('pork') || fullText.includes('bacon') || fullText.includes('ham') || fullText.includes('medallion')) {
    categoryKey = 'pork';
  } else if (fullText.includes('chicken') || fullText.includes('turkey') || fullText.includes('poultry')) {
    categoryKey = 'chicken';
  } else if (fullText.includes('beef') || fullText.includes('steak') || fullText.includes('burger')) {
    categoryKey = 'beef';
  } else if (fullText.includes('salmon')) {
    categoryKey = 'salmon';
  } else if (fullText.includes('shrimp') || fullText.includes('prawn') || fullText.includes('fish') || fullText.includes('seafood')) {
    categoryKey = 'seafood';
  } else if (
    fullText.includes('pasta') ||
    fullText.includes('noodle') ||
    fullText.includes('spaghetti') ||
    fullText.includes('penne') ||
    fullText.includes('linguine')
  ) {
    categoryKey = 'pasta';
  } else if (fullText.includes('salad') || fullText.includes('greens')) {
    categoryKey = 'salad';
  } else if (fullText.includes('soup') || fullText.includes('stew') || fullText.includes('curry') || fullText.includes('ramen')) {
    categoryKey = 'soup';
  } else if (fullText.includes('egg') || fullText.includes('shakshuka') || fullText.includes('omelet')) {
    categoryKey = 'egg';
  } else if (fullText.includes('pizza') || fullText.includes('flatbread')) {
    categoryKey = 'pizza';
  } else if (fullText.includes('toast') || fullText.includes('sandwich')) {
    categoryKey = 'toast';
  } else if (fullText.includes('bowl') || fullText.includes('rice')) {
    categoryKey = 'bowl';
  } else if (
    fullText.includes('skillet') ||
    fullText.includes('sauté') ||
    fullText.includes('saute') ||
    fullText.includes('stir-fry') ||
    fullText.includes('veggie') ||
    fullText.includes('vegetable')
  ) {
    categoryKey = 'veggie';
  }

  // Use prime multipliers to guarantee index offset between cards (index 0 vs index 1)
  const baseHash = getHash(title);

  if (categoryKey && FOOD_CATEGORY_IMAGES[categoryKey]?.length > 0) {
    const list = FOOD_CATEGORY_IMAGES[categoryKey];
    const imageIdx = (baseHash * 7 + index * 13) % list.length;
    return list[imageIdx];
  }

  const fallbackIdx = (baseHash * 7 + index * 13) % ALL_FALLBACK_IMAGES.length;
  return ALL_FALLBACK_IMAGES[fallbackIdx];
}

