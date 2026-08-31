// import { axiosClient } from './axiosClient';
// import { MOCK_DETECTED_INGREDIENTS } from './mockData';

// /**
//  * Sends a hosted image URL to backend for Gemini Vision ingredient detection.
//  * API contract: POST /api/vision/detect { imageUrl } -> { ingredients: string[] }
//  *
//  * @param {string} imageUrl
//  * @returns {Promise<{ ingredients: string[] }>}
//  */
// export async function detectIngredients(imageUrl) {
//   try {
//     const response = await axiosClient.post('/vision/detect', { imageUrl });
//     if (response && Array.isArray(response.ingredients)) {
//       return response;
//     }
//   } catch (err) {
//     console.info('Using local mock vision detection handler:', err?.message);
//   }

//   // Realistic AI Vision simulation delay (1.5 seconds)
//   await new Promise((resolve) => setTimeout(resolve, 1500));

//   // Return realistic detected ingredients set based on mock data
//   return {
//     ingredients: [...MOCK_DETECTED_INGREDIENTS],
//   };
// }

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
    const response = await axiosClient.post('/vision/detect', {
      imageUrl,
    });

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