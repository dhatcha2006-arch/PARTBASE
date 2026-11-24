import json
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, session
from app.extensions import db, csrf
from app.models import User, Area, Shop, Job, Application, Rating, Report, Ticket, Draft
from app.services.otp_service import OTPService
from app.services.scam_check import ScamCheckService
from app.services.payment_service import PaymentService
from app.utils.geo import haversine_distance
from app.utils.helpers import reveal_ratings_if_both_rated, check_and_auto_hide_job

api_bp = Blueprint("api", __name__)

# Envelope helper
def api_response(ok=True, data=None, error=None, message=None, status_code=200):
    payload = {"ok": ok}
    if data is not None:
        payload["data"] = data
    if error:
        payload["error"] = error
    if message:
        payload["message"] = message
    return jsonify(payload), status_code

# Auth APIs
@api_bp.route("/auth/send-otp", methods=["POST"])
@csrf.exempt
def send_otp():
    data = request.get_json() or request.form
    phone = data.get("phone", "").strip()
    if not phone:
        return api_response(ok=False, error="Phone number is required", status_code=400)
    res = OTPService.send_otp(phone)
    return api_response(ok=res["ok"], data=res, message=res.get("message"))

@api_bp.route("/auth/verify-otp", methods=["POST"])
@csrf.exempt
def verify_otp():
    data = request.get_json() or request.form
    phone = data.get("phone", "").strip()
    code = data.get("code", "").strip()
    if not phone or not code:
        return api_response(ok=False, error="Phone and OTP code are required", status_code=400)

    res = OTPService.verify_otp(phone, code)
    if res["ok"]:
        user = db.session.get(User, res["user_id"])
        session["user_id"] = user.id
        session["phone"] = user.phone
        session["role"] = user.active_role
        session["is_admin"] = user.is_admin
    return api_response(ok=res["ok"], data=res, message=res.get("message"))

@api_bp.route("/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return api_response(ok=True, message="Logged out successfully")

@api_bp.route("/role/switch", methods=["POST"])
def switch_role():
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)
    user = db.session.get(User, user_id)
    new_role = "employer" if user.active_role == "seeker" else "seeker"
    user.active_role = new_role
    session["role"] = new_role
    db.session.commit()
    return api_response(ok=True, data={"role": new_role})

# Areas API
@api_bp.route("/areas", methods=["GET"])
def get_areas():
    areas = Area.query.order_by(Area.name).all()
    return api_response(ok=True, data=[a.to_dict() for a in areas])

# Jobs API
@api_bp.route("/jobs", methods=["GET"])
def get_jobs():
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)
    radius = request.args.get("radius", default=3.0, type=float)
    day = request.args.get("day")
    categories = request.args.getlist("category")
    pay_type = request.args.get("pay_type")

    query = Job.query.filter_by(status="open")
    if day:
        query = query.filter_by(day_option=day)
    if categories:
        query = query.filter(Job.category.in_(categories))
    if pay_type:
        query = query.filter_by(pay_type=pay_type)

    all_jobs = query.all()
    result = []
    for j in all_jobs:
        job_dict = j.to_dict(seeker_lat=lat, seeker_lng=lng)
        dist = job_dict.get("distance_km")
        if dist is None or dist <= radius:
            result.append(job_dict)

    result.sort(key=lambda x: (not x["is_boosted"], x["distance_km"] or 0))
    return api_response(ok=True, data=result)

@api_bp.route("/jobs", methods=["POST"])
def create_job():
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)
    user = db.session.get(User, user_id)
    if not user.shop:
        return api_response(ok=False, error="Shop not set up", status_code=400)

    data = request.get_json() or request.form
    title = data.get("title", "").strip()
    details = data.get("details", "").strip()

    # Scam check
    scam_check = ScamCheckService.check_text(title, details)
    if not scam_check["ok"]:
        return api_response(ok=False, error="SCAM_DETECTED", message=scam_check["message"], data=scam_check, status_code=400)

    status = "open" if user.shop.is_verified else "pending_review"
    job = Job(
        shop_id=user.shop.id,
        category=data.get("category", "shop_helper"),
        title=title,
        day_option=data.get("day_option", "today"),
        time_range=data.get("time_range", "5:00 pm to 9:00 pm"),
        pay_amount=int(data.get("pay_amount", 100)),
        pay_type=data.get("pay_type", "hour"),
        people_needed=int(data.get("people_needed", 1)),
        address=data.get("address", user.shop.address),
        details=details,
        status=status
    )
    db.session.add(job)
    Draft.query.filter_by(user_id=user.id).delete()
    db.session.commit()
    return api_response(ok=True, data=job.to_dict())

@api_bp.route("/jobs/<int:job_id>/apply", methods=["POST"])
def apply_job(job_id):
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)

    job = Job.query.get_or_404(job_id)
    if job.status != "open" or job.is_filled:
        return api_response(ok=False, error="Job is closed or filled", status_code=400)

    existing = Application.query.filter_by(job_id=job.id, seeker_id=user_id).first()
    if existing:
        return api_response(ok=False, error="Already applied to this job", status_code=400)

    data = request.get_json() or request.form
    app_entry = Application(
        job_id=job.id,
        seeker_id=user_id,
        note=data.get("note", "").strip(),
        status="applied"
    )
    db.session.add(app_entry)
    db.session.commit()
    return api_response(ok=True, data=app_entry.to_dict())

