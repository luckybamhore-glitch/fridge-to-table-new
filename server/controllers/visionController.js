import { detectIngredientsFromImage } from '../services/geminiService.js';

/**
 * Controller for POST /api/vision/detect
 * Body: { imageUrl: string }
 */
export async function detectIngredientsController(req, res, next) {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ message: 'imageUrl string parameter is required.' });
    }

    const result = await detectIngredientsFromImage(imageUrl);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
