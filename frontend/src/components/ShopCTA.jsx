import React from 'react';
import { Store, Clock, ShieldCheck, ArrowRight, Zap, Check } from 'lucide-react';

export default function ShopCTA({ onPostJobClick }) {
  const perks = [
    'No upfront subscription or posting fees',
    'Get applicants within your 3 km walking zone',
    'Review candidate reliability scores & past ratings',
    '1-click shift scheduling & direct UPI settlement'
  ];

  return (
    <section id="for-shops" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-6">
      <div className="relative rounded-[24px] glass-panel-glow p-8 sm:p-12 lg:p-16 overflow-hidden border border-lime/30 shadow-panel-hover">
        {/* Glow orb in the background */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-lime/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-lime/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime/15 border border-lime/30 text-xs font-semibold uppercase tracking-badge text-lime">
              <Store className="w-3.5 h-3.5" />
              <span>For Local Business Owners</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Short on staff this weekend?{' '}
              <span className="text-lime">Post a job in 2 minutes.</span>
            </h2>

            <p className="text-muted text-base sm:text-lg max-w-xl">
              Whether you run a coffee bar, boutique, supermarket, or packing depot, PartBase connects you with dependable local workers ready to start tomorrow.
            </p>

            {/* Perks Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-light">
                  <div className="w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-lime stroke-[3]" />
                  </div>
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* CTA action */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onPostJobClick}
                className="px-8 py-3.5 rounded-full bg-lime text-midnight font-bold text-sm sm:text-base hover:bg-lime-dark shadow-lime-glow hover:shadow-lime-glow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Post a job in 2 minutes</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <a
                href="#pricing"
                className="text-xs sm:text-sm text-muted hover:text-white underline underline-offset-4 transition-colors"
              >
                View merchant zero-fee policy
              </a>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm glass-panel p-6 rounded-[20px] border border-white/10 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-lime flex items-center justify-center text-midnight font-bold text-xs">
                    SHOP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Your Shop Listing</div>
                    <div className="text-[10px] text-muted">Ready in 120 seconds</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-lime/20 text-lime text-[10px] font-bold">
                  Preview
                </span>
              </div>

              <div className="py-4 space-y-3">
                <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-20 bg-white/5 rounded-md" />
                  <div className="h-6 w-24 bg-white/5 rounded-md" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-dark border border-white/5 flex items-center justify-between">
                <span className="text-xs text-muted">Average time to first applicant</span>
                <span className="text-xs font-bold text-lime">18 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
