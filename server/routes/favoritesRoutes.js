import { Router } from 'express';
import { protect, requireDB } from '../middleware/auth.js';
import { getFavorites, toggleFavorite } from '../controllers/favoritesController.js';

const router = Router();

router.use(requireDB, protect);

router.get('/', getFavorites);
router.post('/:recipeId/toggle', toggleFavorite);

export default router;
