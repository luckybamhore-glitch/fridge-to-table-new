import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, Utensils, Trash2, Filter, Lightbulb, ArrowRight, Layers } from 'lucide-react';
import { SectionEyebrow } from '../components/ui/SectionEyebrow';
import { IngredientInput } from '../components/cook/IngredientInput';
import { ChipQuickAdd } from '../components/cook/ChipQuickAdd';
import { IngredientChip } from '../components/ui/IngredientChip';
import { Button } from '../components/ui/Button';
import { PhotoUploadModal } from '../components/cook/PhotoUploadModal';
import { DIET_OPTIONS, usePantry } from '../context/PantryContext';
import { generateRecipes } from '../api/recipeApi';
import { useToast } from '../context/ToastContext';

export function CuttingBoardPage() {
  const [activeTab, setActiveTab] = useState('type'); // 'type' | 'photo'
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    ingredients,
    removeIngredient,
    clearIngredients,
    dietFilter,
    setDietFilter,
    duplicateShakeItem,
    setActiveResults,
  } = usePantry();

  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      addToast('Please add at least one ingredient to your board!', 'info');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateRecipes({
        ingredients,
        diet: dietFilter,
      });

      setIsGenerating(false);
      if (response && response.recipes) {
        setActiveResults(response.recipes);
        addToast(`Found ${response.recipes.length} recipes matched to your pantry!`, 'success');
        navigate('/cook/results');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setIsGenerating(false);
      addToast('Failed to generate recipes. Please try again.', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Top Tab Toggle: "Type ingredients" vs "Snap a photo" */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-full bg-[#FDFBF8] hairline-border border-[#E7DCD1] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('type')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'type'
                ? 'bg-[#E2673F] text-white shadow-sm font-semibold'
                : 'text-[#6B6259] hover:text-[#2B2622]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Type ingredients
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('photo');
              setIsPhotoModalOpen(true);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'photo'
                ? 'bg-[#E2673F] text-white shadow-sm font-semibold'
                : 'text-[#6B6259] hover:text-[#2B2622]'
            }`}
          >
            <Camera className="w-4 h-4" />
            Snap a photo
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <div className="bg-[#FDFBF8] p-6 sm:p-8 rounded-3xl hairline-border border-[#E7DCD1] space-y-4">
            <div className="flex items-center justify-between">
              <SectionEyebrow icon={Utensils}>THE CUTTING BOARD</SectionEyebrow>
              {ingredients.length > 0 && (
                <button
                  type="button"
                  onClick={clearIngredients}
                  className="text-xs text-[#8E847A] hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear all
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#2B2622] font-normal">
              What's in your fridge <span className="serif-italic text-[#E2673F]">tonight?</span>
            </h1>

            {/* Input field */}
            <IngredientInput />

            {/* Ingredient Board Container */}
            <div className="pt-4 border-t border-[#E7DCD1]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6259]">
                  ACTIVE BOARD ({ingredients.length})
                </span>
                <span className="text-xs text-[#8E847A]">
                  Click chip to remove
                </span>
              </div>

              {ingredients.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-2xl bg-orange-50/40 border border-dashed border-[#E7DCD1] text-[#6B6259]">
                  <p className="text-sm font-medium">Your cutting board is empty.</p>
                  <p className="text-xs text-[#8E847A] mt-1">
                    Type an ingredient above or tap quick chips below to begin.
                  </p>
                </div>
              ) : (
                <motion.div layout className="flex flex-wrap gap-2.5">
                  <AnimatePresence>
                    {ingredients.map((ing) => (
                      <IngredientChip
                        key={ing}
                        name={ing}
                        isSelected
                        isDuplicate={duplicateShakeItem === ing}
                        onRemove={removeIngredient}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Controls Bar: Diet Select & Primary CTA */}
            <div className="pt-6 border-t border-[#E7DCD1] flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Diet Filter Select */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#E2673F]" />
                <span className="text-xs font-semibold uppercase text-[#6B6259]">Diet:</span>
                <select
                  value={dietFilter}
                  onChange={(e) => setDietFilter(e.target.value)}
                  className="px-4 py-2 rounded-full bg-white text-xs font-medium text-[#2B2622] hairline-border border-[#E7DCD1] focus:outline-none focus:ring-2 focus:ring-[#E2673F]"
                >
                  {DIET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Primary CTA */}
              <Button
                variant="primary"
                size="lg"
                icon={Sparkles}
                disabled={ingredients.length === 0 || isGenerating}
                onClick={handleGenerate}
                className="w-full sm:w-auto"
              >
                {isGenerating ? 'Curating recipes...' : '✨ Generate recipes'}
              </Button>
            </div>
          </div>

          {/* Quick Add Chips Grid */}
          <ChipQuickAdd />
        </div>

        {/* Right Column (Aside 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* A LITTLE TIP Card */}
          <div className="p-6 rounded-3xl bg-[#FDFBF8] hairline-border border-[#E7DCD1] space-y-3 shadow-xs">
            <SectionEyebrow icon={Lightbulb}>A LITTLE TIP</SectionEyebrow>
            <h3 className="text-lg font-serif text-[#2B2622] font-medium">
              Don't leave out basic condiments
            </h3>
            <p className="text-xs text-[#6B6259] leading-relaxed">
              Including pantry staples like butter, garlic, soy sauce, or heavy cream gives our AI the flavor foundation to unlock rich restaurant sauces!
            </p>
          </div>

          {/* Upload Fridge Photo Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-100/80 via-cream-100 to-orange-50 hairline-border border-orange-200/80 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#E2673F] text-white flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-[#2B2622] font-medium">
                Upload a fridge photo instead
              </h3>
              <p className="text-xs text-[#6B6259] mt-1 leading-relaxed">
                Too lazy to type? Take a quick snapshot of your fridge shelves and let Gemini Vision identify everything for you.
              </p>
            </div>
            <Button
              variant="secondary"
              size="md"
              icon={ArrowRight}
              onClick={() => setIsPhotoModalOpen(true)}
              className="w-full justify-between"
            >
              Open Photo Scanner
            </Button>
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />
    </motion.div>
  );
}
