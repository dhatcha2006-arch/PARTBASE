import json
from functools import wraps
from datetime import datetime, timedelta
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from app.extensions import db
from app.models import User, Area, Shop, Job, Application, Rating, Payment, Draft
from app.services.scam_check import ScamCheckService
from app.services.payment_service import PaymentService
from app.services.notification_service import NotificationService
from app.utils.geo import haversine_distance, build_google_maps_url
from app.utils.helpers import reveal_ratings_if_both_rated

employer_bp = Blueprint("employer", __name__)

def employer_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("user_id"):
            session["intent_role"] = "employer"
            return redirect(url_for("auth.login"))
        user = User.query.get(session["user_id"])
        if not user:
            session.clear()
            return redirect(url_for("auth.login"))
        return f(*args, **kwargs)
    return decorated_function

@employer_bp.route("/setup", methods=["GET", "POST"])
@employer_required
def setup():
    user = User.query.get(session["user_id"])
    areas = Area.query.order_by(Area.name).all()

    if request.method == "POST":
        shop_name = request.form.get("shop_name", "").strip()
        owner_name = request.form.get("owner_name", "").strip()
        address = request.form.get("address", "").strip()
        area_id = request.form.get("area_id")
        proof_type = request.form.get("proof_type", "maps_link")
        proof_value = request.form.get("proof_value", "").strip()

        if not shop_name or not owner_name or not address:
            flash("Please enter shop name, owner name and address.", "danger")
            return render_template("employer/setup.html", user=user, areas=areas)

        user.name = owner_name
        user.active_role = "employer"

        shop = user.shop or Shop(owner_user_id=user.id)
        shop.shop_name = shop_name
        shop.owner_name = owner_name
        shop.address = address
        if area_id:
            shop.area_id = int(area_id)
            user.area_id = int(area_id)
            area = Area.query.get(int(area_id))
            if area:
                shop.lat = area.lat
                shop.lng = area.lng
                user.lat = area.lat
                user.lng = area.lng

        if proof_value:
            shop.proof_type = proof_type
            shop.proof_value = proof_value
            shop.verification_status = "pending"
        else:
            shop.verification_status = "unverified"

        db.session.add(shop)
        db.session.commit()

        flash("Shop profile created!", "success")
        return redirect(url_for("employer.posts"))

    return render_template("employer/setup.html", user=user, areas=areas)

@employer_bp.route("/posts")
def posts():
    user_id = session.get("user_id")
    if not user_id:
        return redirect(url_for("auth.demo_login", role="employer"))
    user = User.query.get(session["user_id"])
    if not user.shop:
        return redirect(url_for("employer.setup"))

    jobs = Job.query.filter_by(shop_id=user.shop.id).order_by(Job.created_at.desc()).all()
    draft = Draft.query.filter_by(user_id=user.id).first()
    draft_data = json.loads(draft.payload) if draft and draft.payload else None

    return render_template("employer/posts.html", shop=user.shop, jobs=jobs, draft_data=draft_data)

