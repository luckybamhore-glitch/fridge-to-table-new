// import { v2 as cloudinary } from 'cloudinary';
// import axios from 'axios';

// // Configure Cloudinary if credentials present
// if (process.env.CLOUDINARY_CLOUD_NAME) {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
// }

// /**
//  * Downloads an image from hosted Cloudinary/HTTP URL and returns base64 buffer with MIME type.
//  *
//  * @param {string} imageUrl
//  * @returns {Promise<{ base64Data: string, mimeType: string }>}
//  */
// export async function fetchImageAsBase64(imageUrl) {
//   try {
//     const response = await axios.get(imageUrl, {
//       responseType: 'arraybuffer',
//       timeout: 8000,
//     });

//     const contentType = response.headers['content-type'] || 'image/jpeg';
//     const base64Data = Buffer.from(response.data, 'binary').toString('base64');

//     return {
//       base64Data,
//       mimeType: contentType,
//     };
//   } catch (err) {
//     console.error('[CloudinaryService] Failed to download image:', err.message);
//     throw new Error(`Could not fetch image from URL: ${imageUrl}`);
//   }
// }


/**
 * cloudinaryService.js
 *
 * Handles downloading public images and converting them
 * into Base64 data for Gemini Vision.
 */

/**
 * Fetch an image from a public URL and convert it to Base64.
 *
 * @param {string} imageUrl
 * @returns {Promise<{
 *   base64Data: string,
 *   mimeType: string
 * }>}
 */
export async function fetchImageAsBase64(imageUrl) {
  // -----------------------------------------
  // Validate URL
  // -----------------------------------------

  if (!imageUrl) {
    throw new Error('Image URL is required.');
  }

  if (typeof imageUrl !== 'string') {
    throw new Error('Image URL must be a string.');
  }

  // Browser local URLs cannot be accessed by backend
  if (imageUrl.startsWith('blob:')) {
    throw new Error(
      'Invalid image URL: blob URLs cannot be processed by the server.'
    );
  }

  // Data URLs are not needed because we expect Cloudinary URLs
  if (imageUrl.startsWith('data:')) {
    throw new Error(
      'Invalid image URL: data URLs are not supported.'
    );
  }

  // Only HTTP/HTTPS URLs are accepted
  if (
    !imageUrl.startsWith('http://') &&
    !imageUrl.startsWith('https://')
  ) {
    throw new Error(
      'Invalid image URL. Expected a public HTTP/HTTPS URL.'
    );
  }

  console.log(
    '[CloudinaryService] Fetching image:',
    imageUrl
  );

  // -----------------------------------------
  // Download image
  // -----------------------------------------

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Image request failed with status ${response.status} ${response.statusText}`
      );
    }

    // -----------------------------------------
    // Check content type
    // -----------------------------------------

    const contentType =
      response.headers.get('content-type') || '';

    console.log(
      '[CloudinaryService] Content-Type:',
      contentType
    );

    if (!contentType.startsWith('image/')) {
      throw new Error(
        `URL did not return an image. Received Content-Type: ${contentType}`
      );
    }

    // -----------------------------------------
    // Convert response to Buffer
    // -----------------------------------------

    const arrayBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      throw new Error(
        'Downloaded image is empty.'
      );
    }

    console.log(
      '[CloudinaryService] Image downloaded successfully.'
    );

    console.log(
      '[CloudinaryService] Image size:',
      buffer.length,
      'bytes'
    );

    // -----------------------------------------
    // Convert Buffer → Base64
    // -----------------------------------------

    const base64Data =
      buffer.toString('base64');

    // -----------------------------------------
    // Return data for Gemini
    // -----------------------------------------

    return {
      base64Data,
      mimeType: contentType,
    };

  } catch (error) {

    console.error(
      '[CloudinaryService] Image download error:',
      error.message
    );

    throw new Error(
      `Could not fetch image from URL: ${error.message}`
    );
  }
}