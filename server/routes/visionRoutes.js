import { Router } from 'express';
import { detectIngredientsController } from '../controllers/visionController.js';

const router = Router();

// POST /api/vision/detect
router.post('/detect', detectIngredientsController);

export default router;
