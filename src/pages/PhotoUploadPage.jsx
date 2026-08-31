// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Camera, Sparkles, Wand2, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
// import { SectionEyebrow } from '../components/ui/SectionEyebrow';
// import { PhotoDropzone } from '../components/cook/PhotoDropzone';
// import { detectIngredients } from '../api/visionApi';
// import { IngredientChip } from '../components/ui/IngredientChip';
// import { Button } from '../components/ui/Button';
// import { usePantry } from '../context/PantryContext';
// import { useToast } from '../context/ToastContext';
// import { Skeleton } from '../components/ui/Skeleton';

// export function PhotoUploadPage() {
//   const [step, setStep] = useState('upload'); // 'upload' | 'detecting' | 'review'
//   const [detectedChips, setDetectedChips] = useState([]);
//   const [manualInput, setManualInput] = useState('');
//   const { ingredients, setIngredients } = usePantry();
//   const { addToast } = useToast();
//   const navigate = useNavigate();

//   const handleUploadComplete = async ({ url }) => {
//     setStep('detecting');
//     try {
//       const response = await detectIngredients(url);
//       if (response && response.ingredients) {
//         setDetectedChips(response.ingredients);
//         setStep('review');
//         addToast(`Detected ${response.ingredients.length} items from your photo!`, 'success');
//       }
//     } catch (err) {
//       console.error(err);
//       addToast('Detection failed. Please add ingredients manually.', 'error');
//       setStep('upload');
//     }
//   };

//   const handleRemoveChip = (name) => {
//     setDetectedChips((prev) => prev.filter((item) => item.toLowerCase() !== name.toLowerCase()));
//   };

//   const handleAddChip = (e) => {
//     if (e) e.preventDefault();
//     if (!manualInput.trim()) return;
//     const name = manualInput.trim();
//     if (!detectedChips.some((i) => i.toLowerCase() === name.toLowerCase())) {
//       setDetectedChips((prev) => [...prev, name]);
//       setManualInput('');
//     }
//   };

//   const handleGenerate = () => {
//     const merged = Array.from(new Set([...ingredients, ...detectedChips]));
//     setIngredients(merged);
//     addToast('Ingredients saved to cutting board!', 'success');
//     navigate('/cook/results');
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 15 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
//     >
//       {/* Navigation Back */}
//       <div className="flex items-center justify-between">
//         <button
//           type="button"
//           onClick={() => navigate('/cook')}
//           className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B6259] hover:text-[#2B2622] transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Cutting Board
//         </button>
//       </div>

//       <div className="bg-[#FDFBF8] p-8 sm:p-12 rounded-3xl hairline-border border-[#E7DCD1] shadow-xs space-y-8">
//         <div className="text-center max-w-xl mx-auto space-y-3">
//           <SectionEyebrow icon={Camera} className="justify-center">
//             SMART FRIDGE PHOTO AI
//           </SectionEyebrow>
//           <h1 className="text-3xl sm:text-4xl font-serif text-[#2B2622] font-normal">
//             Upload your <span className="serif-italic text-[#E2673F]">fridge photo</span>
//           </h1>
//           <p className="text-sm text-[#6B6259]">
//             Drag & drop or snap a picture of your open fridge, freezer, or pantry shelf. Gemini Vision AI will automatically detect ingredients.
//           </p>
//         </div>

//         {step === 'upload' && (
//           <PhotoDropzone onUploadComplete={handleUploadComplete} />
//         )}

//         {step === 'detecting' && (
//           <div className="py-12 text-center space-y-6">
//             <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full bg-[#E2673F]/20 animate-ping" />
//               <div className="relative w-12 h-12 rounded-full bg-[#E2673F] text-white flex items-center justify-center shadow-lg">
//                 <Wand2 className="w-6 h-6 animate-spin" />
//               </div>
//             </div>
//             <div>
//               <h3 className="text-xl font-serif text-[#2B2622]">
//                 Extracting ingredients with Gemini Vision...
//               </h3>
//               <p className="text-sm text-[#6B6259] mt-1">
//                 Scanning produce, proteins, condiments, and dairy items.
//               </p>
//             </div>
//             <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto pt-2">
//               <Skeleton className="h-8 w-24 rounded-full" />
//               <Skeleton className="h-8 w-32 rounded-full" />
//               <Skeleton className="h-8 w-20 rounded-full" />
//             </div>
//           </div>
//         )}

