import React from 'react';

export default function TimelinePanel() {
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00'];

  return (
    <div className="w-full max-w-[360px] sm:max-w-[390px] h-[360px] sm:h-[400px] p-5 sm:p-6 rounded-[20px] glass-panel shadow-panel hover:shadow-panel-hover flex flex-col justify-between tilt-right select-none overflow-hidden relative">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-lime" />
          <span className="text-xs font-semibold uppercase tracking-badge text-muted">
            Shift timeline
          </span>
        </div>

        {/* Time Header Grid */}
        <div className="relative flex justify-between text-[11px] font-mono text-muted-dark pb-3 border-b border-white/10">
          {timeSlots.map((time) => (
            <span key={time}>{time}</span>
          ))}
        </div>

        {/* Timeline Rows Container */}
        <div className="relative pt-4 space-y-4">
          {/* Vertical Lime "NOW" Line with Glowing Head */}
          <div className="absolute top-0 bottom-0 left-[48%] w-[2px] bg-lime shadow-lime-glow z-10 pointer-events-none">
            {/* Indicator square on the time line */}
            <div className="absolute -top-1 -left-[5px] w-3 h-3 bg-lime rounded-sm shadow-lime-glow animate-pulse" />
          </div>

          {/* Row 1: Decathlon (Morning) */}
          <div className="relative h-6 flex items-center">
            {/* Grey slot */}
            <div className="absolute left-[5%] w-[35%] h-5 rounded-md bg-[#222226] border border-white/5" />
            {/* Gap */}
            {/* Grey slot */}
            <div className="absolute left-[52%] w-[38%] h-5 rounded-md bg-[#222226] border border-white/5" />
          </div>

          {/* Row 2: Blue Tokai (Active / Selected Lime Shift) */}
          <div className="relative h-7 flex items-center">
            {/* Active glowing lime shift */}
            <div className="absolute left-[12%] w-[46%] h-6 rounded-md bg-lime shadow-lime-glow flex items-center px-2 text-[10px] font-bold text-midnight tracking-tight">
              08:30 - 12:30 · Barista
            </div>
            {/* Grey block */}
            <div className="absolute left-[64%] w-[32%] h-5 rounded-md bg-[#222226] border border-white/5" />
          </div>

          {/* Row 3: Reliance Fresh */}
          <div className="relative h-6 flex items-center">
            {/* Grey block */}
            <div className="absolute left-[2%] w-[26%] h-5 rounded-md bg-[#222226] border border-white/5" />
            {/* Active evening lime preview */}
            <div className="absolute left-[58%] w-[38%] h-6 rounded-md bg-lime/90 shadow-lime-glow flex items-center px-2 text-[10px] font-bold text-midnight">
              13:00 - 16:00 · Cashier
            </div>
          </div>

          {/* Row 4: Express Dispatch */}
          <div className="relative h-6 flex items-center">
            {/* Grey block */}
            <div className="absolute left-[18%] w-[24%] h-5 rounded-md bg-[#222226] border border-white/5" />
            {/* Grey block */}
            <div className="absolute left-[46%] w-[28%] h-5 rounded-md bg-[#222226] border border-white/5" />
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-lime" />
          <span>Assigned (7 hrs)</span>
        </span>
        <span className="text-white font-medium">₹1,640 earned today</span>
      </div>
    </div>
  );
}
