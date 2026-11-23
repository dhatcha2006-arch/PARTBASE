import React from 'react';
import { MapPin, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#080809] border-t border-white/5 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-lime flex items-center justify-center shadow-lime-glow">
                <MapPin className="w-4 h-4 text-midnight stroke-[2.4]" fill="#0B0B0C" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                PartBase
              </span>
            </div>
            <p className="text-sm text-muted max-w-sm leading-relaxed">
              Hyper-local part-time and temporary jobs platform connecting job seekers with trusted neighborhood stores, cafes, and businesses.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span>Platform Active &middot; Zero Fee Guarantee</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-badge text-white">
              For Seekers
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#jobs-section" className="hover:text-lime transition-colors">Find nearby jobs</a></li>
              <li><a href="#how-it-works" className="hover:text-lime transition-colors">How shift matching works</a></li>
              <li><a href="http://127.0.0.1:5000/auth/register" className="hover:text-lime transition-colors">Create Seeker Profile</a></li>
              <li><a href="http://127.0.0.1:5000/auth/login" className="hover:text-lime transition-colors">Seeker Dashboard</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-badge text-white">
              For Employers
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#for-shops" className="hover:text-lime transition-colors">Post an opening</a></li>
              <li><a href="http://127.0.0.1:5000/auth/register" className="hover:text-lime transition-colors">Shop Verification</a></li>
              <li><a href="http://127.0.0.1:5000/employer/dashboard" className="hover:text-lime transition-colors">Merchant Portal</a></li>
              <li><a href="http://127.0.0.1:5000/admin/dashboard" className="hover:text-lime transition-colors">Platform Admin</a></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-badge text-white">
              Safety & Trust
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Every shop is verified with local business proof. Zero registration fees are permitted on PartBase.
            </p>
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-white/10 hover:border-lime/40 text-xs text-muted hover:text-white transition-all"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5 text-lime" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} PartBase Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Zero-Fee Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