//         {step === 'review' && (
//           <div className="space-y-6 pt-4 border-t border-[#E7DCD1]">
//             <div className="p-4 rounded-2xl bg-amber-50/70 hairline-border border-amber-200/60 flex items-center justify-between">
//               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
//                 <Sparkles className="w-4 h-4 text-[#E2673F]" />
//                 <span>Detected {detectedChips.length} Ingredients</span>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setStep('upload')}
//                 className="text-xs text-[#E2673F] font-semibold hover:underline"
//               >
//                 Upload different photo
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-2.5 min-h-[100px]">
//               <AnimatePresence>
//                 {detectedChips.map((chip) => (
//                   <IngredientChip
//                     key={chip}
//                     name={chip}
//                     isDetected
//                     onRemove={handleRemoveChip}
//                   />
//                 ))}
//               </AnimatePresence>
//             </div>

//             <form onSubmit={handleAddChip} className="flex gap-2">
//               <input
//                 type="text"
//                 value={manualInput}
//                 onChange={(e) => setManualInput(e.target.value)}
//                 placeholder="Missed an item? Add manually..."
//                 className="flex-1 px-4 py-2.5 rounded-full bg-white text-sm hairline-border border-[#E7DCD1] focus:outline-none focus:ring-2 focus:ring-[#E2673F]"
//               />
//               <Button type="submit" variant="secondary" size="sm" icon={Plus}>
//                 Add
//               </Button>
//             </form>

//             <div className="pt-4 border-t border-[#E7DCD1] flex justify-end">
//               <Button
//                 variant="primary"
//                 size="lg"
//                 icon={ArrowRight}
//                 onClick={handleGenerate}
//               >
//                 Looks good — Generate recipes
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// }



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  Wand2,
  Plus,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { SectionEyebrow } from '../components/ui/SectionEyebrow';
import { PhotoDropzone } from '../components/cook/PhotoDropzone';
import { detectIngredients } from '../api/visionApi';
import { IngredientChip } from '../components/ui/IngredientChip';
import { Button } from '../components/ui/Button';
import { usePantry } from '../context/PantryContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from '../components/ui/Skeleton';