@employer_bp.route("/post", methods=["GET", "POST"])
def post_job():
    user_id = session.get("user_id")
    user = User.query.get(user_id) if user_id else None
    
    # If not logged in on POST, prompt demo or login
    if request.method == "POST" and (not user or not user.shop):
        flash("Please log in or use 1-click Demo Employer to publish your job.", "info")
        return redirect(url_for("auth.demo_login", role="employer"))

    if user and not user.shop:
        return redirect(url_for("employer.setup"))

    shop = user.shop if user and user.shop else (Shop.query.first() or Shop(shop_name="Your Shop Name", address="Chennai, Tamil Nadu"))

    # Check for copy / prefill
    prefill = {}
    copy_job_id = request.args.get("copy_from", type=int)
    if copy_job_id:
        src_job = Job.query.filter_by(id=copy_job_id, shop_id=shop.id).first()
        if src_job:
            prefill = {
                "category": src_job.category,
                "title": src_job.title,
                "day_option": src_job.day_option,
                "time_range": src_job.time_range,
                "pay_amount": src_job.pay_amount,
                "pay_type": src_job.pay_type,
                "people_needed": src_job.people_needed,
                "address": src_job.address or shop.address,
                "details": src_job.details
            }

    if request.method == "POST":
        category = request.form.get("category", "shop_helper")
        title = request.form.get("title", "").strip()
        day_option = request.form.get("day_option", "today")
        time_range = request.form.get("time_range", "5:00 pm to 9:00 pm").strip()
        pay_amount = request.form.get("pay_amount", 100, type=int)
        pay_type = request.form.get("pay_type", "hour")
        people_needed = request.form.get("people_needed", 1, type=int)
        address = request.form.get("address", shop.address).strip()
        details = request.form.get("details", "").strip()

        # Enforce server-side scam check
        scam_res = ScamCheckService.check_text(title, details)
        if not scam_res["ok"]:
            flash("This looks like a fee request. Jobs that ask for money are not allowed on PARTBASE. Please remove it.", "danger")
            return render_template("employer/post_form.html", shop=shop, prefill=request.form, blocked=True)

        # Verified shop goes live instantly, Unverified shop goes to pending_review
        status = "open" if shop.is_verified else "pending_review"

        job = Job(
            shop_id=shop.id,
            category=category,
            title=title,
            day_option=day_option,
            time_range=time_range,
            pay_amount=pay_amount,
            pay_type=pay_type,
            people_needed=people_needed,
            address=address,
            details=details,
            status=status
        )
        db.session.add(job)

        # Clear draft if exists
        Draft.query.filter_by(user_id=user.id).delete()
        db.session.commit()

        session["last_posted_job_id"] = job.id
        return redirect(url_for("employer.job_live"))

    return render_template("employer/post_form.html", shop=shop, prefill=prefill, blocked=False)

@employer_bp.route("/post/live")
@employer_required
def job_live():
    job_id = session.get("last_posted_job_id")
    job = Job.query.get(job_id) if job_id else None
    user = User.query.get(session["user_id"])
    return render_template("employer/job_live.html", job=job, shop=user.shop)

@employer_bp.route("/jobs/<int:job_id>")
@employer_required
def job_detail(job_id):
    user = User.query.get(session["user_id"])
    job = Job.query.filter_by(id=job_id, shop_id=user.shop.id).first_or_404()

    applicants = Application.query.filter_by(job_id=job.id).all()
    # Compute applicant distance and free slots
    for app in applicants:
        s_user = app.seeker
        s_lat = s_user.lat or (s_user.area.lat if s_user.area else 12.9352)
        s_lng = s_user.lng or (s_user.area.lng if s_user.area else 80.2290)
        app.distance_km = haversine_distance(user.shop.lat or 12.9352, user.shop.lng or 80.2290, s_lat, s_lng)
        app.seeker_rating = app.seeker.seeker_profile.rating_avg if app.seeker.seeker_profile else 0.0

    return render_template("employer/job_detail.html", job=job, shop=user.shop, applicants=applicants)

@employer_bp.route("/applicants/<int:app_id>")
@employer_required
def applicant_profile(app_id):
    user = User.query.get(session["user_id"])
    app_entry = Application.query.get_or_404(app_id)
    if app_entry.job.shop_id != user.shop.id:
        flash("Unauthorized", "danger")
        return redirect(url_for("employer.posts"))

    seeker = app_entry.seeker
    profile = seeker.seeker_profile
    distance = haversine_distance(
        user.shop.lat or 12.9352, user.shop.lng or 80.2290,
        seeker.lat or 12.9352, seeker.lng or 80.2290
    )

    return render_template(
        "employer/applicant.html",
        application=app_entry,
        seeker=seeker,
        profile=profile,
        distance=distance,
        shop=user.shop
    )

