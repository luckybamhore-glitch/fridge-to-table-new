import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Camera, Utensils, Wand2, ChefHat, ArrowRight, Clock, Star, CheckCircle2 } from 'lucide-react';
import { SectionEyebrow } from '../components/ui/SectionEyebrow';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { IngredientChip } from '../components/ui/IngredientChip';
import { usePantry } from '../context/PantryContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { setIngredients } = usePantry();

  const previewIngredients = ['Salmon Fillets', 'Garlic', 'Spinach', 'Heavy Cream', 'Sun-dried Tomatoes', 'Butter'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-24 py-6 sm:py-12 overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
            <SectionEyebrow icon={Sparkles}>
              AI KITCHEN COMPANION
            </SectionEyebrow>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2B2622] font-normal leading-[1.15] tracking-tight">
              Turn whatever is in your fridge into <br className="hidden sm:inline" />
              <span className="serif-italic text-[#E2673F] font-normal">
                restaurant-quality dinner.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#6B6259] leading-relaxed max-w-xl">
              Type what ingredients you have, or snap a photo of your open fridge. Our AI matches your exact pantry with step-by-step editorial recipes and video tutorials.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={Sparkles}
                onClick={() => navigate('/cook')}
              >
                Open The Cutting Board
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={Camera}
                onClick={() => navigate('/cook/photo')}
              >
                Snap Fridge Photo
              </Button>
            </div>

            {/* Interactive Preview Chips Row */}
            <div className="pt-6 space-y-2.5 border-t border-[#E7DCD1]/80">
              <span className="text-xs font-semibold text-[#8E847A] uppercase tracking-wider block">
                EXAMPLE INGREDIENT BOARD:
              </span>
              <div className="flex flex-wrap gap-2">
                {previewIngredients.map((ing) => (
                  <IngredientChip
                    key={ing}
                    name={ing}
                    isSelected
                    onClick={() => {
                      setIngredients(previewIngredients);
                      navigate('/cook');
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual with Overlapping Card */}
          <motion.div variants={itemVariants} className="lg:col-span-5 relative">
            {/* Soft decorative ambient glow circle */}
            <div className="absolute -inset-4 hero-ambient-glow rounded-full blur-2xl pointer-events-none" />

            <div className="relative rounded-3xl overflow-hidden shadow-2xl hairline-border border-[#E7DCD1] bg-[#FDFBF8] group">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"
                alt="Boutique home cooking scene"
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating "Tonight" Recipe Preview Card overlapping bottom-right corner */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                onClick={() => navigate('/cook')}
                className="absolute bottom-6 right-6 left-6 sm:left-auto sm:max-w-xs bg-[#FDFBF8]/95 backdrop-blur-md p-4 rounded-2xl hairline-border border-[#E7DCD1] shadow-xl space-y-2 cursor-pointer hover:scale-102 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="default" icon={Sparkles}>
                    Tonight's Pick
                  </Badge>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    96% Match
                  </span>
                </div>
                <h4 className="font-serif text-base text-[#2B2622] font-medium leading-snug">
                  Tuscan Creamy Garlic Butter Salmon
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#6B6259]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E2673F]" /> 25 mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.9 (1.2k)
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section: "Three steps. Real dinner." */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <SectionEyebrow icon={ChefHat} className="justify-center">
            SIMPLE & ELEGANT
          </SectionEyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2B2622] font-normal">
            Three steps. <span className="serif-italic text-[#E2673F]">Real dinner.</span>
          </h2>
          <p className="text-base text-[#6B6259]">
            No complex grocery runs. Transform ingredients sitting in your fridge right now into gourmet meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-[#FDFBF8] hairline-border border-[#E7DCD1] shadow-xs space-y-4 relative"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center font-bold text-lg font-serif">
              01
            </div>
            <h3 className="text-xl font-serif text-[#2B2622] font-medium">
              Open the fridge
            </h3>
            <p className="text-sm text-[#6B6259] leading-relaxed">
              Type whatever veggies, proteins, or sauces you have in stock—or simply take a photo of your fridge shelves.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-[#FDFBF8] hairline-border border-[#E7DCD1] shadow-xs space-y-4 relative"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center font-bold text-lg font-serif">
              02
            </div>
            <h3 className="text-xl font-serif text-[#2B2622] font-medium">
              Let AI cook
            </h3>
            <p className="text-sm text-[#6B6259] leading-relaxed">
              Our culinary AI generates recipes tailored to your exact ingredient overlap, diet options, and prep time preferences.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-[#FDFBF8] hairline-border border-[#E7DCD1] shadow-xs space-y-4 relative"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E2673F] flex items-center justify-center font-bold text-lg font-serif">
              03
            </div>
            <h3 className="text-xl font-serif text-[#2B2622] font-medium">
              Follow the steps
            </h3>
            <p className="text-sm text-[#6B6259] leading-relaxed">
              Cook with clear, numbered instructions, interactive ingredient checklists, and embedded YouTube video guides.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Secondary Photo Upload Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#2B2622] to-[#1A1715] text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <SectionEyebrow icon={Camera} className="text-amber-400">
              SMART VISION SCAN
            </SectionEyebrow>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-normal leading-tight">
              Or snap a photo of <br />
              <span className="serif-italic text-[#E2673F]">your fridge.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#D8C7B7] leading-relaxed">
              Don't want to type? Upload a quick picture of your open fridge or pantry. Gemini Vision automatically detects your ingredients in seconds.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={Camera}
                onClick={() => navigate('/cook/photo')}
              >
                Launch Photo Scanner
              </Button>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-80 aspect-4/3 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80"
              alt="Open fridge stocked with fresh ingredients"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </motion.div>
  );
}