@api_bp.route("/jobs/<int:job_id>/report", methods=["POST"])
def report_job(job_id):
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)

    job = Job.query.get_or_404(job_id)
    data = request.get_json() or request.form
    reason = data.get("reason", "other")
    details = data.get("details", "")

    ticket = Ticket(
        raised_by_id=user_id,
        role=session.get("role", "seeker"),
        issue_type="scam_fee_request" if reason == "asked_money" else "other",
        job_id=job.id,
        description=f"Report: {reason}. {details}",
        status="open"
    )
    db.session.add(ticket)
    db.session.flush()

    report = Report(
        job_id=job.id,
        reporter_id=user_id,
        reason=reason,
        details=details,
        ticket_id=ticket.id
    )
    db.session.add(report)
    db.session.commit()

    check_and_auto_hide_job(job.id)
    return api_response(ok=True, data={"ticket_code": ticket.ticket_code})

@api_bp.route("/jobs/<int:job_id>/boost", methods=["POST"])
def boost_job(job_id):
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)

    user = db.session.get(User, user_id)
    if not user.shop:
        return api_response(ok=False, error="Shop required", status_code=400)

    data = request.get_json() or request.form
    res = PaymentService.boost_job(
        shop_id=user.shop.id,
        job_id=job_id,
        method=data.get("method", "upi"),
        provider_ref=data.get("provider_ref")
    )
    return api_response(ok=res["ok"], data=res, error=res.get("error"))

@api_bp.route("/applications/<int:app_id>/status", methods=["POST"])
def update_application_status(app_id):
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)

    app_entry = Application.query.get_or_404(app_id)
    user = db.session.get(User, user_id)
    if app_entry.job.shop_id != user.shop.id:
        return api_response(ok=False, error="Forbidden", status_code=403)

    data = request.get_json() or request.form
    new_status = data.get("status")
    if new_status in ["shortlisted", "hired", "rejected", "completed"]:
        app_entry.status = new_status
        if new_status == "hired":
            app_entry.job.hired_count += 1
            if app_entry.job.hired_count >= app_entry.job.people_needed:
                app_entry.job.status = "closed"
        db.session.commit()
        return api_response(ok=True, data=app_entry.to_dict())
    return api_response(ok=False, error="Invalid status", status_code=400)

@api_bp.route("/jobs/<int:job_id>/complete", methods=["POST"])
def complete_job_api(job_id):
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)
    user = db.session.get(User, user_id)
    job = Job.query.filter_by(id=job_id, shop_id=user.shop.id).first_or_404()

    job.status = "completed"
    for a in job.applications:
        if a.status == "hired":
            a.status = "completed"
    db.session.commit()
    return api_response(ok=True, message="Job completed")

@api_bp.route("/ratings", methods=["POST"])
def submit_rating():
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)

    data = request.get_json() or request.form
    job_id = int(data.get("job_id"))
    application_id = int(data.get("application_id"))
    stars = int(data.get("stars", 5))
    direction = data.get("direction", "seeker_to_shop")
    ratee_id = int(data.get("ratee_id"))

    rating = Rating(
        job_id=job_id,
        application_id=application_id,
        rater_id=user_id,
        ratee_id=ratee_id,
        direction=direction,
        stars=stars,
        positive_tags=",".join(data.getlist("positive_tags") if hasattr(data, "getlist") else data.get("positive_tags", [])),
        red_tags=",".join(data.getlist("red_tags") if hasattr(data, "getlist") else data.get("red_tags", [])),
        comment=data.get("comment", "")
    )
    db.session.add(rating)
    db.session.commit()

    reveal_ratings_if_both_rated(job_id, application_id)
    return api_response(ok=True, message="Rating recorded")

@api_bp.route("/scam-check", methods=["POST"])
@csrf.exempt
def live_scam_check():
    data = request.get_json() or request.form
    title = data.get("title", "")
    details = data.get("details", "")
    res = ScamCheckService.check_text(title, details)
    return api_response(ok=res["ok"], data=res, message=res["message"])

@api_bp.route("/tickets", methods=["GET", "POST"])
def tickets():
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)

    if request.method == "POST":
        data = request.get_json() or request.form
        ticket = Ticket(
            raised_by_id=user_id,
            role=data.get("role", "seeker"),
            issue_type=data.get("issue_type", "other"),
            job_id=data.get("job_id"),
            description=data.get("description", ""),
            status="open"
        )
        db.session.add(ticket)
        db.session.commit()
        return api_response(ok=True, data=ticket.to_dict())

    user_tickets = Ticket.query.filter_by(raised_by_id=user_id).all()
    return api_response(ok=True, data=[t.to_dict() for t in user_tickets])

@api_bp.route("/draft", methods=["GET", "POST"])
def draft():
    user_id = session.get("user_id")
    if not user_id:
        return api_response(ok=False, error="Unauthorized", status_code=401)

    if request.method == "POST":
        payload = request.get_json() or {}
        draft_record = Draft.query.filter_by(user_id=user_id).first()
        if not draft_record:
            draft_record = Draft(user_id=user_id, payload=json.dumps(payload))
            db.session.add(draft_record)
        else:
            draft_record.payload = json.dumps(payload)
            draft_record.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
        db.session.commit()
        return api_response(ok=True, message="Draft autosaved")

    draft_record = Draft.query.filter_by(user_id=user_id).first()
    data = json.loads(draft_record.payload) if draft_record and draft_record.payload else None
    return api_response(ok=True, data=data)

@api_bp.route('/health', methods=['GET'])
def api_health():
    """Health check endpoint returning system status and current timestamp."""
    return api_response(
        ok=True,
        data={
            "status": "healthy",
            "service": "partbase",
            "version": "1.2.0",
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        message="PARTBASE micro-job API is operating nominally"
    )

@api_bp.route('/locations', methods=['GET'])
def api_locations():
    """List supported Chennai pilot delivery and job locations."""
    from app.utils.geo import CHENNAI_AREAS
    return api_response(ok=True, data={"zones": list(CHENNAI_AREAS.keys()), "count": len(CHENNAI_AREAS)})
