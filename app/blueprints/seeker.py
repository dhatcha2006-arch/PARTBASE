from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from app.extensions import db
from app.models import User, Area, Job, Application, SeekerProfile, Shop, Rating, Report, Ticket, View
from app.utils.geo import haversine_distance, build_google_maps_url
from app.utils.helpers import reveal_ratings_if_both_rated, check_and_auto_hide_job
from app.services.notification_service import NotificationService

seeker_bp = Blueprint("seeker", __name__)

def seeker_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("user_id"):
            session["intent_role"] = "seeker"
            return redirect(url_for("auth.login"))
        user = User.query.get(session["user_id"])
        if not user:
            session.clear()
            return redirect(url_for("auth.login"))
        return f(*args, **kwargs)
    return decorated_function

@seeker_bp.route("/setup", methods=["GET", "POST"])
@seeker_required
def setup():
    user = User.query.get(session["user_id"])
    areas = Area.query.order_by(Area.name).all()

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        area_id = request.form.get("area_id")
        free_slots = request.form.getlist("free_slots")
        interests = request.form.getlist("interests")

        if not name:
            flash("Please enter your name.", "danger")
            return render_template("seeker/setup.html", user=user, areas=areas)

        user.name = name
        if area_id:
            user.area_id = int(area_id)
            area = Area.query.get(int(area_id))
            if area:
                user.lat = area.lat
                user.lng = area.lng

        user.free_slots = ",".join(free_slots) if free_slots else "anytime"
        user.active_role = "seeker"

        # Update or create SeekerProfile
        profile = user.seeker_profile or SeekerProfile(user_id=user.id)
        profile.interests = ",".join(interests) if interests else ""
        profile.free_slots = user.free_slots
        db.session.add(profile)
        db.session.commit()

        flash("Profile setup complete! Here are jobs near you.", "success")
        return redirect(url_for("seeker.jobs"))

    return render_template("seeker/setup.html", user=user, areas=areas)

@seeker_bp.route("/jobs")
def jobs():
    user_id = session.get("user_id")
    user = User.query.get(user_id) if user_id else None
    profile = user.seeker_profile if user else None

    # Filters from query params
    area_id = request.args.get("area_id", type=int) or (user.area_id if user else None) or (Area.query.first().id if Area.query.first() else 1)
    radius = request.args.get("radius", default=3.0, type=float)
    day_filter = request.args.get("day", default="")
    timing_filter = request.args.get("timing", default="")
    pay_types = request.args.getlist("pay_type") or ["hour", "day"]

    # Selected categories (pre-ticked from profile interests if not specified)
    selected_categories = request.args.getlist("category")
    if not selected_categories and profile and profile.interests:
        selected_categories = [i.strip() for i in profile.interests.split(",") if i.strip()]

    selected_area = Area.query.get(area_id)
    center_lat = (user.lat if user and user.lat else (selected_area.lat if selected_area else 12.9352))
    center_lng = (user.lng if user and user.lng else (selected_area.lng if selected_area else 80.2290))

    # Exclude jobs already applied to
    applied_job_ids = [a.job_id for a in Application.query.filter_by(seeker_id=user.id).all()] if user else []

    # Query open jobs
    query = Job.query.filter(Job.status == "open")
    if applied_job_ids:
        query = query.filter(~Job.id.in_(applied_job_ids))

    if day_filter in ["today", "tomorrow", "weekend"]:
        query = query.filter(Job.day_option == day_filter)

    if pay_types:
        query = query.filter(Job.pay_type.in_(pay_types))

    if selected_categories:
        query = query.filter(Job.category.in_(selected_categories))

    candidate_jobs = query.all()

    # Calculate distance and filter by radius
    filtered_jobs = []
    for j in candidate_jobs:
        shop_lat = j.shop.lat if j.shop and j.shop.lat else (j.shop.area.lat if j.shop and j.shop.area else center_lat)
        shop_lng = j.shop.lng if j.shop and j.shop.lng else (j.shop.area.lng if j.shop and j.shop.area else center_lng)
        dist = haversine_distance(center_lat, center_lng, shop_lat, shop_lng)
        if dist <= radius:
            j._computed_distance = dist
            filtered_jobs.append(j)

    # Sort: boosted jobs first, then distance ascending, then created_at descending
    filtered_jobs.sort(key=lambda j: (not j.is_currently_boosted, j._computed_distance, -j.created_at.timestamp()))

    areas = Area.query.order_by(Area.name).all()

    return render_template(
        "seeker/jobs.html",
        jobs=filtered_jobs,
        user=user,
        areas=areas,
        selected_area=selected_area,
        selected_radius=radius,
        selected_day=day_filter,
        selected_categories=selected_categories,
        selected_pay_types=pay_types,
        total_count=len(filtered_jobs)
    )

