// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Sparkles, Check, Plus, Trash2, ArrowRight, Wand2 } from 'lucide-react';
// import { Modal } from '../ui/Modal';
// import { PhotoDropzone } from './PhotoDropzone';
// import { detectIngredients } from '../../api/visionApi';
// import { IngredientChip } from '../ui/IngredientChip';
// import { Button } from '../ui/Button';
// import { usePantry } from '../../context/PantryContext';
// import { useToast } from '../../context/ToastContext';
// import { Skeleton } from '../ui/Skeleton';

// export function PhotoUploadModal({ isOpen, onClose }) {
//   const [step, setStep] = useState('upload'); // 'upload' | 'detecting' | 'review'
//   const [detectedChips, setDetectedChips] = useState([]);
//   const [newChipInput, setNewChipInput] = useState('');
//   const [uploadedUrl, setUploadedUrl] = useState(null);

//   const { setIngredients, ingredients } = usePantry();
//   const { addToast } = useToast();
//   const navigate = useNavigate();

//   const handleUploadComplete = async ({ url }) => {
//     setUploadedUrl(url);
//     setStep('detecting');

//     try {
//       const response = await detectIngredients(url);
//       if (response && response.ingredients) {
//         setDetectedChips(response.ingredients);
//         setStep('review');
//         addToast(`Detected ${response.ingredients.length} ingredients from your photo!`, 'success');
//       }
//     } catch (err) {
//       console.error('Vision API error:', err);
//       addToast('Could not extract ingredients. Please add manually.', 'error');
//       setStep('upload');
//     }
//   };

//   const handleRemoveChip = (name) => {
//     setDetectedChips((prev) => prev.filter((item) => item.toLowerCase() !== name.toLowerCase()));
//   };

//   const handleAddChip = (e) => {
//     if (e) e.preventDefault();
//     if (!newChipInput.trim()) return;
//     const name = newChipInput.trim();
//     if (!detectedChips.some((i) => i.toLowerCase() === name.toLowerCase())) {
//       setDetectedChips((prev) => [...prev, name]);
//       setNewChipInput('');
//     }
//   };

//   const handleConfirmAndGenerate = () => {
//     // Merge detected chips with existing pantry state
//     const merged = Array.from(new Set([...ingredients, ...detectedChips]));
//     setIngredients(merged);
//     addToast('Updated cutting board with detected ingredients!', 'success');
//     if (onClose) onClose();
//     navigate('/cook/results');
//   };