export function PhotoUploadPage() {
  const navigate = useNavigate();

  const { ingredients, setIngredients } = usePantry();
  const { addToast } = useToast();

  const [step, setStep] = useState('upload');
  const [detectedChips, setDetectedChips] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  /*
   * ---------------------------------------------------------
   * STEP 1
   * Cloudinary upload completed.
   *
   * PhotoDropzone sends:
   *
   * {
   *   url: "https://res.cloudinary.com/..."
   * }
   *
   * We then send that URL to the backend.
   * ---------------------------------------------------------
   */
  const handleUploadComplete = async ({ url }) => {
    console.log('======================================');
    console.log('[PhotoUploadPage] Upload completed');
    console.log('[PhotoUploadPage] Image URL:', url);
    console.log('======================================');

    setErrorMessage('');

    if (!url) {
      console.error(
        '[PhotoUploadPage] No image URL received.'
      );

      setErrorMessage(
        'No image URL was received from Cloudinary.'
      );

      addToast(
        'Image upload completed, but no image URL was returned.',
        'error'
      );

      setStep('upload');
      return;
    }

    /*
     * Backend cannot access browser blob URLs.
     *
     * We require a real Cloudinary HTTPS URL.
     */
    if (
      url.startsWith('blob:') ||
      url.startsWith('data:')
    ) {
      console.error(
        '[PhotoUploadPage] Invalid image URL:',
        url
      );

      setErrorMessage(
        'Invalid image URL. Please upload the image again.'
      );

      addToast(
        'Invalid image URL received.',
        'error'
      );

      setStep('upload');
      return;
    }

    setImageUrl(url);

    /*
     * Move UI to Gemini analyzing state.
     */
    setStep('detecting');

    try {
      console.log(
        '[PhotoUploadPage] Sending image to Gemini Vision...'
      );

      /*
       * Send Cloudinary URL to backend.
       *
       * POST /api/vision/detect
       *
       * {
       *   imageUrl: "https://res.cloudinary.com/..."
       * }
       */
      const response = await detectIngredients(url);

      console.log(
        '[PhotoUploadPage] Gemini response:',
        response
      );

      /*
       * Validate response.
       */
      if (
        !response ||
        !Array.isArray(response.ingredients)
      ) {
        throw new Error(
          'Invalid response received from Gemini Vision.'
        );
      }

      /*
       * Remove empty values and duplicates.
       */
      const cleanedIngredients = Array.from(
        new Set(
          response.ingredients
            .map((item) => String(item).trim())
            .filter(Boolean)
        )
      );

      console.log(
        '[PhotoUploadPage] Clean ingredients:',
        cleanedIngredients
      );

      /*
       * Even if Gemini detects nothing, show the review
       * screen so the user can add ingredients manually.
       */
      setDetectedChips(cleanedIngredients);

      setStep('review');

      if (cleanedIngredients.length > 0) {
        addToast(
          `Detected ${cleanedIngredients.length} ingredients from your photo!`,
          'success'
        );
      } else {
        addToast(
          'No ingredients were detected. You can add them manually.',
          'error'
        );
      }
    } catch (error) {
      console.error(
        '[PhotoUploadPage] Gemini Vision error:',
        error
      );

      const message =
        error?.message ||
        'Could not detect ingredients from this image.';

      setErrorMessage(message);

      /*
       * Go to review instead of upload.
       *
       * This allows the user to manually enter ingredients.
       */
      setDetectedChips([]);
      setStep('review');

      addToast(
        'AI detection failed. You can add ingredients manually.',
        'error'
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * Remove detected ingredient
   * ---------------------------------------------------------
   */
  const handleRemoveChip = (name) => {
    setDetectedChips((previous) =>
      previous.filter(
        (item) =>
          item.toLowerCase() !== name.toLowerCase()
      )
    );
  };

  /*
   * ---------------------------------------------------------
   * Add ingredient manually
   * ---------------------------------------------------------
   */
  const handleAddChip = (event) => {
    event.preventDefault();

    const value = manualInput.trim();

    if (!value) {
      return;
    }

    const alreadyExists = detectedChips.some(
      (item) =>
        item.toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) {
      addToast(
        `${value} is already in your ingredients.`,
        'error'
      );

      setManualInput('');
      return;
    }

    setDetectedChips((previous) => [
      ...previous,
      value,
    ]);

    setManualInput('');
  };

  /*
   * ---------------------------------------------------------
   * Generate recipes
   *
   * Merge:
   *
   * Existing pantry ingredients
   * +
   * Gemini detected ingredients
   * +
   * Manually added ingredients
   *
   * Then navigate to recipe results.
   * ---------------------------------------------------------
   */
  const handleGenerate = () => {
    if (detectedChips.length === 0) {
      addToast(
        'Please add at least one ingredient before generating recipes.',
        'error'
      );

      return;
    }

    const merged = Array.from(
      new Set([
        ...ingredients,
        ...detectedChips,
      ])
    );

    console.log(
      '[PhotoUploadPage] Final ingredients:',
      merged
    );

    setIngredients(merged);

    addToast(
      'Ingredients saved! Generating recipes...',
      'success'
    );

    navigate('/cook/results');
  };

  /*
   * ---------------------------------------------------------
   * Upload another image
   * ---------------------------------------------------------
   */
  const handleUploadAnother = () => {
    setDetectedChips([]);
    setManualInput('');
    setImageUrl(null);
    setErrorMessage('');
    setStep('upload');
  };

  /*
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
      }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* ------------------------------------------------ */}
      {/* Back navigation */}
      {/* ------------------------------------------------ */}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/cook')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B6259] hover:text-[#2B2622] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />

          Back to Cutting Board
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* Main card */}
      {/* ------------------------------------------------ */}

      <div className="bg-[#FDFBF8] p-8 sm:p-12 rounded-3xl hairline-border border-[#E7DCD1] shadow-xs space-y-8">

        {/* ------------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------------ */}

        <div className="text-center max-w-xl mx-auto space-y-3">

          <SectionEyebrow
            icon={Camera}
            className="justify-center"
          >
            SMART FRIDGE PHOTO AI
          </SectionEyebrow>

          <h1 className="text-3xl sm:text-4xl font-serif text-[#2B2622] font-normal">
            Upload your{' '}
            <span className="serif-italic text-[#E2673F]">
              fridge photo
            </span>
          </h1>

          <p className="text-sm text-[#6B6259]">
            Drag & drop or snap a picture of your open
            fridge, freezer, or pantry shelf. Gemini Vision
            AI will automatically detect ingredients.
          </p>

        </div>

        {/* ================================================= */}
        {/* STEP 1 — UPLOAD */}
        {/* ================================================= */}

        {step === 'upload' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <PhotoDropzone
              onUploadComplete={
                handleUploadComplete
              }
            />

            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />

                <span>{errorMessage}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* ================================================= */}
        {/* STEP 2 — GEMINI DETECTION */}
        {/* ================================================= */}

        {step === 'detecting' && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="py-14 px-6 text-center space-y-7 bg-[#FDFBF8] rounded-3xl hairline-border border-[#E7DCD1]"
          >

            {/* Animated icon */}

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">

              <div className="absolute inset-0 rounded-full bg-[#E2673F]/20 animate-ping" />

              <div className="relative w-14 h-14 rounded-full bg-[#E2673F] text-white flex items-center justify-center shadow-lg">
                <Wand2 className="w-7 h-7 animate-spin" />
              </div>

            </div>

            <div>

              <h3 className="text-xl sm:text-2xl font-serif text-[#2B2622]">
                Extracting ingredients with Gemini Vision...
              </h3>

              <p className="text-sm text-[#6B6259] mt-2 max-w-md mx-auto">
                Gemini is analyzing your fridge image and
                identifying vegetables, fruits, proteins,
                dairy products, sauces, and pantry items.
              </p>

            </div>

            {/* Skeleton ingredients */}

            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto pt-2">

              <Skeleton className="h-8 w-24 rounded-full" />

              <Skeleton className="h-8 w-32 rounded-full" />

              <Skeleton className="h-8 w-20 rounded-full" />

              <Skeleton className="h-8 w-28 rounded-full" />

              <Skeleton className="h-8 w-24 rounded-full" />

            </div>

            <p className="text-xs text-[#8E847A]">
              This may take a few seconds...
            </p>

          </motion.div>
        )}

        {/* ================================================= */}
        {/* STEP 3 — REVIEW */}
        {/* ================================================= */}

        {step === 'review' && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="space-y-6 pt-4 border-t border-[#E7DCD1]"
          >

            {/* Header */}

            <div className="p-4 rounded-2xl bg-amber-50/70 hairline-border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">

                <Sparkles className="w-4 h-4 text-[#E2673F]" />

                <span>
                  Detected {detectedChips.length}{' '}
                  Ingredients
                </span>

              </div>

              <button
                type="button"
                onClick={handleUploadAnother}
                className="inline-flex items-center gap-1.5 text-xs text-[#E2673F] font-semibold hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />

                Upload different photo
              </button>

            </div>

            {/* Error message if Gemini failed */}

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">

                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />

                <div>
                  <p className="font-medium">
                    AI detection was unsuccessful
                  </p>

                  <p className="text-xs mt-1">
                    {errorMessage}
                  </p>
                </div>

              </div>
            )}

            {/* Detected ingredients */}

            {detectedChips.length > 0 ? (
              <div className="space-y-3">

                <h3 className="text-sm font-semibold text-[#2B2622]">
                  Ingredients found in your photo
                </h3>

                <motion.div
                  layout
                  className="flex flex-wrap gap-2.5 min-h-[100px]"
                >
                  <AnimatePresence>
                    {detectedChips.map(
                      (chip, index) => (
                        <motion.div
                          key={`${chip}-${index}`}
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
                        >
                          <IngredientChip
                            name={chip}
                            isDetected
                            onRemove={
                              handleRemoveChip
                            }
                          />
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </motion.div>

              </div>
            ) : (
              <div className="rounded-2xl border border-[#E7DCD1] bg-[#FDFBF8] p-6 text-center">

                <Sparkles className="w-8 h-8 mx-auto text-[#E2673F] mb-3" />

                <h3 className="font-serif text-lg text-[#2B2622]">
                  No ingredients detected
                </h3>

                <p className="text-sm text-[#6B6259] mt-1">
                  Add the ingredients manually below and
                  we'll use them to generate recipes.
                </p>

              </div>
            )}

            {/* Manual ingredient input */}

            <div className="space-y-2">

              <h3 className="text-sm font-semibold text-[#2B2622]">
                Add missing ingredients
              </h3>

              <form
                onSubmit={handleAddChip}
                className="flex gap-2"
              >

                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) =>
                    setManualInput(
                      e.target.value
                    )
                  }
                  placeholder="Missed an item? Add manually..."
                  className="flex-1 px-4 py-3 rounded-full bg-white text-sm hairline-border border-[#E7DCD1] focus:outline-none focus:ring-2 focus:ring-[#E2673F]"
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

            </div>

            {/* Current ingredient count */}

            <div className="flex items-center justify-between text-xs text-[#6B6259]">

              <span>
                {detectedChips.length} ingredients selected
              </span>

              <span>
                {ingredients.length} already on cutting board
              </span>

            </div>

            {/* Generate button */}

            <div className="pt-5 border-t border-[#E7DCD1] flex flex-col sm:flex-row items-center justify-between gap-4">

              <div className="text-xs text-[#6B6259]">
                These ingredients will be used to create
                personalized recipes.
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={handleGenerate}
                disabled={detectedChips.length === 0}
                className="w-full sm:w-auto"
              >
                Looks good — Generate recipes
              </Button>

            </div>

          </motion.div>
        )}

      </div>
    </motion.div>
  );
}