@seeker_bp.route("/jobs/<int:job_id>", methods=["GET", "POST"])
def job_detail(job_id):
    user_id = session.get("user_id")
    user = User.query.get(user_id) if user_id else None
    job = Job.query.get_or_404(job_id)

    # Record view
    if user:
        existing_view = View.query.filter_by(job_id=job.id, seeker_id=user.id).first()
        if not existing_view:
            view = View(job_id=job.id, seeker_id=user.id)
            db.session.add(view)
            job.view_count += 1
            db.session.commit()

    # Distance calculation
    seeker_lat = (user.lat if user and user.lat else (user.area.lat if user and user.area else 12.9352))
    seeker_lng = (user.lng if user and user.lng else (user.area.lng if user and user.area else 80.2290))
    shop_lat = job.shop.lat if job.shop and job.shop.lat else (job.shop.area.lat if job.shop and job.shop.area else seeker_lat)
    shop_lng = job.shop.lng if job.shop and job.shop.lng else (job.shop.area.lng if job.shop and job.shop.area else seeker_lng)
    distance = haversine_distance(seeker_lat, seeker_lng, shop_lat, shop_lng)

    # Directions URL
    area_name = job.shop.area.name if job.shop and job.shop.area else "Chennai"
    directions_url = build_google_maps_url(job.shop.shop_name, area_name)

    # Check if already applied
    existing_app = Application.query.filter_by(job_id=job.id, seeker_id=user.id).first() if user else None

    # Similar jobs if closed/filled
    similar_jobs = []
    if job.status != "open" or job.is_filled:
        similar_jobs = Job.query.filter(
            Job.id != job.id,
            Job.status == "open",
            Job.category == job.category
        ).limit(3).all()

    if request.method == "POST":
        if not user:
            session["intent_role"] = "seeker"
            flash("Please sign in or use 1-click Demo Seeker to apply for this job.", "info")
            return redirect(url_for("auth.login"))

        if job.status != "open" or job.is_filled:
            flash("This job is already filled or closed.", "warning")
            return redirect(url_for("seeker.job_detail", job_id=job.id))

        if existing_app:
            flash("You have already applied to this job.", "info")
            return redirect(url_for("seeker.applications"))

        note = request.form.get("note", "").strip()
        app_entry = Application(
            job_id=job.id,
            seeker_id=user.id,
            note=note,
            status="applied"
        )
        db.session.add(app_entry)
        db.session.commit()

        NotificationService.notify_employer_new_application(job, app_entry)
        session["last_applied_shop"] = job.shop.shop_name
        session["last_applied_title"] = job.title
        session["last_applied_phone"] = job.shop.owner.phone if job.shop.owner else ""
        return redirect(url_for("seeker.applied_success"))

    return render_template(
        "seeker/job_detail.html",
        job=job,
        user=user,
        distance=distance,
        directions_url=directions_url,
        existing_app=existing_app,
        similar_jobs=similar_jobs
    )

@seeker_bp.route("/applied-success")
@seeker_required
def applied_success():
    shop_name = session.get("last_applied_shop", "The shop")
    shop_phone = session.get("last_applied_phone", "")
    job_title = session.get("last_applied_title", "Job")
    return render_template("seeker/applied_success.html", shop_name=shop_name, shop_phone=shop_phone, job_title=job_title)

@seeker_bp.route("/applications")
@seeker_required
def applications():
    user = User.query.get(session["user_id"])
    tab = request.args.get("tab", "all")

    query = Application.query.filter_by(seeker_id=user.id)
    if tab != "all":
        query = query.filter_by(status=tab)

    apps = query.order_by(Application.applied_at.desc()).all()

    # Pre-calculate directions and rating status
    for a in apps:
        area_name = a.job.shop.area.name if a.job.shop and a.job.shop.area else "Chennai"
        a.directions_url = build_google_maps_url(a.job.shop.shop_name, area_name)
        existing_rating = Rating.query.filter_by(job_id=a.job_id, rater_id=user.id).first()
        a.is_rated = bool(existing_rating)

    return render_template("seeker/applications.html", applications=apps, active_tab=tab, user=user)

