import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Utensils, Flame, ChefHat, CheckCircle2 } from 'lucide-react';
import { RecipeCardSkeleton } from '../ui/Skeleton';
import { Badge } from '../ui/Badge';

const GENERATION_STEPS = [
  { id: 1, text: 'Scanning & balancing pantry ingredients...', icon: Utensils },
  { id: 2, text: 'Consulting Gemini AI culinary knowledge...', icon: Wand2 },
  { id: 3, text: 'Calculating flavor pairings & nutrition...', icon: Flame },
  { id: 4, text: 'Curating custom step-by-step instructions...', icon: ChefHat },
  { id: 5, text: 'Plating your personalized menu...', icon: Sparkles },
];

const CHEF_TRIVIA = [
  'Pro Tip: Searing meats at high heat triggers the Maillard reaction for rich flavor!',
  'Did you know? Garlic releases its main healthy compound (allicin) after resting chopped for 10 mins.',
  'Kitchen Hack: Adding a pinch of salt to acidic dishes balances tomatoes & lemons naturally.',
  'Fun Fact: Rest steak after cooking so juiciness redistributes throughout the meat.',
  'Flavor Pairing: Fresh herbs like basil & cilantro shine brightest when added right before serving!',
];

export function RecipeGeneratingLoadingScreen({ ingredients = [], diet = 'All' }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(15);
  const [triviaIdx, setTriviaIdx] = useState(0);

  // Animate through steps and progress bar smoothly
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 92) {
          return prev + Math.floor(Math.random() * 8) + 4;
        }
        return prev;
      });
    }, 350);

    const triviaInterval = setInterval(() => {
      setTriviaIdx((prev) => (prev + 1) % CHEF_TRIVIA.length);
    }, 4000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(triviaInterval);
    };
  }, []);

  const activeStep = GENERATION_STEPS[currentStepIdx];
  const StepIcon = activeStep.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-5xl mx-auto px-4 py-8 space-y-10"
    >
      {/* Central Loading Hero Box */}
      <div className="relative overflow-hidden bg-[#FDFBF8] p-8 sm:p-12 rounded-3xl hairline-border border-[#E7DCD1] shadow-xl text-center space-y-8">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-rose-200/30 rounded-full blur-3xl -z-10 animate-pulse" />

        {/* Animated Icon Central Circle */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          {/* Outer Ripple Rings */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-[#E2673F]/20"
          />
          <motion.div
            animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-0 rounded-full bg-amber-400/20"
          />

          {/* Core Circle */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#E2673F] to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ rotate: -15, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 15, scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StepIcon className="w-9 h-9" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sparkles Orbiting */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-start justify-end"
          >
            <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
          </motion.div>
        </div>

        {/* Status Header */}
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 text-[#E2673F] text-xs font-bold uppercase tracking-wider">
            <Wand2 className="w-3.5 h-3.5 animate-spin" />
            <span>AI Recipe Generation in Progress</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#2B2622] font-normal">
            Crafting your <span className="serif-italic text-[#E2673F]">custom recipes</span>
          </h2>

          <AnimatePresence mode="wait">
            <motion.p
              key={activeStep.text}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm sm:text-base text-[#6B6259] font-medium"
            >
              {activeStep.text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Active Ingredients Chips */}
        {ingredients.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8E847A]">
              Mixing Ingredients ({ingredients.length}):
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
              {ingredients.map((ing) => (
                <Badge key={ing} variant="soft" className="text-xs py-1 px-3 bg-orange-100/60 text-[#2B2622]">
                  {ing}
                </Badge>
              ))}
              {diet && diet !== 'All' && (
                <Badge variant="emerald" className="text-xs py-1 px-3">
                  Diet: {diet}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Smooth Progress Bar */}
        <div className="max-w-md mx-auto space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#6B6259]">
            <span>Step {currentStepIdx + 1} of {GENERATION_STEPS.length}</span>
            <span className="text-[#E2673F]">{Math.min(progress, 99)}%</span>
          </div>

          <div className="h-2.5 w-full bg-[#E7DCD1]/60 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-[#E2673F] to-orange-600 rounded-full"
              initial={{ width: '10%' }}
              animate={{ width: `${Math.min(progress, 99)}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            />
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-between pt-2 max-w-xs mx-auto">
            {GENERATION_STEPS.map((s, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={s.id} className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full transition-all flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-[#E2673F] ring-4 ring-orange-200'
                        : 'bg-[#E7DCD1]'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-2.5 h-2.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chef Trivia Ticker Footer */}
        <div className="pt-4 border-t border-[#E7DCD1]/80 max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={triviaIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-xs text-[#8E847A] italic bg-orange-50/60 p-3 rounded-xl border border-orange-200/50"
            >
              💡 {CHEF_TRIVIA[triviaIdx]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Background Shimmering Skeleton Preview */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8E847A]">
            PREVIEWING RECIPE GRID
          </span>
          <span className="text-xs text-[#8E847A] animate-pulse">Loading menu options...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      </div>
    </motion.div>
  );
}
