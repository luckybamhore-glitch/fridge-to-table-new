// import { detectIngredientsFromImage } from '../services/geminiService.js';

// /**
//  * Controller for POST /api/vision/detect
//  * Body: { imageUrl: string }
//  */
// export async function detectIngredientsController(req, res, next) {
//   try {
//     const { imageUrl } = req.body;

//     if (!imageUrl || typeof imageUrl !== 'string') {
//       return res.status(400).json({ message: 'imageUrl string parameter is required.' });
//     }

//     const result = await detectIngredientsFromImage(imageUrl);
//     return res.status(200).json(result);
//   } catch (err) {
//     next(err);
//   }
// }


import { detectIngredientsFromImage } from '../services/geminiService.js';
import { uploadImageFromBase64 } from '../services/cloudinaryService.js';

/**
 * Controller for POST /api/vision/upload
 * Body: { image: string }  // base64 data URI, e.g. "data:image/jpeg;base64,..."
 *
 * Uploads the image to Cloudinary server-side (signed upload — the
 * API secret never leaves the backend) and returns the hosted URL.
 */
export async function uploadImageController(req, res, next) {
  try {
    const { image } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ message: 'image (base64 data URI) is required.' });
    }

    // Express is configured with a 15mb JSON body limit; base64 inflates
    // file size by ~33%, so this comfortably covers the 10MB client limit.
    const result = await uploadImageFromBase64(image);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

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