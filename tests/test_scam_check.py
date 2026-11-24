import pytest
from app.services.scam_check import ScamCheckService

def test_scam_check_clean_jobs():
    clean_job = ScamCheckService.check_text(
        title="Shop helper needed",
        details="Help with counter billing and stock arrangement. Lunch provided."
    )
    assert clean_job["ok"] is True
    assert len(clean_job["flags"]) == 0

def test_scam_check_registration_fee():
    scam = ScamCheckService.check_text(
        title="Data entry clerk",
        details="Work from home. Pay registration fee Rs 200 before joining."
    )
    assert scam["ok"] is False
    assert "registration fee" in scam["flags"]

def test_scam_check_security_deposit():
    scam = ScamCheckService.check_text(
        title="Packing work",
        details="Daily payout. Refundable security deposit required for kit."
    )
    assert scam["ok"] is False
    assert "security deposit" in scam["flags"]

def test_scam_check_advance_upi():
    scam = ScamCheckService.check_text(
        title="Office assistant",
        details="Pay via GPay before joining to book your slot."
    )
    assert scam["ok"] is False

def test_scam_check_tanglish_and_tamil():
    scam1 = ScamCheckService.check_text(
        title="Helper",
        details="Deposit pannunga Rs 500 velai tharom."
    )
    assert scam1["ok"] is False

    scam2 = ScamCheckService.check_text(
        title="Helper",
        details="Fees katunga first interviewku."
    )
    assert scam2["ok"] is False

def test_scam_check_crypto_and_telegram():
    res1 = ScamCheckService.check_text("Social Media Helper", "Earn ₹5000 per day by completing telegram tasks")
    assert res1["ok"] is False
    assert any("telegram" in flag.lower() for flag in res1["flags"])

    res2 = ScamCheckService.check_text("Online Assistant", "Deposit USDT to binance account for verification")
    assert res2["ok"] is False
    assert any("crypto" in flag.lower() for flag in res2["flags"])

def test_scam_check_investment_patterns():
    res = ScamCheckService.check_text("Part-time Investor", "Guaranteed return of ₹2000 daily with small advance")
    assert res["ok"] is False
