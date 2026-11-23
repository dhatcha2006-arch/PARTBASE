import React from 'react';

export default function StatBlock({ value, label, align = 'left' }) {
  const isRight = align === 'right';

  return (
    <div className={`flex flex-col ${isRight ? 'items-start sm:items-end text-left sm:text-right' : 'items-start text-left'}`}>
      <span className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
        {value}
      </span>
      <span className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-badge text-muted">
        {label}
      </span>
    </div>
  );
}