@employer_bp.route("/applicants/<int:app_id>/status", methods=["POST"])
@employer_required
def update_applicant_status(app_id):
    user = User.query.get(session["user_id"])
    app_entry = Application.query.get_or_404(app_id)
    job = app_entry.job
    if job.shop_id != user.shop.id:
        flash("Unauthorized", "danger")
        return redirect(url_for("employer.posts"))

    new_status = request.form.get("status", "applied")
    if new_status in ["shortlisted", "hired", "rejected", "completed"]:
        app_entry.status = new_status
        if new_status == "hired":
            job.hired_count += 1
            NotificationService.notify_seeker_hired(job, app_entry.seeker)
            # If filled, auto-close job
            if job.hired_count >= job.people_needed:
                job.status = "closed"
        db.session.commit()
        flash(f"Applicant status updated to {new_status.title()}.", "success")

    return redirect(url_for("employer.job_detail", job_id=job.id))

@employer_bp.route("/jobs/<int:job_id>/complete", methods=["POST"])
@employer_required
def complete_job(job_id):
    user = User.query.get(session["user_id"])
    job = Job.query.filter_by(id=job_id, shop_id=user.shop.id).first_or_404()

    job.status = "completed"
    # Mark hired applicants as completed
    hired_apps = Application.query.filter_by(job_id=job.id, status="hired").all()
    for a in hired_apps:
        a.status = "completed"
    db.session.commit()

    flash("Job marked as complete. Please rate your worker(s).", "success")
    if hired_apps:
        return redirect(url_for("employer.rate_worker", app_id=hired_apps[0].id))
    return redirect(url_for("employer.posts"))

@employer_bp.route("/boost/<int:job_id>", methods=["GET", "POST"])
@employer_required
def boost_job(job_id):
    user = User.query.get(session["user_id"])
    job = Job.query.filter_by(id=job_id, shop_id=user.shop.id).first_or_404()

    if request.method == "POST":
        method = request.form.get("method", "upi")
        res = PaymentService.boost_job(shop_id=user.shop.id, job_id=job.id, method=method)
        if res["ok"]:
            session["boosted_job_title"] = job.title
            return redirect(url_for("employer.boost_live", job_id=job.id))
        else:
            flash(res.get("error", "Payment failed"), "danger")

    return render_template("employer/boost.html", job=job, shop=user.shop)

@employer_bp.route("/boost-live")
@employer_required
def boost_live():
    job_id = request.args.get("job_id", type=int)
    job = Job.query.get(job_id) if job_id else None
    return render_template("employer/boost_live.html", job=job)

@employer_bp.route("/rate/<int:app_id>", methods=["GET", "POST"])
@employer_required
def rate_worker(app_id):
    user = User.query.get(session["user_id"])
    app_entry = Application.query.get_or_404(app_id)
    job = app_entry.job
    if job.shop_id != user.shop.id:
        flash("Unauthorized", "danger")
        return redirect(url_for("employer.posts"))

    seeker = app_entry.seeker

    existing = Rating.query.filter_by(job_id=job.id, application_id=app_entry.id, rater_id=user.id).first()
    if existing:
        flash("You have already rated this worker.", "info")
        return redirect(url_for("employer.posts"))

    if request.method == "POST":
        stars = request.form.get("stars", 5, type=int)
        positive_tags = request.form.getlist("positive_tags")
        red_tags = request.form.getlist("red_tags")
        comment = request.form.get("comment", "").strip()

        rating = Rating(
            job_id=job.id,
            application_id=app_entry.id,
            rater_id=user.id,
            ratee_id=seeker.id,
            direction="shop_to_seeker",
            stars=stars,
            positive_tags=",".join(positive_tags),
            red_tags=",".join(red_tags),
            comment=comment,
            revealed=False
        )
        db.session.add(rating)
        job.status = "closed"
        db.session.commit()

        # Check double-blind reveal
        reveal_ratings_if_both_rated(job.id, app_entry.id)
        flash("Rating submitted! Job is now marked Closed.", "success")
        return redirect(url_for("employer.posts"))

    return render_template("employer/rate.html", application=app_entry, job=job, seeker=seeker, shop=user.shop)

@employer_bp.route("/profile", methods=["GET", "POST"])
@employer_required
def profile():
    return redirect(url_for("support.profile"))
