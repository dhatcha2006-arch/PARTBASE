import React from 'react';

export default function GlowBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Primary lime radial center glow */}
      <div 
        className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] lg:w-[1100px] h-[550px] rounded-full blur-[120px] opacity-45"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(198, 244, 50, 0.42) 0%, rgba(198, 244, 50, 0.12) 45%, rgba(11, 11, 12, 0) 70%)'
        }}
      />

      {/* Upward vertical auroral light beams */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[650px] flex justify-center items-end opacity-60 mix-blend-screen animate-beam-glow">
        {/* Beam 1 - Center beam */}
        <div 
          className="w-40 sm:w-56 h-full"
          style={{
            background: 'linear-gradient(180deg, rgba(198, 244, 50, 0) 0%, rgba(198, 244, 50, 0.28) 60%, rgba(198, 244, 50, 0.45) 100%)',
            filter: 'blur(28px)',
            transform: 'scaleY(1.1)'
          }}
        />
        {/* Beam 2 - Left inner */}
        <div 
          className="w-24 sm:w-36 h-[90%] -ml-16"
          style={{
            background: 'linear-gradient(180deg, rgba(198, 244, 50, 0) 0%, rgba(198, 244, 50, 0.22) 55%, rgba(198, 244, 50, 0.35) 100%)',
            filter: 'blur(32px)',
          }}
        />
        {/* Beam 3 - Right inner */}
        <div 
          className="w-24 sm:w-36 h-[90%] -mr-16"
          style={{
            background: 'linear-gradient(180deg, rgba(198, 244, 50, 0) 0%, rgba(198, 244, 50, 0.22) 55%, rgba(198, 244, 50, 0.35) 100%)',
            filter: 'blur(32px)',
          }}
        />
        {/* Beam 4 - Left outer fine beam */}
        <div 
          className="w-16 sm:w-24 h-[75%] -ml-28"
          style={{
            background: 'linear-gradient(180deg, rgba(198, 244, 50, 0) 0%, rgba(198, 244, 50, 0.14) 50%, rgba(198, 244, 50, 0.25) 100%)',
            filter: 'blur(36px)',
          }}
        />
        {/* Beam 5 - Right outer fine beam */}
        <div 
          className="w-16 sm:w-24 h-[75%] -mr-28"
          style={{
            background: 'linear-gradient(180deg, rgba(198, 244, 50, 0) 0%, rgba(198, 244, 50, 0.14) 50%, rgba(198, 244, 50, 0.25) 100%)',
            filter: 'blur(36px)',
          }}
        />
      </div>

      {/* Subtle fine vertical light streaks */}
      <div 
        className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[700px] opacity-25"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(198, 244, 50, 0.08) 0px, rgba(198, 244, 50, 0.08) 1px, transparent 1px, transparent 48px)',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 80%)'
        }}
      />

      {/* Faint ambient dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight" />
    </div>
  );
}
