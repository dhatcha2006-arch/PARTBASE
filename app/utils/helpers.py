import re
from datetime import datetime
from app.extensions import db

def mask_phone(phone):
    """
    Mask phone number for privacy: e.g. +91 98765 43210 -> +91 98xxx xxxxx
    """
    if not phone:
        return ""
    digits = re.sub(r"\D", "", phone)
    if len(digits) >= 10:
        country_code = "+91 " if phone.startswith("+91") else ""
        first_two = digits[-10:-8]
        return f"{country_code}{first_two}xxx xxxxx"
    return phone

def format_currency(amount, pay_type="hour"):
    """
    Format pay display: e.g. ₹120/hr or ₹600/day
    """
    suffix = "/hr" if pay_type == "hour" else "/day"
    return f"₹{amount}{suffix}"

def reveal_ratings_if_both_rated(job_id, application_id=None):
    """
    Double-blind rating reveal logic:
    Checks if both seeker_to_shop and shop_to_seeker ratings exist.
    When both have rated, sets revealed = True on both ratings,
    and updates the Shop rating average/count and Seeker rating average/jobs_completed.
    """
    from app.models import Rating, Shop, SeekerProfile, Application

    query = Rating.query.filter_by(job_id=job_id)
    if application_id:
        query = query.filter_by(application_id=application_id)
    
    ratings = query.all()
    seeker_to_shop = next((r for r in ratings if r.direction == "seeker_to_shop"), None)
    shop_to_seeker = next((r for r in ratings if r.direction == "shop_to_seeker"), None)

    if not (seeker_to_shop and shop_to_seeker):
        return False

    for r in ratings:
        r.revealed = True
    db.session.commit()

    # Update Shop ratings — ratee_id on seeker_to_shop is the shop owner
    shop = Shop.query.filter_by(owner_user_id=seeker_to_shop.ratee_id).first()
    if shop:
        all_shop_ratings = Rating.query.filter_by(
            ratee_id=seeker_to_shop.ratee_id,
            direction="seeker_to_shop",
            revealed=True
        ).all()
        if all_shop_ratings:
            shop.rating_count = len(all_shop_ratings)
            shop.rating_avg = round(sum(r.stars for r in all_shop_ratings) / len(all_shop_ratings), 1)

    # Update Seeker ratings — ratee_id on shop_to_seeker is the seeker
    seeker_profile = SeekerProfile.query.filter_by(user_id=shop_to_seeker.ratee_id).first()
    if seeker_profile:
        all_seeker_ratings = Rating.query.filter_by(
            ratee_id=shop_to_seeker.ratee_id,
            direction="shop_to_seeker",
            revealed=True
        ).all()
        if all_seeker_ratings:
            stars_list = [r.stars for r in all_seeker_ratings]
            seeker_profile.rating_avg = round(sum(stars_list) / len(stars_list), 1)
        completed_apps = Application.query.filter_by(seeker_id=seeker_profile.user_id, status="completed").count()
        seeker_profile.jobs_completed = max(seeker_profile.jobs_completed, completed_apps)

    db.session.commit()
    return True

def check_and_auto_hide_job(job_id):
    """
    Moderation Rule: If a job accumulates 3 or more reports,
    it is automatically hidden from seeker listings until reviewed by an admin.
    """
    from app.models import Job, Report
    job = db.session.get(Job, job_id)
    if not job:
        return False

    report_count = Report.query.filter_by(job_id=job_id).count()
    job.report_count = report_count
    if report_count >= 3:
        if job.status not in ["deleted", "hidden"]:
            job.status = "hidden"
            db.session.commit()
            return True
    db.session.commit()
    return False

def format_inr(amount):
    """
    Format amount into Indian numbering system with ₹ symbol (e.g., ₹1,00,000).
    """
    if amount is None:
        return "₹0"
    try:
        val = int(amount)
    except (ValueError, TypeError):
        return f"₹{amount}"

    s = str(abs(val))
    if len(s) <= 3:
        formatted = s
    else:
        last3 = s[-3:]
        rest = s[:-3]
        groups = []
        while len(rest) > 2:
            groups.insert(0, rest[-2:])
            rest = rest[:-2]
        if rest:
            groups.insert(0, rest)
        formatted = ",".join(groups) + "," + last3

    prefix = "-₹" if val < 0 else "₹"
    return f"{prefix}{formatted}"


def log_telemetry_event(event_name, data=None):
    """Log lightweight client/server telemetry event for local monitoring."""
    return {"event": event_name, "data": data or {}}
