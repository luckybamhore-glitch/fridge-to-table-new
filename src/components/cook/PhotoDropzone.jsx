// import React, { useState, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { UploadCloud, Camera, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
// import { uploadToCloudinary } from '../../lib/cloudinaryUpload';
// import { Button } from '../ui/Button';
// import { cn } from '../../lib/cn';

// export function PhotoDropzone({ onUploadComplete, className }) {
//   const [isDragging, setIsDragging] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleFileSelect = async (file) => {
//     if (!file) return;
//     if (!file.type.startsWith('image/')) {
//       setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
//       return;
//     }

//     setErrorMsg(null);
//     setIsUploading(true);
//     setUploadProgress(0);

//     // Generate local preview URL
//     const localUrl = URL.createObjectURL(file);
//     setPreviewUrl(localUrl);

//     try {
//       const result = await uploadToCloudinary(file, (percent) => {
//         setUploadProgress(percent);
//       });

//       setIsUploading(false);
//       if (onUploadComplete) {
//         onUploadComplete({
//           url: result.url || localUrl,
//           publicId: result.publicId,
//         });
//       }
//     } catch (err) {
//       console.error('Upload failed:', err);
//       setIsUploading(false);
//       setErrorMsg('Image upload failed. Please try again.');
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileSelect(e.dataTransfer.files[0]);
//     }
//   };

//   const resetUpload = () => {
//     setPreviewUrl(null);
//     setIsUploading(false);
//     setUploadProgress(0);
//     setErrorMsg(null);
//   };

//   return (
//     <div className={cn('w-full', className)}>
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
//         className="hidden"
//       />

//       <AnimatePresence mode="wait">
//         {!previewUrl ? (
//           /* Dropzone State */
//           <motion.div
//             key="dropzone"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             onClick={() => fileInputRef.current?.click()}
//             className={cn(
//               'relative cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 flex flex-col items-center justify-center gap-4 bg-[#FDFBF8]',
//               isDragging
//                 ? 'border-[#E2673F] bg-orange-100/50 scale-[1.01] shadow-lg animate-pulse'
//                 : 'border-[#E7DCD1] hover:border-[#E2673F] hover:bg-orange-50/30'
//             )}
//           >
//             {/* Icon Badge */}
//             <div className="w-16 h-16 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center shadow-xs">
//               <UploadCloud className="w-8 h-8" />
//             </div>

//             <div>
//               <h3 className="text-lg font-serif font-medium text-[#2B2622]">
//                 Drag & drop your fridge or pantry photo
//               </h3>
//               <p className="text-xs sm:text-sm text-[#6B6259] mt-1 max-w-sm mx-auto">
//                 Supports JPG, PNG, WebP up to 10MB. Our Gemini Vision AI will scan and extract all readable ingredients.
//               </p>
//             </div>

//             <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
//               <Button variant="secondary" size="sm" icon={ImageIcon}>
//                 Browse Files
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 icon={Camera}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (fileInputRef.current) {
//                     fileInputRef.current.setAttribute('capture', 'environment');
//                     fileInputRef.current.click();
//                   }
//                 }}
//               >
//                 Snap Camera
//               </Button>
//             </div>

//             {errorMsg && (
//               <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-2">
//                 <AlertCircle className="w-3.5 h-3.5" />
//                 {errorMsg}
//               </p>
//             )}
//           </motion.div>
//         ) : (
//           /* Uploading / Preview State */
//           <motion.div
//             key="preview"
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0 }}
//             className="relative rounded-3xl overflow-hidden bg-[#2B2622] text-white p-6 hairline-border border-[#E7DCD1] shadow-xl flex flex-col items-center justify-center min-h-[300px]"
//           >
//             {/* Preview image background */}
//             <img
//               src={previewUrl}
//               alt="Fridge snapshot preview"
//               className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-xs"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

//             <div className="relative z-10 flex flex-col items-center text-center max-w-md space-y-4">
//               {isUploading ? (
//                 <>
//                   {/* Progress Ring SVG */}
//                   <div className="relative w-20 h-20 flex items-center justify-center">
//                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
//                       <path
//                         className="text-white/20"
//                         strokeWidth="3.5"
//                         stroke="currentColor"
//                         fill="none"
//                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                       />
//                       <path
//                         className="text-[#E2673F] transition-all duration-300"
//                         strokeDasharray={`${uploadProgress}, 100`}
//                         strokeWidth="3.5"
//                         strokeLinecap="round"
//                         stroke="currentColor"
//                         fill="none"
//                         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                       />
//                     </svg>
//                     <span className="absolute text-sm font-bold text-white">
//                       {uploadProgress}%
//                     </span>
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-serif font-medium text-white">
//                       Uploading to Cloudinary...
//                     </h4>
//                     <p className="text-xs text-white/70">
//                       Preparing high-res photo for Gemini Vision AI analysis
//                     </p>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
//                     <CheckCircle2 className="w-6 h-6" />
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-serif font-medium text-white">
//                       Photo Uploaded & Scanned
//                     </h4>
//                     <p className="text-xs text-white/70">
//                       Your photo is ready for ingredient extraction.
//                     </p>
//                   </div>
//                   <Button variant="ghost" size="sm" icon={RefreshCw} onClick={resetUpload} className="text-white hover:bg-white/10">
//                     Upload another photo
//                   </Button>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { uploadToCloudinary } from '../../lib/cloudinaryUpload';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';

