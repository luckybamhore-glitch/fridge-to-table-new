import { Router } from 'express';
import {
  generateRecipesController,
  getRecipeByIdController,
  seedRecipesController,
} from '../controllers/recipeController.js';

const router = Router();

// POST /api/recipes/generate
router.post('/generate', generateRecipesController);

// POST /api/recipes/seed
router.post('/seed', seedRecipesController);

// GET /api/recipes/:id
router.get('/:id', getRecipeByIdController);

export default router;
