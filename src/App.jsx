import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { PantryProvider } from './context/PantryContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Skeleton } from './components/ui/Skeleton';
import { AuthModal } from './components/auth/AuthModal';

// Lazy loaded page components
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const CuttingBoardPage = lazy(() => import('./pages/CuttingBoardPage').then((m) => ({ default: m.CuttingBoardPage })));
const PhotoUploadPage = lazy(() => import('./pages/PhotoUploadPage').then((m) => ({ default: m.PhotoUploadPage })));
const RecipeResultsPage = lazy(() => import('./pages/RecipeResultsPage').then((m) => ({ default: m.RecipeResultsPage })));
const RecipeDetailPage = lazy(() => import('./pages/RecipeDetailPage').then((m) => ({ default: m.RecipeDetailPage })));

function PageFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
      <Skeleton className="h-48 w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cook" element={<CuttingBoardPage />} />
          <Route path="/cook/photo" element={<PhotoUploadPage />} />
          <Route path="/cook/results" element={<RecipeResultsPage />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PantryProvider>
          <Router>
            <div className="min-h-screen flex flex-col justify-between bg-[#F7EDE4] text-[#2B2622] font-sans antialiased selection:bg-orange-200">
              <div>
                <Navbar />
                <main>
                  <AnimatedRoutes />
                </main>
              </div>
              <Footer />
            </div>
            <AuthModal />
          </Router>
        </PantryProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