@seeker_bp.route("/applications/<int:app_id>/withdraw", methods=["POST"])
@seeker_required
def withdraw_application(app_id):
    user = User.query.get(session["user_id"])
    app_entry = Application.query.filter_by(id=app_id, seeker_id=user.id).first_or_404()
    if app_entry.status == "applied":
        app_entry.status = "withdrawn"
        db.session.commit()
        flash("Application withdrawn.", "info")
    return redirect(url_for("seeker.applications"))

@seeker_bp.route("/rate/<int:app_id>", methods=["GET", "POST"])
@seeker_required
def rate(app_id):
    user = User.query.get(session["user_id"])
    app_entry = Application.query.filter_by(id=app_id, seeker_id=user.id).first_or_404()
    job = app_entry.job
    shop = job.shop

    existing = Rating.query.filter_by(job_id=job.id, application_id=app_entry.id, rater_id=user.id).first()
    if existing:
        flash("You have already rated this job.", "info")
        return redirect(url_for("seeker.applications"))

    if request.method == "POST":
        stars = request.form.get("stars", 5, type=int)
        positive_tags = request.form.getlist("positive_tags")
        red_tags = request.form.getlist("red_tags")
        comment = request.form.get("comment", "").strip()

        rating = Rating(
            job_id=job.id,
            application_id=app_entry.id,
            rater_id=user.id,
            ratee_id=shop.owner_user_id,
            direction="seeker_to_shop",
            stars=stars,
            positive_tags=",".join(positive_tags),
            red_tags=",".join(red_tags),
            comment=comment,
            revealed=False
        )
        db.session.add(rating)
        db.session.commit()

        # Check double-blind reveal
        reveal_ratings_if_both_rated(job.id, app_entry.id)
        flash("Rating submitted! Ratings are revealed once both parties rate.", "success")
        return redirect(url_for("seeker.applications"))

    return render_template("seeker/rate.html", application=app_entry, job=job, shop=shop)

@seeker_bp.route("/report/<int:job_id>", methods=["GET", "POST"])
@seeker_required
def report_job(job_id):
    user = User.query.get(session["user_id"])
    job = Job.query.get_or_404(job_id)

    if request.method == "POST":
        reason = request.form.get("reason", "other")
        details = request.form.get("details", "").strip()

        # Create linked Support Ticket automatically
        ticket = Ticket(
            raised_by_id=user.id,
            role="seeker",
            issue_type="scam_fee_request" if reason == "asked_money" else "other",
            job_id=job.id,
            description=f"Job Report: {reason.replace('_', ' ').title()}. Details: {details}",
            status="open"
        )
        db.session.add(ticket)
        db.session.flush()

        report = Report(
            job_id=job.id,
            reporter_id=user.id,
            reason=reason,
            details=details,
            ticket_id=ticket.id
        )
        db.session.add(report)
        db.session.commit()

        # Check moderation rule: 3 reports auto-hides job
        check_and_auto_hide_job(job.id)

        session["last_ticket_code"] = ticket.ticket_code
        return redirect(url_for("seeker.report_sent"))

    return render_template("seeker/report.html", job=job, user=user)

@seeker_bp.route("/report-sent")
@seeker_required
def report_sent():
    ticket_code = session.get("last_ticket_code", "T-1")
    return render_template("seeker/report_sent.html", ticket_code=ticket_code)

@seeker_bp.route("/map-helper")
@seeker_required
def map_helper():
    user = User.query.get(session["user_id"])
    # Route to next hired job if any
    next_hired_app = Application.query.filter_by(seeker_id=user.id, status="hired").first()
    if next_hired_app and next_hired_app.job and next_hired_app.job.shop:
        area_name = next_hired_app.job.shop.area.name if next_hired_app.job.shop.area else "Chennai"
        return redirect(build_google_maps_url(next_hired_app.job.shop.shop_name, area_name))

    # Fallback to seeker's area
    area_name = user.area.name if user.area else "OMR Chennai"
    return redirect(f"https://www.google.com/maps/search/?api=1&query={area_name}+Chennai")

@seeker_bp.route("/profile", methods=["GET", "POST"])
@seeker_required
def profile():
    return redirect(url_for("support.profile"))
