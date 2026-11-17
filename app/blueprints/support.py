from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from app.extensions import db
from app.models import User, Ticket, Job, Area, SeekerProfile, Shop

support_bp = Blueprint("support", __name__)

@support_bp.route("/support", methods=["GET", "POST"])
def support():
    user_id = session.get("user_id")
    user = User.query.get(user_id) if user_id else None
    current_role = session.get("role", user.active_role if user else "seeker")

    if request.method == "POST":
        if not user:
            flash("Please sign in or use 1-click Demo to raise a support ticket.", "info")
            return redirect(url_for("auth.login"))
        issue_type = request.form.get("issue_type", "other")
        job_id = request.form.get("job_id", type=int)
        description = request.form.get("description", "").strip()

        if not description:
            flash("Please describe what went wrong.", "danger")
            return redirect(url_for("support.support"))

        ticket = Ticket(
            raised_by_id=user.id,
            role=current_role,
            issue_type=issue_type,
            job_id=job_id if job_id else None,
            description=description,
            status="open"
        )
        db.session.add(ticket)
        db.session.commit()

        flash(f"Ticket {ticket.ticket_code} created! We reply within 24 hours.", "success")
        return redirect(url_for("support.support"))

    # Fetch user's tickets and related jobs
    my_tickets = Ticket.query.filter_by(raised_by_id=user.id).order_by(Ticket.created_at.desc()).all() if user else []
    user_jobs = []
    if user:
        if current_role == "employer" and user.shop:
            user_jobs = Job.query.filter_by(shop_id=user.shop.id).all()
        else:
            user_jobs = [a.job for a in user.applications if a.job]

    return render_template(
        "support.html",
        user=user,
        role=current_role,
        tickets=my_tickets,
        user_jobs=user_jobs
    )

@support_bp.route("/profile", methods=["GET", "POST"])
def profile():
    user_id = session.get("user_id")
    if not user_id:
        return redirect(url_for("auth.login"))

    user = User.query.get(user_id)
    areas = Area.query.order_by(Area.name).all()
    role = session.get("role", user.active_role or "seeker")

    if request.method == "POST":
        if role == "seeker":
            name = request.form.get("name", "").strip()
            area_id = request.form.get("area_id", type=int)
            free_slots = request.form.getlist("free_slots")
            interests = request.form.getlist("interests")

            user.name = name
            if area_id:
                user.area_id = area_id
                area = Area.query.get(area_id)
                if area:
                    user.lat = area.lat
                    user.lng = area.lng

            user.free_slots = ",".join(free_slots) if free_slots else "anytime"
            profile = user.seeker_profile or SeekerProfile(user_id=user.id)
            profile.free_slots = user.free_slots
            profile.interests = ",".join(interests) if interests else ""
            db.session.add(profile)
            db.session.commit()
            flash("Profile updated successfully.", "success")
            return redirect(url_for("seeker.jobs"))

        else:  # employer
            shop_name = request.form.get("shop_name", "").strip()
            owner_name = request.form.get("owner_name", "").strip()
            address = request.form.get("address", "").strip()

            user.name = owner_name
            if user.shop:
                user.shop.shop_name = shop_name
                user.shop.owner_name = owner_name
                user.shop.address = address
            db.session.commit()
            flash("Shop profile updated successfully.", "success")
            return redirect(url_for("employer.posts"))

    if role == "seeker":
        return render_template("seeker/profile.html", user=user, areas=areas, profile=user.seeker_profile)
    else:
        return render_template("employer/profile.html", user=user, shop=user.shop)

@support_bp.route("/switch-role")
def switch_role():
    user_id = session.get("user_id")
    if not user_id:
        return redirect(url_for("auth.login"))

    user = User.query.get(user_id)
    current_role = session.get("role", user.active_role or "seeker")
    new_role = "employer" if current_role == "seeker" else "seeker"

    session["role"] = new_role
    user.active_role = new_role
    db.session.commit()

    flash(f"Switched role to {'Hiring' if new_role == 'employer' else 'Finding jobs'}.", "info")
    if new_role == "employer":
        if not user.shop:
            return redirect(url_for("employer.setup"))
        return redirect(url_for("employer.posts"))
    else:
        if not user.seeker_profile:
            return redirect(url_for("seeker.setup"))
        return redirect(url_for("seeker.jobs"))
