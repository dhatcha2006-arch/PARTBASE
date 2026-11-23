# Changelog

All notable changes to the PARTBASE hyper-local micro-job platform are documented here.

## [v1.1.0] - 2026-11-23

### Changed
- **Unified UI**: every page now uses one palette: midnight black #0B0B0C, white #FFFFFF and lime #C6F432 (plus neutral greys). Removed all blue, red, amber, cyan and green colours from templates, scripts, the manifest and Bootstrap's semantic classes.
- Status colours are expressed with lime (positive), light lime (attention) and white (danger) and are always paired with an icon or label.

### Fixed
- `employer/applicant.html` pointed to a missing endpoint (`update_application_status`) and returned a 500 error.
- About 30 CSS classes used by templates were never defined (filters, day pills, safety banner, admin logo badges, `bg-lime`, `hero-title`, `stat-number` and others). They are now styled.
- Admin verify and denied cards had dark text on a dark card.
- Landing headline used a mismatched serif italic; it now uses the display font.

## [v1.0.0] - 2026-11-20

### Added
- **Hyper-Local Shift Directory**: Real-time micro-job listings for Chennai pilot zones (OMR & Anna Nagar).
- **Zero-Fee Policy Protection**: Strict anti-scam keyword checks prohibiting upfront candidate deposits and registration fees.
- **Auto-Hide Community Moderation**: Listings receiving 3+ user reports are suppressed automatically until admin resolution.
- **Double-Blind Rating Engine**: Merchant and seeker reviews stay hidden until both parties submit feedback.
- **Phone OTP Authentication**: 6-digit OTP verification with 1-click Demo portals for Seeker, Employer, and Admin roles.
- **Progressive Web App (PWA)**: Web app manifest and service worker caching for mobile homescreen installation.
- **REST API Suite**: Standardized JSON envelope endpoints for mobile/PWA integrations.
- **Extensive Test Coverage**: Over 48 integration and unit tests covering auth, jobs, moderation, payments, and notifications.

### Changed
- Elevated dark cyber styling across all portals.
- Replaced artificial AI terminology with realistic, human-facing zero-fee compliance copy across all views.
- Added Indian numbering currency formatter (`₹1,50,000`).
- Added high-contrast accessibility focus rings and print stylesheet.

### Fixed
- Payout and CTA button text wrapping on compact mobile displays.
- Admin queue report relationship population for test and seed environments.
