import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function ApplyModal({ job, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [hoursPerWeek, setHoursPerWeek] = useState('16');
  const [preferredShift, setPreferredShift] = useState('Morning');
  const [notes, setNotes] = useState('');

  if (!job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-glow rounded-[24px] p-6 sm:p-8 border border-lime/40 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-muted hover:text-white bg-surface-dark border border-white/10 hover:border-lime/40 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-badge text-lime">
                1-Tap Instant Application
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl text-white">
              {job.role}
            </h3>
            <p className="text-sm text-muted mb-6 flex items-center gap-2">
              <span>{job.shop}</span>
              <span>•</span>
              <span className="text-lime">{job.rate} / hr</span>
              <span>•</span>
              <span>{job.distance}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hours per week */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-badge mb-1.5">
                  How many hours can you work per week?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['10-15 hrs', '16-24 hrs', '25+ hrs'].map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setHoursPerWeek(tier)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        hoursPerWeek === tier
                          ? 'bg-lime text-midnight font-bold border-lime shadow-lime-glow'
                          : 'bg-surface-dark text-muted-light border-white/10 hover:border-lime/30'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Shift */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-badge mb-1.5">
                  Preferred Shift Window
                </label>
                <select
                  value={preferredShift}
                  onChange={(e) => setPreferredShift(e.target.value)}
                  className="w-full bg-[#111113] border border-white/10 focus:border-lime rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                >
                  <option value="Morning">Morning Shift (07:30 - 13:30)</option>
                  <option value="Evening">Evening Shift (17:00 - 22:00)</option>
                  <option value="Weekend">Weekend Full Days</option>
                  <option value="Flexible">Any Available Hours</option>
                </select>
              </div>

              {/* Experience / Notes */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-badge mb-1.5">
                  Relevant experience or quick note (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                  placeholder="e.g. Worked at cafe last semester, live 5 mins walk away..."
                  className="w-full bg-[#111113] border border-white/10 focus:border-lime rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none placeholder-muted resize-none"
                />
              </div>

              {/* Safety notice */}
              <div className="p-3 rounded-xl bg-surface-dark border border-white/5 flex items-center gap-2.5 text-xs text-muted">
                <ShieldCheck className="w-4 h-4 text-lime flex-shrink-0" />
                <span>Zero fees charged. Shop owner replies directly to your profile.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-lime text-midnight font-bold text-sm shadow-lime-glow hover:bg-lime-dark transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Confirm & Submit Application</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-lime/20 border border-lime text-lime flex items-center justify-center mx-auto mb-4 shadow-lime-glow">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white">Application Sent!</h3>
            <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
              Your profile and availability were delivered directly to <strong className="text-white">{job.shop}</strong>. Expect a response in under 24 hours.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-lime text-midnight font-bold text-xs shadow-lime-glow"
              >
                Done
              </button>
              <a
                href="http://127.0.0.1:5000/auth/login"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-white/15 text-white hover:text-lime text-xs font-medium"
              >
                Open Seeker Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
