import { axiosClient } from './axiosClient';

/**
 * Sends a Cloudinary-hosted image URL to the backend.
 *
 * Backend:
 * POST /api/vision/detect
 *
 * Body:
 * {
 *   imageUrl: "https://res.cloudinary.com/..."
 * }
 *
 * Response:
 * {
 *   ingredients: ["Tomato", "Onion", "Milk"]
 * }
 */
export async function detectIngredients(imageUrl) {
  if (!imageUrl) {
    throw new Error('Image URL is required.');
  }

  // Never send a browser-only blob URL to the backend.
  if (imageUrl.startsWith('blob:')) {
    throw new Error(
      'Invalid image URL. Please upload the image to Cloudinary first.'
    );
  }

  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    throw new Error(
      'Invalid image URL. Expected a Cloudinary HTTP/HTTPS URL.'
    );
  }

  console.log('[Vision API] Sending image to backend:');
  console.log(imageUrl);

  try {
    const response = await axiosClient.post(
      '/vision/detect',
      { imageUrl },
      {
        // axiosClient's default timeout (12s) is too short for Gemini
        // Vision — especially now that the backend retries once or
        // twice on transient 503s before giving up. 45s covers a full
        // retry cycle with margin.
        timeout: 45000,
      }
    );

    console.log('[Vision API] Backend response:', response);

    if (!response || !Array.isArray(response.ingredients)) {
      throw new Error(
        'Backend returned an invalid ingredient response.'
      );
    }

    return {
      ingredients: response.ingredients,
    };
  } catch (err) {
    console.error(
      '[Vision API] Ingredient detection failed:',
      err
    );

    // IMPORTANT:
    // Do NOT return mock ingredients here.
    // We want the real Gemini error to reach PhotoUploadModal.
    throw err;
  }
}