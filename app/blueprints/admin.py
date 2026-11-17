from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, current_app, jsonify
from app.extensions import db
from app.models import User, Area, Shop, Job, Report, Ticket, AuditLog
from app.services.otp_service import OTPService
from app.services.notification_service import NotificationService

admin_bp = Blueprint("admin", __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return redirect(url_for("admin.login"))
        if session.get("is_admin"):
            return f(*args, **kwargs)
        user = User.query.get(user_id)
        is_admin_phone = user and (user.phone in current_app.config.get("ADMIN_PHONES", []))
        if not user or not (user.is_admin or is_admin_phone):
            return redirect(url_for("admin.access_denied"))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        phone = request.form.get("phone", "").strip()
        admin_phones = current_app.config.get("ADMIN_PHONES", [])

        # Strict admin check
        user = User.query.filter_by(phone=phone).first()
        is_admin = (phone in admin_phones) or (user and user.is_admin)

        if not is_admin:
            return redirect(url_for("admin.access_denied"))

        provider = current_app.config.get("OTP_PROVIDER", "console")
        res = OTPService.send_otp(phone, provider_name=provider)
        if res["ok"]:
            session["admin_auth_phone"] = phone
            return redirect(url_for("admin.verify"))
        else:
            flash(res["message"], "danger")

    return render_template("admin/login.html")

@admin_bp.route("/verify", methods=["GET", "POST"])
def verify():
    phone = session.get("admin_auth_phone")
    if not phone:
        return redirect(url_for("admin.login"))

    if request.method == "POST":
        digits = [request.form.get(f"otp_{i}", "") for i in range(1, 7)]
        code = "".join(digits).strip() or request.form.get("otp_code", "").strip()

        res = OTPService.verify_otp(phone, code)
        if res["ok"]:
            user = User.query.get(res["user_id"])
            user.is_admin = True
            db.session.commit()

            session["user_id"] = user.id
            session["phone"] = user.phone
            session["is_admin"] = True
            flash("Admin authentication successful. Opened Report Queue.", "success")
            return redirect(url_for("admin.reports"))
        else:
            flash(res["message"], "danger")

    return render_template("admin/verify.html", phone=phone)

@admin_bp.route("/denied")
def access_denied():
    return render_template("admin/denied.html")

@admin_bp.route("/reports")
@admin_required
def reports():
    reported_jobs = Job.query.filter(Job.report_count > 0, Job.status != "deleted").order_by(Job.report_count.desc()).all()
    pending_shops_count = Shop.query.filter_by(verification_status="pending").count()
    return render_template("admin/reports.html", jobs=reported_jobs, pending_shops_count=pending_shops_count)

@admin_bp.route("/reports/<int:job_id>", methods=["GET", "POST"])
@admin_required
def review_job(job_id):
    job = Job.query.get_or_404(job_id)
    reports = Report.query.filter_by(job_id=job.id).order_by(Report.created_at.desc()).all()
    user = User.query.get(session["user_id"])

    if request.method == "POST":
        action = request.form.get("action")  # 'delete', 'dismiss', 'warn'
        verdict = request.form.get("verdict")
        audit_note = request.form.get("audit_note", "").strip()
        block_employer = bool(request.form.get("block_employer"))
        notify_reporters = bool(request.form.get("notify_reporters"))

        # Verify checklist validation
        check_money = request.form.get("check_money")
        check_shop = request.form.get("check_shop")
        check_reasons = request.form.get("check_reasons")

        if not (check_money and check_shop and check_reasons and audit_note):
            flash("All verify checklist boxes and the audit note are required.", "danger")
            return render_template("admin/review_job.html", job=job, reports=reports)

        # Audit log creation
        log = AuditLog(
            admin_id=user.id,
            action=f"{action}_job",
            target_type="job",
            target_id=job.id,
            note=f"Verdict: {verdict}. Note: {audit_note}"
        )
        db.session.add(log)

        if action == "delete":
            job.status = "deleted"
            if block_employer and job.shop and job.shop.owner:
                job.shop.owner.is_blocked = True
            if notify_reporters:
                NotificationService.notify_reporters_job_removed(job.id, reason=audit_note)
            flash("Job deleted and reports closed. Related tickets updated.", "success")
        elif action == "dismiss":
            job.status = "open"
            job.report_count = 0
            flash("Reports dismissed. Job restored to open status.", "info")
        elif action == "warn":
            flash("Warning issued to employer. Audit log recorded.", "warning")

        db.session.commit()
        return redirect(url_for("admin.reports"))

    return render_template("admin/review_job.html", job=job, reports=reports)

@admin_bp.route("/support")
@admin_required
def support():
    tab = request.args.get("tab", "all")
    selected_id = request.args.get("ticket_id", type=int)

    query = Ticket.query
    if tab == "seeker":
        query = query.filter_by(role="seeker")
    elif tab == "employer":
        query = query.filter_by(role="employer")
    elif tab == "open":
        query = query.filter(Ticket.status != "resolved")

    tickets = query.order_by(Ticket.created_at.desc()).all()
    selected_ticket = Ticket.query.get(selected_id) if selected_id else (tickets[0] if tickets else None)

    return render_template(
        "admin/support.html",
        tickets=tickets,
        selected_ticket=selected_ticket,
        active_tab=tab
    )

@admin_bp.route("/support/<int:ticket_id>/reply", methods=["POST"])
@admin_required
def reply_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    reply_text = request.form.get("admin_reply", "").strip()
    mark_resolved = bool(request.form.get("mark_resolved"))

    if reply_text:
        ticket.admin_reply = reply_text
    if mark_resolved:
        ticket.status = "resolved"
    else:
        ticket.status = "in_review"

    admin_user = User.query.get(session["user_id"])
    log = AuditLog(
        admin_id=admin_user.id,
        action="reply_ticket",
        target_type="ticket",
        target_id=ticket.id,
        note=f"Reply: {reply_text} (Status: {ticket.status})"
    )
    db.session.add(log)
    db.session.commit()

    flash("Reply sent and ticket updated.", "success")
    return redirect(url_for("admin.support", ticket_id=ticket.id))

@admin_bp.route("/employers")
@admin_required
def employers():
    pending_shops = Shop.query.filter_by(verification_status="pending").all()
    all_shops = Shop.query.order_by(Shop.id.desc()).all()
    return render_template("admin/employers.html", pending_shops=pending_shops, all_shops=all_shops)

@admin_bp.route("/employers/<int:shop_id>/action", methods=["POST"])
@admin_required
def verify_employer(shop_id):
    shop = Shop.query.get_or_404(shop_id)
    action = request.form.get("action")  # approve | reject | ask_info
    admin_user = User.query.get(session["user_id"])

    if action == "approve":
        shop.verification_status = "verified"
        # Publish pending first posts automatically!
        pending_jobs = Job.query.filter_by(shop_id=shop.id, status="pending_review").all()
        for j in pending_jobs:
            j.status = "open"
        flash(f"{shop.shop_name} approved! Verified badge active and pending posts published.", "success")
    elif action == "reject":
        shop.verification_status = "rejected"
        flash(f"{shop.shop_name} verification rejected.", "warning")
    elif action == "ask_info":
        shop.verification_status = "info_requested"
        flash(f"Additional info requested from {shop.shop_name}.", "info")

    log = AuditLog(
        admin_id=admin_user.id,
        action=f"{action}_shop",
        target_type="shop",
        target_id=shop.id,
        note=f"Verification status changed to {shop.verification_status}"
    )
    db.session.add(log)
    db.session.commit()

    return redirect(url_for("admin.employers"))
