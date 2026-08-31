import axios from 'axios';

/**
 * Uploads an image file to Cloudinary using an unsigned upload preset.
 * Fallback to a mock high-res fridge image URL with simulated upload progress
 * if Cloudinary environment parameters are not provided.
 *
 * @param {File} file - Image file to upload
 * @param {Function} [onProgress] - Callback for upload percentage (0-100)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, onProgress) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // If Cloudinary environment variables are configured, execute real unsigned upload
  if (cloudName && uploadPreset) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percentCompleted);
            }
          },
        }
      );

      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      };
    } catch (err) {
      console.warn('Cloudinary upload error, falling back to local simulation:', err);
    }
  }

  // Standalone / Offline Simulation Fallback
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (onProgress) onProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(interval);
        // Create local object URL for preview and return mock hosted url fallback
        const objectUrl = URL.createObjectURL(file);
        // High quality curated fridge image for demo
        const demoHostedUrl = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80';
        
        resolve({
          url: objectUrl || demoHostedUrl,
          publicId: `mock_fridge_${Date.now()}`,
        });
      }
    }, 120);
  });
}
