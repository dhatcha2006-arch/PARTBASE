# PARTBASE — Hyper-local Micro-job Platform for Chennai

> Connecting neighborhood shops with nearby students and homemakers in Chennai (pilot: **OMR** and **Anna Nagar**) for same-day, flexible micro-jobs.

[![Flask](https://img.shields.io/badge/Flask-3.1-blue.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/pytest-passing-brightgreen.svg)]()

---

## 1. Product Summary & Core Principles

- **No Passwords & No Email:** Mobile number + 6-digit OTP only (seekers, employers, admins).
- **Truly Local:** Seekers see jobs within 1–3 km only (Haversine distance calculation on stored coordinates).
- **Safe by Default:** Strict AI/regex rule-based scam check blocks fee/advance requests live. Banners everywhere: *"Never pay money to get a job. Report it if anyone asks."*
- **3-Report Auto-Hide:** If a job receives 3 or more reports from seekers, it is automatically hidden from listings until an admin completes a moderation review.
- **Double-Blind Ratings:** 1–5 stars with positive and red tags. Ratings are revealed only after both parties have rated each other.
- **Urgent Boost for ₹49:** Post free or boost for ₹49 to appear first in listings for 24 hours with an "Urgent" tag (idempotent, mock UPI/card included).
- **Maps Navigation:** No bulky in-app maps. Clean Google Maps walking direction links with origin omitted so Google Maps uses the phone's live GPS.

---

## 2. Tech Stack

- **Backend:** Python 3.11+, Flask (Application Factory & Blueprints), Flask-SQLAlchemy, Flask-Migrate, Flask-WTF, Flask-Limiter.
- **Database:** MySQL as main (`DATABASE_URL` env var), SQLite automatic fallback for zero-configuration local runs.
- **Frontend:** Bootstrap 5 CDN, Bootstrap Icons, HTML5, CSS3, vanilla JavaScript. Mobile-first design with 44px+ tap targets.
- **Testing:** `pytest` test suite covering OTP, live scam check, geolocation filtering, boost idempotency, moderation auto-hide, and rating reveal.

---

## 3. Project Structure

```text
PARTBASE/
├── app/
│   ├── __init__.py               # Application factory
│   ├── extensions.py             # SQLAlchemy, Migrate, CSRF, Limiter
│   ├── models.py                 # User, Shop, Job, Application, Area, Rating, Report, Ticket
│   ├── blueprints/
│   │   ├── auth.py               # Landing, OTP login, verify, logout
│   │   ├── seeker.py             # Setup, jobs feed, job detail, apply, applications, rate, report
│   │   ├── employer.py           # Setup, posts, post form, applicant management, boost
│   │   ├── admin.py              # OTP login guard, report queue, review, support inbox, employers
│   │   ├── support.py            # User support tickets & profile role switcher
│   │   └── api.py                # REST JSON API endpoints
│   ├── services/
│   │   ├── otp_service.py        # Pluggable OTP (Console, Msg91, Twilio)
│   │   ├── scam_check.py         # Live keyword & pattern scam scanner
│   │   ├── payment_service.py    # ₹49 boost provider with idempotency
│   │   └── notification_service.py# In-app event dispatcher
│   ├── utils/
│   │   ├── geo.py                # Haversine distance & Google Maps links
│   │   └── helpers.py            # Phone masking, rating reveal, moderation rules
│   ├── static/
│   │   ├── css/main.css          # Design system (#1B3A6B navy, #1A9A8F teal, #EAF4FA bg)
│   │   └── js/                   # main.js, otp.js, post_job.js, filters.js
│   └── templates/                # Jinja2 templates (all 35 blueprint views)
│       ├── base.html
│       ├── landing.html
│       ├── support.html
│       ├── components/           # _navbar, _footer, _job_card, _safety_banner, _rating_form
│       ├── auth/                 # login.html, verify.html
│       ├── seeker/               # setup, jobs, job_detail, applied_success, applications, rate, report, profile
│       ├── employer/             # setup, posts, post_form, job_live, job_detail, applicant, boost, rate, profile
│       ├── admin/                # login, verify, denied, reports, review_job, support, employers
│       └── errors/               # 404.html, 500.html
├── tests/                        # Pytest suite
│   ├── test_otp.py
│   ├── test_scam_check.py
│   ├── test_jobs.py
│   └── test_moderation.py
├── config.py                     # App configuration & fallback logic
├── seed.py                       # Pilot seed data (OMR, Anna Nagar, shops, jobs, tickets)
├── wsgi.py                       # Production WSGI entry point
├── Procfile                      # Deployment declaration
├── requirements.txt              # Python dependencies
├── .env.example                  # Environment variables template
└── README.md                     # Documentation
```

---

## 4. Setup & Running Locally

### Step 1: Clone and Set Up Virtual Environment
```bash
git clone https://github.com/<your-username>/PARTBASE.git
cd PARTBASE
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*Note: If `DATABASE_URL` is omitted, the app will automatically use SQLite in `instance/localvelai.db`.*

### Step 4: Seed Database
```bash
python seed.py
```
This populates Chennai areas (OMR, Anna Nagar, Thoraipakkam, Neelankarai), verified shops (Sri Murugan Tailors, Anand Stores), seekers (Priya K, Arun S), active jobs, sample applications, tickets T-1 to T-4, and flagged scam listings.

### Step 5: Run the Application
```bash
flask run
```
Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

---

## 5. Running Tests

Run the complete test suite with `pytest`:
```bash
pytest
```

---

## 6. Seed Accounts & Roles

| Role | Name | Phone Number | Area |
| :--- | :--- | :--- | :--- |
| **Admin** | PARTBASE Admin | `+919876500000` | Anna Nagar |
| **Employer** | Murugan (Sri Murugan Tailors) | `+919876543210` | Thoraipakkam |
| **Employer** | Anand (Anand Stores) | `+919876543211` | Thoraipakkam |
| **Employer** | Meena R (Meena Fancy Store) | `+919876543212` | Neelankarai |
| **Seeker** | Priya K | `+919876511111` | OMR |
| **Seeker** | Arun S | `+919876522222` | OMR |
| **Seeker** | Divya M | `+919876533333` | OMR |

*When logging in using the Console OTP provider, check your terminal for the generated 6-digit OTP.*

---

## 7. Environment Variables Reference

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `SECRET_KEY` | *(auto-generated dev key)* | Flask session and CSRF signing secret |
| `DATABASE_URL` | *SQLite fallback* | MySQL connection string (`mysql+pymysql://...`) |
| `ADMIN_PHONES` | `+919876500000` | Comma-separated list of approved admin phone numbers |
| `OTP_PROVIDER` | `console` | `console` (dev/default), `msg91`, or `twilio` |
| `PORT` | `5000` | Port for production server |

---

## 8. Git Push Protocol Compliance

This repository was constructed strictly following the Antigravity Push Protocol:
- Created public GitHub repository `PARTBASE` on `main`.
- Committed and pushed strictly one file at a time in conventional commit format.
- Observed a 60-second gap between individual file pushes.
- Clean sequential commit history without batching or secret leaks.