//   const handleReset = () => {
//     setStep('upload');
//     setDetectedChips([]);
//     setUploadedUrl(null);
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={() => {
//         handleReset();
//         if (onClose) onClose();
//       }}
//       title="Smart Fridge Photo Scan"
//       subtitle="Upload a photo of your open fridge or pantry shelf for instant AI ingredient detection."
//       maxWidth="max-w-3xl"
//     >
//       <div className="space-y-6">
//         {step === 'upload' && (
//           <PhotoDropzone onUploadComplete={handleUploadComplete} />
//         )}

//         {step === 'detecting' && (
//           <div className="py-12 px-6 text-center space-y-6 bg-[#FDFBF8] rounded-3xl hairline-border border-[#E7DCD1]">
//             <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full bg-[#E2673F]/20 animate-ping" />
//               <div className="relative w-12 h-12 rounded-full bg-[#E2673F] text-white flex items-center justify-center shadow-lg">
//                 <Wand2 className="w-6 h-6 animate-spin" />
//               </div>
//             </div>
//             <div>
//               <h3 className="text-xl font-serif font-medium text-[#2B2622]">
//                 Gemini Vision AI is analyzing your fridge...
//               </h3>
//               <p className="text-sm text-[#6B6259] mt-1 max-w-sm mx-auto">
//                 Identifying produce, condiments, dairy, and proteins from your uploaded photo.
//               </p>
//             </div>
//             {/* Skeletons row */}
//             <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto pt-2">
//               <Skeleton className="h-8 w-24 rounded-full" />
//               <Skeleton className="h-8 w-32 rounded-full" />
//               <Skeleton className="h-8 w-20 rounded-full" />
//               <Skeleton className="h-8 w-28 rounded-full" />
//               <Skeleton className="h-8 w-16 rounded-full" />
//             </div>
//           </div>
//         )}

//         {step === 'review' && (
//           <div className="space-y-6">
//             {/* Header info */}
//             <div className="p-4 rounded-2xl bg-amber-50/70 hairline-border border-amber-200/60 flex items-center justify-between">
//               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
//                 <Sparkles className="w-4 h-4 text-[#E2673F]" />
//                 <span>Detected {detectedChips.length} Ingredients</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="text-xs text-[#E2673F] font-semibold hover:underline"
//               >
//                 Scan another photo
//               </button>
//             </div>

//             {/* Detected Chips Grid */}
//             <motion.div className="flex flex-wrap gap-2.5 max-h-60 overflow-y-auto p-1">
//               <AnimatePresence>
//                 {detectedChips.map((chip, idx) => (
//                   <motion.div
//                     key={chip}
//                     initial={{ opacity: 0, scale: 0.7 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.7 }}
//                     transition={{ delay: idx * 0.05 }}
//                   >
//                     <IngredientChip
//                       name={chip}
//                       isDetected
//                       onRemove={handleRemoveChip}
//                     />
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </motion.div>

//             {/* Quick add missing item input */}
//             <form onSubmit={handleAddChip} className="flex gap-2">
//               <input
//                 type="text"
//                 value={newChipInput}
//                 onChange={(e) => setNewChipInput(e.target.value)}
//                 placeholder="Missed something? Add manual ingredient..."
//                 className="flex-1 px-4 py-2.5 rounded-full bg-[#FDFBF8] text-sm hairline-border border-[#E7DCD1] focus:outline-none focus:ring-2 focus:ring-[#E2673F]"
//               />
//               <Button type="submit" variant="secondary" size="sm" icon={Plus}>
//                 Add
//               </Button>
//             </form>

//             {/* Action buttons */}
//             <div className="pt-4 border-t border-[#E7DCD1] flex flex-col sm:flex-row items-center justify-between gap-3">
//               <span className="text-xs text-[#6B6259]">
//                 These items will be merged with your current cutting board.
//               </span>
//               <Button
//                 variant="primary"
//                 size="lg"
//                 icon={ArrowRight}
//                 onClick={handleConfirmAndGenerate}
//                 className="w-full sm:w-auto"
//               >
//                 Looks good — Generate recipes
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// }


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Wand2,
} from 'lucide-react';

import { Modal } from '../ui/Modal';
import { PhotoDropzone } from './PhotoDropzone';
import { detectIngredients } from '../../api/visionApi';
import { IngredientChip } from '../ui/IngredientChip';
import { Button } from '../ui/Button';
import { usePantry } from '../../context/PantryContext';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../ui/Skeleton';

export function PhotoUploadModal({ isOpen, onClose }) {
  const [step, setStep] = useState('upload');
  const [detectedChips, setDetectedChips] = useState([]);
  const [newChipInput, setNewChipInput] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const { setIngredients, ingredients } = usePantry();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleUploadComplete = async ({ url }) => {
    console.log(
      '[PhotoUploadModal] Cloudinary URL received:',
      url
    );

    if (!url) {
      addToast(
        'Cloudinary did not return an image URL.',
        'error'
      );
      return;
    }

    if (url.startsWith('blob:')) {
      console.error(
        '[PhotoUploadModal] Blob URL received:',
        url
      );

      addToast(
        'Invalid image URL. Cloudinary upload failed.',
        'error'
      );

      return;
    }

    setUploadedUrl(url);

    // Move immediately to the AI loading screen
    setStep('detecting');

    console.log(
      '[PhotoUploadModal] Sending image to Gemini Vision...'
    );

    try {
      const response = await detectIngredients(url);

      console.log(
        '[PhotoUploadModal] Gemini response:',
        response
      );

      if (
        !response ||
        !Array.isArray(response.ingredients)
      ) {
        throw new Error(
          'Gemini did not return a valid ingredient list.'
        );
      }

      if (response.ingredients.length === 0) {
        throw new Error(
          'Gemini could not detect any ingredients in this image.'
        );
      }

      setDetectedChips(response.ingredients);

      // Move from detecting → review
      setStep('review');

      addToast(
        `Detected ${response.ingredients.length} ingredients from your photo!`,
        'success'
      );
    } catch (err) {
      console.error(
        '[PhotoUploadModal] Gemini Vision error:',
        err
      );

      addToast(
        err?.message ||
          'Could not extract ingredients from the photo.',
        'error'
      );

      setStep('upload');
    }
  };

  const handleRemoveChip = (name) => {
    setDetectedChips((prev) =>
      prev.filter(
        (item) =>
          item.toLowerCase() !== name.toLowerCase()
      )
    );
  };

  const handleAddChip = (e) => {
    e.preventDefault();

    const name = newChipInput.trim();

    if (!name) return;

    const alreadyExists = detectedChips.some(
      (item) =>
        item.toLowerCase() === name.toLowerCase()
    );

    if (!alreadyExists) {
      setDetectedChips((prev) => [
        ...prev,
        name,
      ]);
    }

    setNewChipInput('');
  };

  const handleConfirmAndGenerate = () => {
    console.log(
      '[PhotoUploadModal] Generating recipes from:',
      detectedChips
    );

    const merged = Array.from(
      new Set([
        ...ingredients,
        ...detectedChips,
      ])
    );

    setIngredients(merged);

    addToast(
      'Ingredients added. Generating recipes...',
      'success'
    );

    if (onClose) {
      onClose();
    }

    navigate('/cook/results', {
      state: {
        ingredients: merged,
        imageUrl: uploadedUrl,
        aiGenerated: true,
      },
    });
  };

  const handleReset = () => {
    setStep('upload');
    setDetectedChips([]);
    setNewChipInput('');
    setUploadedUrl(null);
  };

  const handleClose = () => {
    handleReset();

    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Smart Fridge Photo Scan"
      subtitle="Upload a photo of your open fridge or pantry shelf for instant AI ingredient detection."
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">

        {/* =========================
            STEP 1 — UPLOAD
        ========================== */}

        {step === 'upload' && (
          <PhotoDropzone
            onUploadComplete={handleUploadComplete}
          />
        )}

        {/* =========================
            STEP 2 — GEMINI ANALYZING
        ========================== */}

        {step === 'detecting' && (
          <div className="py-12 px-6 text-center space-y-6 bg-[#FDFBF8] rounded-3xl border border-[#E7DCD1]">

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">

              <div className="absolute inset-0 rounded-full bg-[#E2673F]/20 animate-ping" />

              <div className="relative w-14 h-14 rounded-full bg-[#E2673F] text-white flex items-center justify-center shadow-lg">
                <Wand2 className="w-7 h-7 animate-spin" />
              </div>

            </div>

            <div>
              <h3 className="text-xl font-serif font-medium text-[#2B2622]">
                Gemini Vision AI is analyzing your fridge...
              </h3>

              <p className="text-sm text-[#6B6259] mt-2 max-w-md mx-auto">
                Gemini is identifying vegetables, fruits,
                dairy, proteins, sauces and other ingredients
                from your photo.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto pt-2">

              <Skeleton className="h-8 w-24 rounded-full" />

              <Skeleton className="h-8 w-32 rounded-full" />

              <Skeleton className="h-8 w-20 rounded-full" />

              <Skeleton className="h-8 w-28 rounded-full" />

              <Skeleton className="h-8 w-16 rounded-full" />

            </div>

            <p className="text-xs text-[#8E847A]">
              This may take a few seconds...
            </p>

          </div>
        )}

        {/* =========================
            STEP 3 — REVIEW
        ========================== */}

        {step === 'review' && (
          <div className="space-y-6">

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">

                <Sparkles className="w-4 h-4 text-[#E2673F]" />

                <span>
                  Detected {detectedChips.length} Ingredients
                </span>

              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#E2673F] font-semibold hover:underline"
              >
                Scan another photo
              </button>

            </div>

            {/* Ingredients */}

            <motion.div className="flex flex-wrap gap-2.5 max-h-60 overflow-y-auto p-1">

              <AnimatePresence>

                {detectedChips.map((chip, idx) => (

                  <motion.div
                    key={`${chip}-${idx}`}
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    transition={{
                      delay: idx * 0.05,
                    }}
                  >

                    <IngredientChip
                      name={chip}
                      isDetected
                      onRemove={handleRemoveChip}
                    />

                  </motion.div>

                ))}

              </AnimatePresence>

            </motion.div>

            {/* Add ingredient */}

            <form
              onSubmit={handleAddChip}
              className="flex gap-2"
            >

              <input
                type="text"
                value={newChipInput}
                onChange={(e) =>
                  setNewChipInput(e.target.value)
                }
                placeholder="Missed something? Add manually..."
                className="flex-1 px-4 py-2.5 rounded-full bg-[#FDFBF8] text-sm border border-[#E7DCD1] focus:outline-none focus:ring-2 focus:ring-[#E2673F]"
              />

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                icon={Plus}
              >
                Add
              </Button>

            </form>

            {/* Generate */}

            <div className="pt-4 border-t border-[#E7DCD1] flex flex-col sm:flex-row items-center justify-between gap-3">

              <span className="text-xs text-[#6B6259]">
                Gemini detected these ingredients from your photo.
              </span>

              <Button
                type="button"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={handleConfirmAndGenerate}
                className="w-full sm:w-auto"
              >
                Looks good — Generate recipes
              </Button>

            </div>

          </div>
        )}

      </div>
    </Modal>
  );
}