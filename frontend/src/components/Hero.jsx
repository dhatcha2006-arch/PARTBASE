import React from 'react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import StatBlock from './StatBlock';
import JobsPanel from './panels/JobsPanel';
import ScorePanel from './panels/ScorePanel';
import TimelinePanel from './panels/TimelinePanel';
import GlowBackground from './GlowBackground';
import { STATS } from '../data/mockData';

export default function Hero({ onFindJobsClick, onPostJobClick, onSelectJob }) {
  const statFaster = STATS.find((s) => s.id === 'faster-apply');
  const statReplies = STATS.find((s) => s.id === 'replies-24h');
  const statShops = STATS.find((s) => s.id === 'local-shops');
  const statShifts = STATS.find((s) => s.id === 'shifts-filled');

  return (
    <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
      {/* Background radial glow & vertical beams */}
      <GlowBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Left Stats, Centered Headline, Right Stats */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-2 sm:pt-6">
          
          {/* Left Stats (Desktop) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-12 text-left pl-2">
            {statFaster && (
              <StatBlock value={statFaster.value} label={statFaster.label} align="left" />
            )}
            {statReplies && (
              <StatBlock value={statReplies.value} label={statReplies.label} align="left" />
            )}
          </div>

          {/* Centered Headline & CTAs */}
          <div className="lg:col-span-8 flex flex-col items-center text-center px-2">
            {/* Neighborhood Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-white/10 text-xs font-medium text-white mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
              <span>540+ neighborhood shifts available today</span>
              <span className="text-lime text-xs font-semibold pl-1">Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-[80px] leading-[1.05] tracking-tight text-white max-w-4xl">
              Find part-time jobs{' '}
              <span className="text-lime italic font-serif font-normal block sm:inline">
                near you.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted max-w-2xl font-normal leading-relaxed">
              PartBase connects you with shops and businesses around the corner. Pick a shift, apply in one tap, and start this week.
            </p>

            {/* Dual Pill CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onFindJobsClick}
                className="px-7 py-3.5 rounded-full bg-lime text-midnight font-bold text-sm sm:text-base shadow-lime-glow animate-pulse-glow hover:bg-lime-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 fill-midnight stroke-none" />
                <span>Find jobs near me</span>
              </button>

              <button
                onClick={onPostJobClick}
                className="px-7 py-3.5 rounded-full border border-white/15 bg-surface/40 hover:bg-surface/80 hover:border-lime/40 text-white text-sm sm:text-base font-semibold backdrop-blur-md transition-all duration-200 flex items-center gap-2"
              >
                <span>Post a job</span>
                <ArrowRight className="w-4 h-4 text-muted" />
              </button>
            </div>
          </div>

          {/* Right Stats (Desktop) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-12 text-right pr-2 items-end">
            {statShops && (
              <StatBlock value={statShops.value} label={statShops.label} align="right" />
            )}
            {statShifts && (
              <StatBlock value={statShifts.value} label={statShifts.label} align="right" />
            )}
          </div>
        </div>

        {/* Mobile Stats (Stacked below headline on small screens) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-6 border-t border-white/5 lg:hidden">
          {STATS.map((stat) => (
            <div key={stat.id} className="p-3 rounded-xl bg-surface/40 border border-white/5 text-center">
              <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-badge text-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 3D Dashboard Panels - Bottom Cut Off View */}
        <div className="relative mt-12 sm:mt-16 pt-4 perspective-container">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-5 max-w-6xl mx-auto -mb-16 sm:-mb-24">
            {/* Left Panel: Jobs near you (Tilt +9deg) */}
            <div className="w-full lg:w-auto flex justify-center order-2 lg:order-1">
              <JobsPanel onSelectJob={onSelectJob} />
            </div>

            {/* Center Panel: Match score (Slightly taller, elevated) */}
            <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
              <ScorePanel />
            </div>

            {/* Right Panel: Shift timeline (Tilt -9deg) */}
            <div className="w-full lg:w-auto flex justify-center order-3">
              <TimelinePanel />
            </div>
          </div>

          {/* Bottom fade shadow gradient to simulate bottom cutoff */}
          <div className="pointer-events-none absolute -bottom-16 sm:-bottom-24 left-0 right-0 h-32 bg-gradient-to-t from-midnight via-midnight/80 to-transparent z-30" />
        </div>
      </div>
    </section>
  );
}
