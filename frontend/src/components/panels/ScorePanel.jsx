import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ScorePanel() {
  return (
    <div className="w-full max-w-[380px] sm:max-w-[420px] h-[390px] sm:h-[430px] p-6 sm:p-7 rounded-[20px] glass-panel glass-panel-glow shadow-panel-hover flex flex-col justify-between center-panel relative z-20 select-none overflow-hidden">
      {/* Glow highlight inside card */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-badge text-muted">
              Match score
            </span>
          </div>

          {/* Auto-apply pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime/15 border border-lime/40 text-lime text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-apply on</span>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-display font-bold text-6xl sm:text-7xl tracking-tight text-white">
            94
          </span>
          <span className="text-sm font-medium text-muted">
            / 100 job fit
          </span>
        </div>
        <p className="text-xs text-muted-light">
          Your free slots match 18 morning shifts at cafes & retail hubs.
        </p>
      </div>

      {/* Chart Section */}
      <div className="relative w-full h-44 sm:h-48 mt-4">
        {/* Faint Horizontal Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-dashed border-white/20 w-full" />
          <div className="border-b border-dashed border-white/20 w-full" />
          <div className="border-b border-dashed border-white/20 w-full" />
          <div className="border-b border-white/30 w-full" />
        </div>

        {/* SVG Chart with Lime Glow */}
        <svg 
          viewBox="0 0 320 140" 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6F432" stopOpacity="0.38" />
              <stop offset="60%" stopColor="#C6F432" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#C6F432" stopOpacity="0.0" />
            </linearGradient>
            <filter id="limeNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C6F432" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Area Fill */}
          <motion.path
            d="M 10 115 Q 60 100 110 75 T 190 60 T 260 38 L 310 22 L 310 135 L 10 135 Z"
            fill="url(#scoreAreaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Lime Curve Line */}
          <motion.path
            d="M 10 115 Q 60 100 110 75 T 190 60 T 260 38 L 310 22"
            fill="none"
            stroke="#C6F432"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#limeNeonGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />

          {/* Pulse Node at End */}
          <circle cx="310" cy="22" r="5" fill="#C6F432" />
          <circle cx="310" cy="22" r="9" fill="none" stroke="#C6F432" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
        </svg>

        {/* Chart X Labels */}
        <div className="flex justify-between text-[10px] text-muted-dark pt-1 font-mono">
          <span>MON</span>
          <span>WED</span>
          <span>FRI</span>
          <span>TODAY</span>
        </div>
      </div>
    </div>
  );
}
