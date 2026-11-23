import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/mockData';
import { Search, Touchpad, CheckCircle, ArrowRight } from 'lucide-react';

const STEP_ICONS = [Search, Touchpad, CheckCircle];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-6">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-semibold uppercase tracking-badge text-lime">
          Frictionless Hiring
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mt-2 tracking-tight">
          How PartBase works
        </h2>
        <p className="mt-3 text-muted text-base">
          No resumes to format, no ghosting agencies. Connect directly with local shopkeepers who need your help this week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {HOW_IT_WORKS_STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[idx] || Search;
          return (
            <div
              key={step.step}
              className="glass-panel p-8 rounded-[20px] relative group hover:border-lime/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Step number badge & icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-bold text-4xl text-lime/40 group-hover:text-lime transition-colors">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-surface-dark border border-white/10 flex items-center justify-center text-lime group-hover:shadow-lime-glow transition-all">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-lime transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress Connector indicator */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted">
                <span>Step {idx + 1} of 3</span>
                <span className="text-lime font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Instant
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
