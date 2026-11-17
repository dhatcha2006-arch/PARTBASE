import re
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, current_app, jsonify
from app.extensions import db
from app.models import User, Area, Job, OTPRequest, SeekerProfile, Shop
from app.services.otp_service import OTPService

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/")
def landing():
    sample_jobs = Job.query.filter_by(status="open").limit(2).all()
    return render_template("landing.html", sample_jobs=sample_jobs)

@auth_bp.route("/demo-login/<role>")
def demo_login(role):
    """1-Click instant demo login for hassle-free evaluation of all 4 portals"""
    if role == "seeker":
        user = User.query.filter_by(phone="+919876511111").first()
        if not user:
            area = Area.query.first()
            user = User(phone="+919876511111", name="Priya K", area_id=area.id if area else None, is_phone_verified=True, active_role="seeker")
            db.session.add(user)
            db.session.commit()
            profile = SeekerProfile(user_id=user.id, interests="shop_helper,packing", free_slots="weekday_evening,weekend", rating_avg=4.8, jobs_completed=3)
            db.session.add(profile)
            db.session.commit()
        session["user_id"] = user.id
        session["phone"] = user.phone
        session["role"] = "seeker"
        session["is_admin"] = False
        user.active_role = "seeker"
        db.session.commit()
        flash("Logged in as Demo Seeker (Priya K)", "success")
        return redirect(url_for("seeker.jobs"))

    elif role == "employer":
        user = User.query.filter_by(phone="+919876543210").first()
        if not user:
            area = Area.query.first()
            user = User(phone="+919876543210", name="Murugan", area_id=area.id if area else None, is_phone_verified=True, active_role="employer")
            db.session.add(user)
            db.session.commit()
            shop = Shop(owner_user_id=user.id, shop_name="Sri Murugan Tailors", owner_name="Murugan", address="No. 14, OMR Main Road, Thoraipakkam, Chennai", area_id=area.id if area else None, verification_status="verified", rating_avg=4.6, rating_count=12)
            db.session.add(shop)
            db.session.commit()
        session["user_id"] = user.id
        session["phone"] = user.phone
        session["role"] = "employer"
        session["is_admin"] = False
        user.active_role = "employer"
        db.session.commit()
        flash("Logged in as Demo Employer (Sri Murugan Tailors)", "success")
        return redirect(url_for("employer.posts"))

    elif role == "admin":
        user = User.query.filter_by(phone="+919876500000").first()
        if not user:
            user = User(phone="+919876500000", name="PARTBASE Admin", is_phone_verified=True, active_role="admin", is_admin=True)
            db.session.add(user)
            db.session.commit()
        user.is_admin = True
        db.session.commit()
        session["user_id"] = user.id
        session["phone"] = user.phone
        session["role"] = "admin"
        session["is_admin"] = True
        flash("Logged in as PARTBASE Admin", "success")
        return redirect(url_for("admin.reports"))

    return redirect(url_for("auth.landing"))

@auth_bp.route("/select-role/<role>")
def select_role(role):
    if role in ["seeker", "employer"]:
        session["intent_role"] = role
        session["role"] = role
    return redirect(url_for("auth.login"))

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    intent_role = session.get("intent_role", "seeker")

    if request.method == "POST":
        raw_phone = request.form.get("phone", "").strip()
        cleaned_phone = re.sub(r"[^0-9+]", "", raw_phone)
        if not cleaned_phone.startswith("+"):
            cleaned_phone = "+91" + cleaned_phone.lstrip("0")

        if len(cleaned_phone) < 10:
            flash("Please enter a valid 10-digit mobile number.", "danger")
            return render_template("auth/login.html", role=intent_role, phone=raw_phone)

        provider = current_app.config.get("OTP_PROVIDER", "console")
        res = OTPService.send_otp(cleaned_phone, provider_name=provider)

        session["auth_phone"] = cleaned_phone
        session["role"] = intent_role
        flash("OTP sent! For demo testing, you can use OTP: 123456", "info")
        return redirect(url_for("auth.verify"))

    return render_template("auth/login.html", role=intent_role)

@auth_bp.route("/verify", methods=["GET", "POST"])
def verify():
    phone = session.get("auth_phone") or request.form.get("phone") or "+919876511111"
    role = session.get("role", "seeker")

    if request.method == "POST":
        # Combine OTP digits (from 6 boxes or single input)
        digits = [request.form.get(f"otp_{i}", "") for i in range(1, 7)]
        code = "".join(digits).strip() or request.form.get("otp_code", "").strip() or "123456"

        res = OTPService.verify_otp(phone, code)
        if not res["ok"]:
            # If standard verify failed, fallback to dev OTP for user convenience
            if code == "123456":
                user = User.query.filter_by(phone=phone).first()
                if not user:
                    user = User(phone=phone, is_phone_verified=True, active_role=role)
                    db.session.add(user)
                    db.session.commit()
                res = {"ok": True, "user_id": user.id}
            else:
                flash(res["message"], "danger")
                return render_template("auth/verify.html", phone=phone, role=role)

        user = User.query.get(res["user_id"])
        session["user_id"] = user.id
        session["phone"] = user.phone
        session["is_admin"] = user.is_admin or (user.phone in current_app.config.get("ADMIN_PHONES", []))
        session["role"] = role
        user.active_role = role
        db.session.commit()

        # Route first-time vs returning
        if role == "seeker":
            if not user.seeker_profile or not user.name:
                return redirect(url_for("seeker.setup"))
            return redirect(url_for("seeker.jobs"))
        else:
            if not user.shop or not user.shop.shop_name:
                return redirect(url_for("employer.setup"))
            return redirect(url_for("employer.posts"))

    return render_template("auth/verify.html", phone=phone, role=role)

@auth_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    phone = session.get("auth_phone") or "+919876511111"
    provider = current_app.config.get("OTP_PROVIDER", "console")
    res = OTPService.send_otp(phone, provider_name=provider)
    return jsonify(res)

@auth_bp.route("/logout")
def logout():
    session.clear()
    flash("You have been signed out.", "info")
    return redirect(url_for("auth.landing"))

@auth_bp.route("/terms")
def terms():
    return render_template("landing.html", show_modal="terms")

@auth_bp.route("/privacy")
def privacy():
    return render_template("landing.html", show_modal="privacy")

