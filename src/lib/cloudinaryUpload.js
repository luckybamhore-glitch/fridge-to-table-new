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
 * Resizes and compresses an image File using HTML Canvas.
 * Reduces 10MB+ camera photos to ~300KB without losing food detection clarity,
 * preventing payload bloat and Cloudinary timeout errors.
 *
 * @param {File} file
 * @param {number} [maxWidth=1400]
 * @param {number} [maxHeight=1400]
 * @param {number} [quality=0.8]
 * @returns {Promise<string>} base64 data URI
 */
function compressImageFile(file, maxWidth = 1400, maxHeight = 1400, quality = 0.8) {
  return new Promise((resolve, reject) => {
    // If file is already very small (< 400KB), read directly without canvas overhead
    if (file.size < 400 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read image file.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Cloudinary via the backend's signed upload
 * endpoint (POST /api/vision/upload).
 *
 * @param {File} file - Image file to upload
 * @param {Function} [onProgress] - Callback for upload percentage (0-100)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, onProgress) {
  if (!file) {
    throw new Error('No file provided.');
  }

  // Compress large photo client-side before sending over network
  const base64DataUri = await compressImageFile(file);

  const response = await axiosClient.post(
    '/vision/upload',
    { image: base64DataUri },
    {
      timeout: 60000, // 60s timeout for network uploads
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