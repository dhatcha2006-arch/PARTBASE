import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { Coffee, ShoppingBag, Bike, Sparkles, GraduationCap, Box, LayoutGrid } from 'lucide-react';

const ICONS = {
  all: LayoutGrid,
  delivery: Bike,
  retail: ShoppingBag,
  cafe: Coffee,
  event: Sparkles,
  tutoring: GraduationCap,
  warehouse: Box,
};

export default function CategoryChips({ activeCategory, onSelectCategory }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-badge text-lime">
            Neighborhood Categories
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
            Browse by shift type
          </h2>
        </div>
        <p className="text-sm text-muted max-w-md">
          Flexible shifts arranged around your schedule — whether you have 3 free hours in the morning or full weekends.
        </p>
      </div>

      {/* Horizontal Scrollable Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.id] || LayoutGrid;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-lime text-midnight font-bold shadow-lime-glow'
                  : 'bg-surface/70 text-muted-light border border-white/10 hover:border-lime/40 hover:text-white hover:bg-surface'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-midnight stroke-[2.5]' : 'text-lime'}`} />
              <span>{cat.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-midnight/20 text-midnight font-bold' : 'bg-white/5 text-muted'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
