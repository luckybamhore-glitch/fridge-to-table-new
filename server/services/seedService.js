import { Recipe } from '../models/Recipe.js';
import { isMongoConnected } from '../config/db.js';

export const INITIAL_RECIPES_SEED = [
  {
    recipeId: 'recipe-1',
    title: 'Tuscan Creamy Garlic Butter Salmon',
    subtitle: 'Seared salmon fillets in a velvety sun-dried tomato and spinach cream sauce.',
    coverImageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    matchPercent: 96,
    timeMinutes: 25,
    servings: 2,
    difficulty: 'Easy',
    diet: ['Gluten-Free', 'Keto', 'Pescatarian'],
    ingredients: [
      { name: 'Salmon fillets', have: true },
      { name: 'Garlic cloves', have: true },
      { name: 'Fresh spinach', have: true },
      { name: 'Heavy cream', have: true },
      { name: 'Sun-dried tomatoes', have: true },
      { name: 'Parmesan cheese', have: false },
      { name: 'Butter & Olive oil', have: true },
      { name: 'Fresh basil', have: false },
    ],
    steps: [
      'Pat salmon fillets dry with paper towels and season both sides generously with sea salt, cracked black pepper, and garlic powder.',
      'Heat olive oil and butter in a large skillet over medium-high heat. Sear salmon for 4-5 minutes per side until golden crust forms, then remove to a warm plate.',
      'In the same skillet, saute minced garlic and chopped sun-dried tomatoes for 1 minute until fragrant.',
      'Pour in heavy cream and broth, bring to a gentle simmer, then fold in fresh spinach until wilted.',
      'Stir in freshly grated Parmesan cheese until smooth and creamy. Return salmon fillets to skillet, spooning sauce over top.',
      'Garnish with fresh basil ribbon strips and serve hot with roasted potatoes or crusty bread.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=0k6M23jZ__w',
    tips: 'Squeeze a fresh lemon wedge right before serving to cut through the rich cream sauce.'
  },
  {
    recipeId: 'recipe-2',
    title: 'Rustic Eggplant & Basil Shakshuka',
    subtitle: 'Poached eggs nestled in a spiced harissa pepper tomato jam with melted feta.',
    coverImageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1200&q=80',
    matchPercent: 92,
    timeMinutes: 30,
    servings: 3,
    difficulty: 'Medium',
    diet: ['Vegetarian', 'Gluten-Free'],
    ingredients: [
      { name: 'Eggs', have: true },
      { name: 'Ripe tomatoes', have: true },
      { name: 'Bell peppers', have: true },
      { name: 'Onion & Garlic', have: true },
      { name: 'Eggplant', have: true },
      { name: 'Cumin & Paprika', have: true },
      { name: 'Feta cheese', have: false },
      { name: 'Cilantro or Parsley', have: false },
    ],
    steps: [
      'Dice eggplant and bell peppers into bite-sized cubes. Saute in a deep cast iron skillet with olive oil until caramelized.',
      'Add finely diced onions and garlic, cooking until translucent and sweet.',
      'Toast cumin, smoked paprika, and red pepper flakes in the hot pan for 30 seconds to release aromatic oils.',
      'Add crushed San Marzano tomatoes and simmer for 15 minutes until rich, thick stew forms.',
      'Make 4-6 small wells in sauce using back of spoon. Crack fresh eggs directly into wells.',
      'Cover skillet with lid and cook on low heat for 5-7 minutes until egg whites set and yolks remain runny.',
      'Crumble fresh feta and sprinkle fresh chopped herbs on top. Serve straight out of the hot skillet.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=1KxU0dGfM4Y',
    tips: 'Pair with warm grilled sourdough or pita bread for wiping up the poached egg yolks.'
  },
  {
    recipeId: 'recipe-3',
    title: 'Charred Zucchini & Meyer Lemon Pasta',
    subtitle: 'Silky linguine tossed with golden zucchini coins, pecorino, toasted breadcrumbs, and citrus zest.',
    coverImageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281318?auto=format&fit=crop&w=1200&q=80',
    matchPercent: 88,
    timeMinutes: 20,
    servings: 4,
    difficulty: 'Easy',
    diet: ['Vegetarian'],
    ingredients: [
      { name: 'Zucchini', have: true },
      { name: 'Pasta (Linguine or Spaghetti)', have: true },
      { name: 'Lemon (Zest & Juice)', have: true },
      { name: 'Garlic', have: true },
      { name: 'Pecorino Romano or Parmesan', have: false },
      { name: 'Olive oil', have: true },
      { name: 'Panko breadcrumbs', have: false },
      { name: 'Red chili flakes', have: true },
    ],
    steps: [
      'Bring a large pot of heavily salted water to boil. Cook pasta 1 minute short of al dente, reserving 1 cup of starchy pasta water.',
      'Slice zucchini into thin rounds. Heat olive oil in a wide pan and sear zucchini undisturbed until deep golden char develops.',
      'Add thin garlic slices and chili flakes to zucchini pan for 1 minute.',
      'Transfer cooked pasta directly to zucchini skillet. Splash in starchy pasta water, lemon zest, and lemon juice.',
      'Toss vigorously off heat while adding finely grated Pecorino until an emulsified cream sauce coats pasta.',
      'Top with crispy butter-toasted panko breadcrumbs and cracked black pepper.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=5_d4tMup0_Y',
    tips: 'Reserving pasta water is crucial—the starch binds with olive oil and cheese to create a restaurant sauce.'
  },
  {
    recipeId: 'recipe-4',
    title: 'Crispy Honey-Glazed Chicken & Avocado Bowl',
    subtitle: 'Pan-seared tender chicken thighs coated in chili-honey glaze served over warm rice and sliced avocado.',
    coverImageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    matchPercent: 85,
    timeMinutes: 25,
    servings: 2,
    difficulty: 'Easy',
    diet: ['Gluten-Free', 'High-Protein'],
    ingredients: [
      { name: 'Chicken thighs', have: true },
      { name: 'Avocado', have: true },
      { name: 'Jasmine rice', have: true },
      { name: 'Honey', have: true },
      { name: 'Soy sauce or Tamari', have: true },
      { name: 'Lime', have: true },
      { name: 'Sesame seeds', have: false },
      { name: 'Green onions', have: false },
    ],
    steps: [
      'Cook Jasmine rice according to package directions or use leftover cold rice.',
      'Whisk honey, soy sauce, lime juice, and garlic in a bowl for glaze.',
      'Season bite-sized chicken pieces with salt, pepper, and cornstarch for extra crispiness.',
      'Sear chicken in hot oil until crispy and fully cooked (about 7-8 minutes).',
      'Pour glaze into pan, letting it bubble and reduce into a shiny coating over chicken.',
      'Assemble bowls with warm rice, honey-glazed chicken, sliced avocado, and garnish with sesame seeds.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=wX-y0E-eZ2c',
    tips: 'Use boneless skinless chicken thighs instead of breasts for juicy tenderness and rich flavor.'
  },
  {
    recipeId: 'recipe-5',
    title: 'Herb-Roasted Mushroom & Burrata Tartine',
    subtitle: 'Crusty sourdough piled high with thyme-charred wild mushrooms, garlic butter, and creamy burrata.',
    coverImageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80',
    matchPercent: 81,
    timeMinutes: 15,
    servings: 2,
    difficulty: 'Easy',
    diet: ['Vegetarian'],
    ingredients: [
      { name: 'Mushrooms (Cremini or Oyster)', have: true },
      { name: 'Sourdough bread', have: true },
      { name: 'Burrata or Fresh Mozzarella', have: false },
      { name: 'Butter & Garlic', have: true },
      { name: 'Fresh Thyme', have: true },
      { name: 'Balsamic glaze', have: false },
    ],
    steps: [
      'Thickly slice sourdough bread and rub with raw garlic clove before grilling with olive oil until toasted.',
      'Tear mushrooms into uneven clusters. Saute in hot butter and thyme leaves until browned and crispy at edges.',
      'Tear open burrata ball and spread creamy center evenly over warm toasted bread.',
      'Spoon hot garlic mushrooms over burrata, drizzle with aged balsamic glaze, and sprinkle with flaky sea salt.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=N43W57-v3G8',
    tips: 'Do not overcrowd mushrooms in skillet; letting them sear undisturbed creates deep caramelized umami.'
  },
  {
    recipeId: 'recipe-6',
    title: 'Mediterranean Chickpea & Cucumber Salad',
    subtitle: 'Crisp English cucumbers, juicy cherry tomatoes, kalamata olives, and chickpeas in lemon-oregano vinaigrette.',
    coverImageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    matchPercent: 78,
    timeMinutes: 10,
    servings: 4,
    difficulty: 'Easy',
    diet: ['Vegan', 'Gluten-Free', 'Dairy-Free'],
    ingredients: [
      { name: 'Chickpeas', have: true },
      { name: 'Cucumber', have: true },
      { name: 'Cherry tomatoes', have: true },
      { name: 'Red onion', have: true },
      { name: 'Kalamata olives', have: false },
      { name: 'Olive oil & Lemon juice', have: true },
      { name: 'Dried oregano', have: true },
    ],
    steps: [
      'Drain and rinse canned chickpeas thoroughly, pat dry with paper towels.',
      'Dice cucumbers, halved cherry tomatoes, and thinly slice red onion.',
      'Whisk extra virgin olive oil, fresh lemon juice, crushed garlic, dried oregano, salt, and pepper in a large salad bowl.',
      'Add chickpeas, vegetables, and olives. Toss well and let marinate 10 minutes before serving.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=4Ym4s7qE15g',
    tips: 'This salad keeps crisp in the fridge for up to 3 days and gets even better as ingredients marinate.'
  }
];

// In-memory collection fallback
export let inMemoryRecipes = [...INITIAL_RECIPES_SEED];

export async function seedInitialRecipes() {
  if (isMongoConnected) {
    try {
      const count = await Recipe.countDocuments();
      if (count === 0) {
        await Recipe.insertMany(INITIAL_RECIPES_SEED);
        console.log(`[SeedService] Pre-populated MongoDB with ${INITIAL_RECIPES_SEED.length} boutique recipes.`);
      }
    } catch (err) {
      console.error('[SeedService] Error seeding MongoDB:', err.message);
    }
  } else {
    inMemoryRecipes = [...INITIAL_RECIPES_SEED];
  }
}
