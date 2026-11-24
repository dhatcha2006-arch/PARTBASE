"""
Tamil & English localization dictionary for Chennai pilot clusters.
"""
from flask import session

JOB_CATEGORIES_TA = {
    "shop_helper": "கடை உதவியாளர்",
    "packing": "பேக்கிங் உதவியாளர்",
    "cashier": "பணப் பதிவாளர் / பில்லிங்",
    "cleaning": "சுத்தம் செய்தல்",
    "data_entry": "டேட்டா என்ட்ரி",
    "delivery": "டெலிவரி உதவியாளர்",
    "promoter": "கடை விளம்பரதாரர்",
    "retail_assistant": "சில்லறை விற்பனை உதவியாளர்",
    "shelf_stocker": "பொருட்கள் அடுக்குபவர்",
    "billing_clerk": "பில்லிங் எழுத்தர்"
}

DAYS_TA = {
    "today": "இன்று",
    "tomorrow": "நாளை",
    "weekend": "வார இறுதி"
}

UI_STRINGS = {
    "en": {
        "nav_jobs": "Explore Jobs",
        "nav_post": "Post a Job",
        "nav_login": "Sign In",
        "nav_logout": "Logout",
        "nav_dashboard": "Dashboard",
        "hero_title": "Chennai's Local Work Platform.",
        "hero_subtitle": "Connecting neighborhood stores with students and homemakers across OMR & Anna Nagar.",
        "zero_fee": "Zero Fee Policy",
        "hyper_local": "1–3 KM Hyper-local",
        "daily_payout": "Daily Cash Payout",
        "lang_switch": "தமிழ்",
        "seeker_plan": "Job Seeker Plan",
        "employer_plan": "Shop Owner Plan",
        "btn_apply": "Quick Apply",
        "btn_post": "Publish Shift",
        "apply_success": "Application Sent Successfully",
        "saved_jobs": "Saved Jobs",
        "quick_shifts": "Quick Shifts (2-4 hrs)",
        "phone_invalid": "Enter valid 10-digit Indian phone number",
        "otp_required": "Please enter 6-digit OTP code"
    },
    "ta": {
        "nav_jobs": "வேலைகளைப் பாருங்கள்",
        "nav_post": "வேலை பதிவு செய்ய",
        "nav_login": "உள்நுழைய",
        "nav_logout": "வெளியேறு",
        "nav_dashboard": "முகப்பு பலகை",
        "hero_title": "சென்னையின் உள்ளூர் வேலை தளம்.",
        "hero_subtitle": "OMR மற்றும் அண்ணா நகர் பகுதிகளில் உள்ள கடைகளுடன் அருகிலுள்ளவர்களை இணைக்கிறது.",
        "zero_fee": "கட்டணம் முற்றிலும் இல்லை",
        "hyper_local": "1–3 கி.மீ உள்ளூர் எல்லை",
        "daily_payout": "தினசரி நேரடி ஊதியம்",
        "lang_switch": "English",
        "seeker_plan": "வேலை தேடுபவர்",
        "employer_plan": "கடை உரிமையாளர்",
        "btn_apply": "உடனே விண்ணப்பிக்க",
        "btn_post": "வேலை விளம்பரம் செய்",
        "apply_success": "விண்ணப்பம் வெற்றிகரமாக அனுப்பப்பட்டது",
        "saved_jobs": "சேமிக்கப்பட்ட வேலைகள்",
        "quick_shifts": "குறுகிய நேர வேலைகள் (2-4 மணி)",
        "phone_invalid": "சரியான 10 இலக்க இந்திய மொபைல் எண்ணை உள்ளிடவும்",
        "otp_required": "தயவுசெய்து 6 இலக்க OTP குறியீட்டை உள்ளிடவும்"
    }
}

def get_current_lang():
    """Retrieve active language from session or default to english."""
    try:
        return session.get("lang", "en")
    except RuntimeError:
        return "en"

def t(key, default=None):
    """Translate UI key according to current session language."""
    lang = get_current_lang()
    translations = UI_STRINGS.get(lang, UI_STRINGS["en"])
    if key in translations:
        return translations[key]
    return UI_STRINGS["en"].get(key, default or key)

def translate_category(category_key):
    """Return Tamil name for category or formatted english fallback."""
    if get_current_lang() == "ta":
        return JOB_CATEGORIES_TA.get(category_key, category_key.replace('_', ' ').title())
    return category_key.replace('_', ' ').title()

def translate_day(day_key):
    """Return Tamil name for day option or fallback."""
    if get_current_lang() == "ta":
        return DAYS_TA.get(day_key, day_key.title())
    return day_key.title()
