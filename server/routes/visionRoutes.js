import { Router } from 'express';
import { detectIngredientsController, uploadImageController } from '../controllers/visionController.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/vision/upload — image (base64) -> Cloudinary-hosted URL
router.post('/upload', uploadLimiter, uploadImageController);

// POST /api/vision/detect
router.post('/detect', detectIngredientsController);

export default router;