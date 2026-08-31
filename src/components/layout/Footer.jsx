import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ArrowRight } from 'lucide-react';
import { SectionEyebrow } from '../ui/SectionEyebrow';

export function Footer() {
  return (
    <footer className="bg-[#2B2622] text-[#FDFBF8] pt-16 pb-12 mt-20 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E2673F] text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-2xl font-serif text-white tracking-tight">
                Fridge <span className="serif-italic text-[#E2673F]">to</span> Table
              </span>
            </Link>
            <p className="text-sm text-[#8E847A] leading-relaxed max-w-sm">
              Your boutique, editorial AI culinary companion. Turn whatever ingredients you have in your fridge into memorable home-cooked meals.
            </p>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E2673F] font-sans">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D8C7B7]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/cook" className="hover:text-white transition-colors">
                  The Cutting Board
                </Link>
              </li>
              <li>
                <Link to="/cook/photo" className="hover:text-white transition-colors">
                  Fridge Photo AI Detector
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-4">
            <SectionEyebrow icon={Heart} className="text-amber-400">
              A Little Tip Weekly
            </SectionEyebrow>
            <p className="text-xs text-[#8E847A]">
              Get fresh seasonal recipes & kitchen hacks delivered to your inbox every Sunday.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-2.5 text-sm rounded-full bg-white/10 text-white placeholder-[#8E847A] border border-white/15 focus:outline-none focus:border-[#E2673F]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-[#E2673F] text-white hover:bg-[#CC5A35] transition-colors shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E847A]">
          <p>© {new Date().getFullYear()} Fridge to Table. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