export function PhotoDropzone({ onUploadComplete, className }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      setErrorMsg(
        'Please select a valid image file (JPG, PNG, WebP).'
      );
      return;
    }

    // Validate size
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(
        'Image must be smaller than 10MB.'
      );
      return;
    }

    setErrorMsg('');
    setIsUploading(true);
    setUploadProgress(0);

    // Local preview only
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      console.log(
        '[PhotoDropzone] Uploading image to Cloudinary...'
      );

      const result = await uploadToCloudinary(
        file,
        (percent) => {
          setUploadProgress(percent);
        }
      );

      console.log(
        '[PhotoDropzone] Cloudinary response:',
        result
      );

      /*
       * IMPORTANT
       *
       * We need a REAL Cloudinary URL.
       *
       * Never send:
       * blob:http://localhost...
       *
       * to your backend.
       */

      const cloudinaryUrl =
        result?.url ||
        result?.secure_url ||
        result?.data?.url ||
        result?.data?.secure_url;

      console.log(
        '[PhotoDropzone] Cloudinary URL:',
        cloudinaryUrl
      );

      if (!cloudinaryUrl) {
        throw new Error(
          'Cloudinary did not return an image URL.'
        );
      }

      if (
        cloudinaryUrl.startsWith('blob:') ||
        cloudinaryUrl.startsWith('data:')
      ) {
        throw new Error(
          'Invalid Cloudinary URL received.'
        );
      }

      /*
       * VERY IMPORTANT:
       *
       * Tell the parent immediately.
       *
       * The parent will change:
       *
       * upload
       *      ↓
       * detecting
       *      ↓
       * review
       *
       * PhotoDropzone itself should NOT show
       * "Photo Uploaded Successfully".
       */

      console.log(
        '[PhotoDropzone] Calling onUploadComplete...'
      );

      if (onUploadComplete) {
        await onUploadComplete({
          url: cloudinaryUrl,
          publicId:
            result?.public_id ||
            result?.publicId ||
            result?.data?.public_id ||
            result?.data?.publicId,
        });
      }

      /*
       * DO NOT set a success screen here.
       *
       * Parent component now controls the UI.
       */

    } catch (error) {
      console.error(
        '[PhotoDropzone] Upload error:',
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Image upload failed. Please try again.';

      setErrorMsg(message);
      setIsUploading(false);
    }
  };

  // ==========================================
  // DRAG EVENTS
  // ==========================================

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  // ==========================================
  // BROWSE
  // ==========================================

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // ==========================================
  // CAMERA
  // ==========================================

  const openCamera = (event) => {
    event.stopPropagation();

    if (!fileInputRef.current) return;

    fileInputRef.current.setAttribute(
      'capture',
      'environment'
    );

    fileInputRef.current.click();
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className={cn('w-full', className)}>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        onChange={(event) => {
          const file =
            event.target.files?.[0];

          if (file) {
            handleFileSelect(file);
          }

          // Allow selecting same image again
          event.target.value = '';
        }}
        className="hidden"
      />

      {/* ====================================== */}
      {/* UPLOADING */}
      {/* ====================================== */}

      {isUploading ? (
        <div className="relative overflow-hidden rounded-3xl bg-[#2B2622] min-h-[320px] flex items-center justify-center">

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Uploading fridge"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}

          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 text-center text-white space-y-5">

            <div className="w-20 h-20 mx-auto rounded-full border-4 border-white/20 flex items-center justify-center">

              <div
                className="w-16 h-16 rounded-full border-4 border-[#E2673F] border-t-transparent animate-spin"
              />

            </div>

            <div>

              <h3 className="text-xl font-serif">
                Uploading your fridge photo...
              </h3>

              <p className="text-sm text-white/70 mt-2">
                Preparing your image for Gemini Vision AI
              </p>

            </div>

            <div className="w-64 mx-auto">

              <div className="h-2 bg-white/20 rounded-full overflow-hidden">

                <div
                  className="h-full bg-[#E2673F] transition-all duration-300"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />

              </div>

              <p className="text-xs text-white/70 mt-2">
                {uploadProgress}%
              </p>

            </div>

          </div>

        </div>
      ) : (

        /* ====================================== */
        /* DROPZONE */
        /* ====================================== */

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={cn(
            'relative cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 flex flex-col items-center justify-center gap-5 bg-[#FDFBF8]',

            isDragging
              ? 'border-[#E2673F] bg-orange-100/50 scale-[1.01] shadow-lg'
              : 'border-[#E7DCD1] hover:border-[#E2673F] hover:bg-orange-50/30'
          )}
        >

          {/* Icon */}

          <div className="w-16 h-16 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center shadow-xs">

            <UploadCloud className="w-8 h-8" />

          </div>

          {/* Text */}

          <div>

            <h3 className="text-lg font-serif font-medium text-[#2B2622]">

              Drag & drop your fridge or pantry photo

            </h3>

            <p className="text-xs sm:text-sm text-[#6B6259] mt-2 max-w-sm mx-auto">

              Supports JPG, PNG and WebP up to 10MB.

              <br />

              Gemini Vision AI will identify the ingredients
              in your image.

            </p>

          </div>

          {/* Buttons */}

          <div className="flex flex-wrap items-center justify-center gap-3">

            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={ImageIcon}
              onClick={(event) => {
                event.stopPropagation();
                openFilePicker();
              }}
            >
              Browse Files
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Camera}
              onClick={openCamera}
            >
              Snap Camera
            </Button>

          </div>

          {/* Error */}

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-rose-600 font-medium mt-2">

              <AlertCircle className="w-4 h-4" />

              <span>{errorMsg}</span>

            </div>
          )}

        </div>
      )}

    </div>
  );
}