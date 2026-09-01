// import axios from 'axios';

// /**
//  * Uploads an image file to Cloudinary using an unsigned upload preset.
//  * Fallback to a mock high-res fridge image URL with simulated upload progress
//  * if Cloudinary environment parameters are not provided.
//  *
//  * @param {File} file - Image file to upload
//  * @param {Function} [onProgress] - Callback for upload percentage (0-100)
//  * @returns {Promise<{ url: string, publicId: string }>}
//  */
// export async function uploadToCloudinary(file, onProgress) {
//   const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
//   const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

//   // If Cloudinary environment variables are configured, execute real unsigned upload
//   if (cloudName && uploadPreset) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', uploadPreset);

//     try {
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total && onProgress) {
//               const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               onProgress(percentCompleted);
//             }
//           },
//         }
//       );

//       return {
//         url: response.data.secure_url,
//         publicId: response.data.public_id,
//       };
//     } catch (err) {
//       console.warn('Cloudinary upload error, falling back to local simulation:', err);
//     }
//   }

//   // Standalone / Offline Simulation Fallback
//   return new Promise((resolve) => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 15;
//       if (onProgress) onProgress(Math.min(progress, 100));

//       if (progress >= 100) {
//         clearInterval(interval);
//         // Create local object URL for preview and return mock hosted url fallback
//         const objectUrl = URL.createObjectURL(file);
//         // High quality curated fridge image for demo
//         const demoHostedUrl = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80';
        
//         resolve({
//           url: objectUrl || demoHostedUrl,
//           publicId: `mock_fridge_${Date.now()}`,
//         });
//       }
//     }, 120);
//   });
// }


import { axiosClient } from '../api/axiosClient';

/**
 * Reads a File as a base64 data URI (e.g. "data:image/jpeg;base64,...").
 * @param {File} file
 * @returns {Promise<string>}
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Cloudinary via the backend's signed upload
 * endpoint (POST /api/vision/upload).
 *
 * We deliberately do NOT upload directly to Cloudinary from the browser:
 * that requires an unsigned upload preset + exposing VITE_CLOUDINARY_*
 * env vars client-side. Routing through the backend lets us reuse the
 * CLOUDINARY_API_KEY/SECRET that are already configured server-side,
 * keeps the secret off the client, and lets us rate-limit uploads.
 *
 * On failure this throws — callers must handle the error. It never
 * silently falls back to a local blob: URL, since the backend (and
 * Gemini) can't do anything with a URL that only exists in this browser
 * tab.
 *
 * @param {File} file - Image file to upload
 * @param {Function} [onProgress] - Callback for upload percentage (0-100)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, onProgress) {
  if (!file) {
    throw new Error('No file provided.');
  }

  const base64DataUri = await fileToBase64(file);

  // Base64 data URIs report as ~33% larger than the source file; the
  // backend's JSON body limit (15mb) already accounts for this against
  // the 10MB client-side file-size cap in PhotoDropzone.
  const response = await axiosClient.post(
    '/vision/upload',
    { image: base64DataUri },
    {
      timeout: 30000, // uploads take longer than the client's 12s default
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    }
  );

  // axiosClient's response interceptor already unwraps to `.data`.
  if (!response?.url) {
    throw new Error('Upload succeeded but no image URL was returned.');
  }

  return {
    url: response.url,
    publicId: response.publicId,
  };
}