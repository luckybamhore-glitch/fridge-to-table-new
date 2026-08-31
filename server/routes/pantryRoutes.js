import { Router } from 'express';
import { protect, requireDB } from '../middleware/auth.js';
import {
  getPantry,
  addPantryItem,
  removePantryItem,
  replacePantry,
} from '../controllers/pantryController.js';

const router = Router();

router.use(requireDB, protect);

router.get('/', getPantry);
router.post('/', addPantryItem);
router.put('/', replacePantry);
router.delete('/:name', removePantryItem);

export default router;
