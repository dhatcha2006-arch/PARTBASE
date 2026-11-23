import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-semibold uppercase tracking-badge text-lime">
          Community Stories
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mt-2 tracking-tight">
          Loved by workers and neighborhood shops
        </h2>
        <p className="mt-3 text-muted text-base">
          See how local part-time work powers students, second incomes, and independent shopkeepers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((item, i) => (
          <div
            key={i}
            className="glass-panel p-7 rounded-[20px] flex flex-col justify-between hover:border-lime/30 transition-all duration-300"
          >
            <div>
              {/* Star rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-lime text-lime" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-light text-sm sm:text-base leading-relaxed italic mb-6">
                "{item.quote}"
              </p>
            </div>

            {/* Author */}
            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1F1F23] border border-lime/30 flex items-center justify-center font-display font-bold text-xs text-lime">
                {item.avatar}
              </div>
              <div>
                <div className="font-display font-bold text-sm text-white">
                  {item.author}
                </div>
                <div className="text-[11px] text-muted">
                  {item.role} · <span className="text-white/80">{item.shop}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
