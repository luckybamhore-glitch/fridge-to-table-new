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
//  * @param {string} imageUrl
//  * @returns {Promise<{
//  *   base64Data: string,
//  *   mimeType: string
//  * }>}
//  */
// export async function fetchImageAsBase64(imageUrl) {
//   // -----------------------------------------
//   // Validate URL
//   // -----------------------------------------

//   if (!imageUrl) {
//     throw new Error('Image URL is required.');
//   }

//   if (typeof imageUrl !== 'string') {
//     throw new Error('Image URL must be a string.');
//   }

//   // Browser local URLs cannot be accessed by backend
//   if (imageUrl.startsWith('blob:')) {
//     throw new Error(
//       'Invalid image URL: blob URLs cannot be processed by the server.'
//     );
//   }

//   // Data URLs are not needed because we expect Cloudinary URLs
//   if (imageUrl.startsWith('data:')) {
//     throw new Error(
//       'Invalid image URL: data URLs are not supported.'
//     );
//   }

//   // Only HTTP/HTTPS URLs are accepted
//   if (
//     !imageUrl.startsWith('http://') &&
//     !imageUrl.startsWith('https://')
//   ) {
//     throw new Error(
//       'Invalid image URL. Expected a public HTTP/HTTPS URL.'
//     );
//   }

//   console.log(
//     '[CloudinaryService] Fetching image:',
//     imageUrl
//   );

//   // -----------------------------------------
//   // Download image
//   // -----------------------------------------

//   try {
//     const response = await fetch(imageUrl);

//     if (!response.ok) {
//       throw new Error(
//         `Image request failed with status ${response.status} ${response.statusText}`
//       );
//     }

//     // -----------------------------------------
//     // Check content type
//     // -----------------------------------------

//     const contentType =
//       response.headers.get('content-type') || '';

//     console.log(
//       '[CloudinaryService] Content-Type:',
//       contentType
//     );

//     if (!contentType.startsWith('image/')) {
//       throw new Error(
//         `URL did not return an image. Received Content-Type: ${contentType}`
//       );
//     }

//     // -----------------------------------------
//     // Convert response to Buffer
//     // -----------------------------------------

//     const arrayBuffer = await response.arrayBuffer();

//     const buffer = Buffer.from(arrayBuffer);

//     if (!buffer.length) {
//       throw new Error(
//         'Downloaded image is empty.'
//       );
//     }

//     console.log(
//       '[CloudinaryService] Image downloaded successfully.'
//     );

//     console.log(
//       '[CloudinaryService] Image size:',
//       buffer.length,
//       'bytes'
//     );

//     // -----------------------------------------
//     // Convert Buffer → Base64
//     // -----------------------------------------

//     const base64Data =
//       buffer.toString('base64');

//     // -----------------------------------------
//     // Return data for Gemini
//     // -----------------------------------------

//     return {
//       base64Data,
//       mimeType: contentType,
//     };

//   } catch (error) {

//     console.error(
//       '[CloudinaryService] Image download error:',
//       error.message
//     );

//     throw new Error(
//       `Could not fetch image from URL: ${error.message}`
//     );
//   }
// }

import { v2 as cloudinary } from 'cloudinary';

/**
 * cloudinaryService.js
 *
 * Handles:
 * 1. Uploading images to Cloudinary (server-side, signed — keeps the
 *    API secret off the client).
 * 2. Downloading public Cloudinary images and converting them to
 *    Base64 for Gemini Vision.
 */

let isConfigured = false;

function ensureConfigured() {
  if (isConfigured) return;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in server/.env.'
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  isConfigured = true;
}

/**
 * Uploads a base64 data URI (e.g. "data:image/jpeg;base64,...") to
 * Cloudinary using the server-side SDK (signed upload — no unsigned
 * preset needed, no secret ever reaches the browser).
 *
 * @param {string} base64DataUri
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadImageFromBase64(base64DataUri) {
  if (!base64DataUri || typeof base64DataUri !== 'string') {
    throw new Error('A base64 image data URI is required.');
  }

  if (!base64DataUri.startsWith('data:image/')) {
    throw new Error('Expected a base64 image data URI (e.g. data:image/jpeg;base64,...).');
  }

  ensureConfigured();

  try {
    const result = await cloudinary.uploader.upload(base64DataUri, {
      folder: 'fridge-to-table/pantry-scans',
      resource_type: 'image',
      // Cloudinary rejects anything that isn't actually an image, even
      // if the client-side MIME check was somehow bypassed.
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.error('[CloudinaryService] Upload failed:', err.message);
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
}

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

  console.log('[CloudinaryService] Fetching image:', imageUrl);

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

    const contentType = response.headers.get('content-type') || '';

    console.log('[CloudinaryService] Content-Type:', contentType);

    if (!contentType.startsWith('image/')) {
      throw new Error(
        `URL did not return an image. Received Content-Type: ${contentType}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      throw new Error('Downloaded image is empty.');
    }

    console.log('[CloudinaryService] Image downloaded successfully.');
    console.log('[CloudinaryService] Image size:', buffer.length, 'bytes');

    const base64Data = buffer.toString('base64');

    return {
      base64Data,
      mimeType: contentType,
    };
  } catch (error) {
    // Don't double-wrap errors we already threw above with a clear message.
    console.error('[CloudinaryService] Image download error:', error.message);
    throw error;
  }
}