# PARTBASE Trust & Security Policy

## 1. Zero-Fee Employment Policy

PARTBASE enforces a strict zero-fee policy across all Chennai clusters:
- **No Candidate Fees**: Job seekers never pay application, registration, processing, uniform, or documentation fees.
- **No Advance Deposits**: Employers are strictly prohibited from demanding refundable or non-refundable deposits from workers.
- **Automated Text Filtering**: Job listing creation runs a policy check inspecting descriptions for fee-related keywords (`deposit`, `registration fee`, `charges`, `pay upfront`). Any match blocks immediate publishing.

## 2. Community Moderation & Auto-Hide Thresholds

- **3-Report Auto-Hide**: When any shift listing receives 3 or more incident reports from job seekers, the system automatically removes it from search queries.
- **Admin Review Queue**: Flagged listings are routed to the Admin Console (`/admin/reports`) where human moderators inspect community feedback, investigate merchant credentials, and take action (dismiss flag, block merchant, or permanently remove listing).
- **Merchant Penalties**: Confirmed fraudulent stores face immediate suspension, revoking their ability to publish shifts or contact applicants.

## 3. Authentication & OTP Safeguards

- **6-Digit OTP Verification**: Passwords are eliminated; authentication uses one-time SMS verification.
- **Rate Limiting**: Phone numbers are restricted to a maximum of 3 failed attempts before a 10-minute cooldown window is triggered.
- **Session Protection**: Flask sessions use `HttpOnly`, `SameSite=Lax`, and CSRF tokens across all form submissions.


## 7. Security Headers & Telemetry Rules

PARTBASE incorporates defense-in-depth HTTP headers:
- `X-Frame-Options: DENY`: Prevents clickjacking attacks.
- `X-Content-Type-Options: nosniff`: Mitigates MIME sniffing exploits.
- `Content-Security-Policy`: Restricts inline injection vectors.
