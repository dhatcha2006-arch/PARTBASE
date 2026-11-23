import React, { useState } from 'react';
import { MapPin, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onFindJobsClick, onPostJobClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 w-full pt-6 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-lime flex items-center justify-center shadow-lime-glow transition-transform group-hover:scale-105">
            <MapPin className="w-5 h-5 text-midnight stroke-[2.4]" fill="#0B0B0C" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-lime transition-colors">
            PartBase
          </span>
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted hover:text-white transition-colors">
          <a 
            href="#jobs-section" 
            onClick={(e) => { e.preventDefault(); onFindJobsClick?.(); }}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Find jobs
          </a>
          <a 
            href="#how-it-works" 
            className="hover:text-white transition-colors"
          >
            How it works
          </a>
          <a 
            href="#for-shops" 
            className="hover:text-white transition-colors"
          >
            For shops
          </a>
          <a 
            href="#pricing" 
            className="hover:text-white transition-colors"
          >
            Pricing
          </a>
        </div>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="http://127.0.0.1:5000/auth/login"
            className="px-5 py-2 text-sm font-medium text-white hover:text-lime rounded-full border border-white/10 hover:border-lime/40 bg-surface/50 hover:bg-surface transition-all duration-200"
          >
            Sign in
          </a>
          <button
            onClick={onPostJobClick}
            className="px-5 py-2 text-sm font-bold text-midnight bg-lime rounded-full hover:bg-lime-dark shadow-lime-glow hover:shadow-lime-glow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            Post a job
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onPostJobClick}
            className="px-3.5 py-1.5 text-xs font-bold text-midnight bg-lime rounded-full"
          >
            Post a job
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted hover:text-white border border-white/10 rounded-xl bg-surface/70"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl glass-panel flex flex-col gap-3 text-sm font-medium">
          <a 
            href="#jobs-section" 
            onClick={() => { setMobileMenuOpen(false); onFindJobsClick?.(); }}
            className="p-2 text-white hover:text-lime"
          >
            Find jobs
          </a>
          <a 
            href="#how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-muted hover:text-white"
          >
            How it works
          </a>
          <a 
            href="#for-shops" 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-muted hover:text-white"
          >
            For shops
          </a>
          <a 
            href="#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-muted hover:text-white"
          >
            Pricing
          </a>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <a
              href="http://127.0.0.1:5000/auth/login"
              className="w-full text-center py-2.5 rounded-full border border-white/15 text-white"
            >
              Sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
