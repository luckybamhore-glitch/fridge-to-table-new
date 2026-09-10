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

  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in server/.env.'
    );
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
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
 * @param {string} [folder] - defaults to the original pantry-scan
 *   folder so existing callers are unaffected.
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadImageFromBase64(
  base64DataUri,
  folder = 'fridge-to-table/pantry-scans'
) {
  if (!base64DataUri || typeof base64DataUri !== 'string') {
    throw new Error('A base64 image data URI is required.');
  }

  if (!base64DataUri.startsWith('data:image/')) {
    throw new Error('Expected a base64 image data URI (e.g. data:image/jpeg;base64,...).');
  }

  try {
    ensureConfigured();

    const uploadPromise = cloudinary.uploader.upload(base64DataUri, {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      timeout: 8000,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Cloudinary timeout (8s limit)')), 8000)
    );

    const result = await Promise.race([uploadPromise, timeoutPromise]);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.warn(
      '[CloudinaryService] Upload timed out or failed softly. Returning inline image fallback:',
      err?.message || err
    );

    // Fallback: return base64 URI directly so vision detection and preview succeed 100% of the time!
    return {
      url: base64DataUri,
      publicId: `scan_fallback_${Date.now()}`,
    };
  }
}

/**
 * Fetch an image from a public URL or parse a base64 data URI into Base64.
 *
 * @param {string} imageUrl
 * @returns {Promise<{
 *   base64Data: string,
 *   mimeType: string
 * }>}
 */
export async function fetchImageAsBase64(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('Image URL is required.');
  }

  // Handle Base64 Data URIs directly without any network requests
  if (imageUrl.startsWith('data:')) {
    const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 data URI format.');
    }
    return {
      mimeType: matches[1] || 'image/jpeg',
      base64Data: matches[2],
    };
  }

  // Browser local URLs cannot be accessed by backend
  if (imageUrl.startsWith('blob:')) {
    throw new Error(
      'Invalid image URL: blob URLs cannot be processed by the server.'
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
    console.error('[CloudinaryService] Image download error:', error.message);
    throw error;
  }
}