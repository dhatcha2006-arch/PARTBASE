import React, { useState } from 'react';
import { X, CheckCircle, Store, Clock, IndianRupee, ArrowRight } from 'lucide-react';

export default function PostJobModal({ onClose }) {
  const [shopName, setShopName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [hourlyWage, setHourlyWage] = useState('220');
  const [shiftTime, setShiftTime] = useState('Morning (08:00 - 13:00)');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-glow rounded-[24px] p-6 sm:p-8 border border-lime/40 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-muted hover:text-white bg-surface-dark border border-white/10 hover:border-lime/40 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-4 h-4 text-lime" />
              <span className="text-xs font-semibold uppercase tracking-badge text-lime">
                Post A Shift in 2 Minutes
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl text-white mb-1">
              Hire Nearby Staff Fast
            </h3>
            <p className="text-xs text-muted mb-6">
              Reach verified students and local part-timers within 3 km of your store.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-badge mb-1.5">
                  Shop / Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Tokai Cafe, Nature's Basket"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-[#111113] border border-white/10 focus:border-lime rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-badge mb-1.5">
                  Role Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Barista, Shelf Stocker, Delivery"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-[#111113] border border-white/10 focus:border-lime rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-badge mb-1.5">
                    Hourly Pay (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="220"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(e.target.value)}
                    className="w-full bg-[#111113] border border-white/10 focus:border-lime rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-badge mb-1.5">
                    Shift Timing
                  </label>
                  <select
                    value={shiftTime}
                    onChange={(e) => setShiftTime(e.target.value)}
                    className="w-full bg-[#111113] border border-white/10 focus:border-lime rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option>Morning (08:00 - 13:00)</option>
                    <option>Evening (17:00 - 22:00)</option>
                    <option>Full Weekend (Sat-Sun)</option>
                    <option>Flexible hours</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-lime text-midnight font-bold text-sm shadow-lime-glow hover:bg-lime-dark transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Publish Shift Listing</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-lime/20 border border-lime text-lime flex items-center justify-center mx-auto mb-4 shadow-lime-glow">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl text-white">Shift Published!</h3>
            <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
              Your listing for <strong className="text-white">{roleTitle}</strong> at <strong className="text-white">{shopName}</strong> is now broadcast to nearby job seekers.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-lime text-midnight font-bold text-xs shadow-lime-glow"
              >
                Close
              </button>
              <a
                href="http://127.0.0.1:5000/employer/dashboard"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-white/15 text-white hover:text-lime text-xs font-medium"
              >
                Go to Employer Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
