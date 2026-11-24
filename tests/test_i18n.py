import pytest
from flask import session
from app import create_app
from config import TestConfig
from app.extensions import db
from app.utils.i18n import translate_category, translate_day, t, get_current_lang

@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_translate_category_en_and_ta(app):
    with app.test_request_context("/"):
        session["lang"] = "ta"
        assert translate_category("shop_helper") == "கடை உதவியாளர்"
        assert translate_category("packing") == "பேக்கிங் உதவியாளர்"
        assert translate_category("unknown_role") == "Unknown Role"

        session["lang"] = "en"
        assert translate_category("shop_helper") == "Shop Helper"

def test_translate_day_en_and_ta(app):
    with app.test_request_context("/"):
        session["lang"] = "ta"
        assert translate_day("today") == "இன்று"
        assert translate_day("tomorrow") == "நாளை"
        assert translate_day("other") == "Other"

        session["lang"] = "en"
        assert translate_day("today") == "Today"

def test_ui_translation_helper(app):
    with app.test_request_context("/"):
        session["lang"] = "ta"
        assert t("zero_fee") == "கட்டணம் முற்றிலும் இல்லை"
        assert t("non_existent_key", default="Default") == "Default"

        session["lang"] = "en"
        assert t("zero_fee") == "Zero Fee Policy"

def test_set_language_endpoint(client):
    res = client.get("/set-lang/ta", follow_redirects=True)
    assert res.status_code == 200
    with client.session_transaction() as sess:
        assert sess.get("lang") == "ta"

    res = client.get("/set-lang/en", follow_redirects=True)
    assert res.status_code == 200
    with client.session_transaction() as sess:
        assert sess.get("lang") == "en"

def test_expanded_job_categories_tamil(app):
    with app.test_request_context("/"):
        session["lang"] = "ta"
        assert translate_category("shelf_stocker") == "பொருட்கள் அடுக்குபவர்"
        assert translate_category("billing_clerk") == "பில்லிங் எழுத்தர்"

def test_ui_saved_jobs_translation(app):
    with app.test_request_context("/"):
        session["lang"] = "ta"
        assert t("saved_jobs") == "சேமிக்கப்பட்ட வேலைகள்"
        session["lang"] = "en"
        assert t("saved_jobs") == "Saved Jobs"

def test_validation_messages_i18n(app):
    with app.test_request_context("/"):
        session["lang"] = "ta"
        assert "மொபைல்" in t("phone_invalid")
        session["lang"] = "en"
        assert "10-digit" in t("phone_invalid")
