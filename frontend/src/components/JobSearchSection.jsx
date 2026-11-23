import React, { useState, useMemo } from 'react';
import { HIRING_JOBS } from '../data/mockData';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  SlidersHorizontal, 
  List, 
  Map as MapIcon, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function JobSearchSection({ 
  activeCategory, 
  onSelectCategory, 
  onApplyJob,
  selectedJobForDetail 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('all'); // all, 1km, 3km
  const [payFilter, setPayFilter] = useState('all'); // all, 200, 300
  const [timingFilter, setTimingFilter] = useState('all'); // all, morning, evening, weekend
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedMapPin, setSelectedMapPin] = useState(null);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return HIRING_JOBS.filter((job) => {
      // Category filter
      if (activeCategory !== 'all' && job.category !== activeCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches = 
          job.role.toLowerCase().includes(query) ||
          job.shop.toLowerCase().includes(query) ||
          job.address.toLowerCase().includes(query) ||
          job.tags.some(t => t.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Distance filter
      const distanceNum = parseFloat(job.distance);
      if (distanceFilter === '1km' && distanceNum > 1.0) return false;
      if (distanceFilter === '3km' && distanceNum > 3.0) return false;

      // Pay filter
      const payNum = parseInt(job.rate.replace(/\D/g, ''), 10);
      if (payFilter === '200' && payNum < 200) return false;
      if (payFilter === '300' && payNum < 300) return false;

      // Timing filter
      if (timingFilter === 'morning' && !job.timing.toLowerCase().includes('morning')) return false;
      if (timingFilter === 'evening' && !job.timing.toLowerCase().includes('evening')) return false;
      if (timingFilter === 'weekend' && !job.days.toLowerCase().includes('sat') && !job.days.toLowerCase().includes('sun')) return false;

      return true;
    });
  }, [activeCategory, searchQuery, distanceFilter, payFilter, timingFilter]);

  return (
    <section id="jobs-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface text-xs font-semibold uppercase tracking-badge text-lime border border-white/5 mb-2">
            <Zap className="w-3.5 h-3.5 fill-lime" />
            <span>Hiring Near You Today</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Available shifts around the corner
          </h2>
          <p className="text-muted text-sm mt-1 max-w-xl">
            Verified local shops ready to take you on for regular or on-demand weekly shifts. Payouts processed on completion.
          </p>
        </div>

        {/* View Switcher: List vs Map */}
        <div className="flex items-center bg-surface border border-white/10 rounded-full p-1 self-start md:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-lime text-midnight shadow-lime-glow'
                : 'text-muted hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List view</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-lime text-midnight shadow-lime-glow'
                : 'text-muted hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map view</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl mb-8 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cafe, Decathlon, barista, night shift, or area..."
              className="w-full bg-[#111113] border border-white/10 focus:border-lime rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none transition-colors"
            />
          </div>

          {/* Quick Select Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Distance Filter */}
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="bg-[#111113] border border-white/10 hover:border-lime/40 text-muted-light rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="all">Distance: Any radius</option>
              <option value="1km">Within 1.0 km</option>
              <option value="3km">Within 3.0 km</option>
            </select>

            {/* Pay Filter */}
            <select
              value={payFilter}
              onChange={(e) => setPayFilter(e.target.value)}
              className="bg-[#111113] border border-white/10 hover:border-lime/40 text-muted-light rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="all">Pay: Any rate</option>
              <option value="200">&gt; ₹200 / hr</option>
              <option value="300">&gt; ₹300 / hr</option>
            </select>

            {/* Timing Filter */}
            <select
              value={timingFilter}
              onChange={(e) => setTimingFilter(e.target.value)}
              className="bg-[#111113] border border-white/10 hover:border-lime/40 text-muted-light rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="all">Shift: Any time</option>
              <option value="morning">Morning shifts</option>
              <option value="evening">Evening shifts</option>
              <option value="weekend">Weekends only</option>
            </select>
          </div>
        </div>

        {/* Results summary & Active Category indicator */}
        <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-white/5">
          <span>
            Showing <strong className="text-white">{filteredJobs.length}</strong> shifts available nearby
          </span>
          {activeCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-lime hover:underline"
            >
              Reset category filter
            </button>
          )}
        </div>
      </div>

      {/* VIEW: MAP VIEW */}
      {viewMode === 'map' && (
        <div className="relative w-full h-[520px] rounded-[20px] glass-panel border border-white/10 overflow-hidden mb-8">
          {/* Simulated Dark Map Canvas */}
          <div 
            className="absolute inset-0 bg-[#0F0F12]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(198, 244, 50, 0.08) 0%, transparent 65%),
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 40px 40px, 40px 40px'
            }}
          >
            {/* Neighborhood road paths */}
            <svg className="absolute inset-0 w-full h-full stroke-white/10 fill-none" strokeWidth="2">
              <path d="M -50 180 Q 200 120 400 240 T 800 200 T 1200 320" />
              <path d="M 280 -50 Q 320 200 480 340 T 520 600" />
              <path d="M 680 -50 Q 640 180 720 380 T 800 600" strokeDasharray="6 4" />
              <path d="M -50 360 Q 350 400 700 340 T 1300 420" />
            </svg>

            {/* "You Are Here" user beacon */}
            <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-lime/20 animate-ping absolute" />
                <span className="w-4 h-4 rounded-full bg-lime border-2 border-midnight shadow-lime-glow relative z-10" />
              </div>
              <span className="mt-1.5 px-2 py-0.5 rounded-md bg-midnight/90 border border-white/10 text-[10px] font-bold text-white shadow">
                You (Indiranagar)
              </span>
            </div>

            {/* Interactive Pins for jobs */}
            {filteredJobs.map((job, idx) => {
              // Deterministic scattered positions
              const positions = [
                { top: '32%', left: '38%' },
                { top: '58%', left: '56%' },
                { top: '24%', left: '62%' },
                { top: '68%', left: '32%' },
                { top: '40%', left: '74%' },
                { top: '75%', left: '68%' },
              ];
              const pos = positions[idx % positions.length];
              const isSelected = selectedMapPin?.id === job.id;

              return (
                <div
                  key={job.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <button
                    onClick={() => setSelectedMapPin(isSelected ? null : job)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-lg ${
                      isSelected
                        ? 'bg-lime text-midnight ring-4 ring-lime/30 scale-110'
                        : 'bg-surface border border-white/20 text-white hover:border-lime hover:scale-105'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-lime" />
                    <span>{job.shop}</span>
                    <span className="text-[10px] opacity-75">{job.rate}/hr</span>
                  </button>
                </div>
              );
            })}

            {/* Selected Pin Popup Drawer */}
            {selectedMapPin && (
              <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 glass-panel p-4 rounded-2xl border border-lime/40 z-30 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-lime uppercase tracking-badge">
                      {selectedMapPin.category} · {selectedMapPin.distance}
                    </span>
                    <h4 className="font-bold text-white text-sm">{selectedMapPin.role}</h4>
                    <p className="text-xs text-muted">{selectedMapPin.shop}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMapPin(null)}
                    className="text-muted hover:text-white text-xs p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-sm font-bold text-white">
                    {selectedMapPin.rate} <span className="text-xs font-normal text-muted">/ hr</span>
                  </div>
                  <button
                    onClick={() => onApplyJob(selectedMapPin)}
                    className="px-3.5 py-1.5 rounded-full bg-lime text-midnight font-bold text-xs hover:bg-lime-dark shadow-lime-glow"
                  >
                    1-Tap Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: JOB CARDS GRID (LIST VIEW) */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group glass-panel rounded-[20px] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-panel-hover hover:border-lime/30 flex flex-col justify-between"
              style={{
                perspective: '1000px',
              }}
            >
              {/* Card Top: Shop info & Pay */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* Shop Avatar */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-surface-dark border border-white/10 flex items-center justify-center font-display font-bold text-base text-white group-hover:border-lime/50 transition-colors">
                      {job.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-muted-light group-hover:text-white transition-colors">
                          {job.shop}
                        </span>
                        {job.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-lime" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-lime" />
                          {job.distance}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-lime fill-lime" />
                          {job.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Pay Badge */}
                  <div className="text-right">
                    <div className="font-display font-bold text-xl text-white group-hover:text-lime transition-colors">
                      {job.rate}
                    </div>
                    <div className="text-[10px] uppercase tracking-badge text-muted">
                      {job.rateUnit}
                    </div>
                  </div>
                </div>

                {/* Role Title */}
                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-lime transition-colors leading-snug">
                  {job.role}
                </h3>

                {/* Shift Schedule Details */}
                <div className="space-y-1.5 mb-4 text-xs text-muted-light">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-lime flex-shrink-0" />
                    <span>{job.timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-lime flex-shrink-0" />
                    <span>{job.days}</span>
                  </div>
                </div>

                {/* Tags / Perks */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-surface-dark border border-white/5 text-muted-light group-hover:border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Urgent label & 1-Tap Apply Button */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-lime flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                  {job.badge}
                </span>

                <button
                  onClick={() => onApplyJob(job)}
                  className="px-5 py-2 rounded-full bg-lime text-midnight font-bold text-xs sm:text-sm hover:bg-lime-dark shadow-lime-glow hover:shadow-lime-glow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <span>Apply in 1 tap</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="p-12 text-center glass-panel rounded-2xl">
          <p className="text-muted text-base">No neighborhood jobs match your current search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDistanceFilter('all');
              setPayFilter('all');
              setTimingFilter('all');
              onSelectCategory('all');
            }}
            className="mt-4 px-5 py-2 rounded-full bg-lime text-midnight font-bold text-xs"
          >
            Reset all filters
          </button>
        </div>
      )}
    </section>
  );
}
