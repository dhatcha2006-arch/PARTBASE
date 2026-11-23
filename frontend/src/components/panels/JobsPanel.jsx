import React from 'react';
import { PANEL_JOBS } from '../../data/mockData';

export default function JobsPanel({ onSelectJob }) {
  return (
    <div className="w-full max-w-[360px] sm:max-w-[390px] h-[360px] sm:h-[400px] p-5 sm:p-6 rounded-[20px] glass-panel shadow-panel hover:shadow-panel-hover flex flex-col justify-between tilt-left select-none overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-badge text-muted">
            Jobs near you
          </span>
        </div>

        {/* Job Rows */}
        <div className="space-y-2.5">
          {PANEL_JOBS.slice(0, 4).map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob?.(job)}
              className="group flex items-center justify-between p-2.5 rounded-xl bg-surface-dark/70 border border-white/5 hover:border-lime/30 hover:bg-surface-elevated transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#202024] border border-white/10 flex items-center justify-center text-xs font-bold text-white group-hover:border-lime/50 transition-colors">
                  {job.initials}
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-lime transition-colors">
                    {job.role}
                  </div>
                  <div className="text-[11px] text-muted truncate">
                    {job.shop}
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="ml-2 flex-shrink-0">
                {job.badgeType === 'filled' && (
                  <span className="px-2.5 py-1 text-[11px] font-bold text-midnight bg-lime rounded-full shadow-lime-glow">
                    {job.status}
                  </span>
                )}
                {job.badgeType === 'lime-outline' && (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold text-lime border border-lime/60 rounded-full">
                    {job.status}
                  </span>
                )}
                {job.badgeType === 'muted-outline' && (
                  <span className="px-2.5 py-0.5 text-[11px] font-medium text-muted-light border border-white/15 rounded-full">
                    {job.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Subtle Footer */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-muted">
        <span>Updated 3 mins ago</span>
        <span className="text-lime font-medium">12 new within 2 km</span>
      </div>
    </div>
  );
}
