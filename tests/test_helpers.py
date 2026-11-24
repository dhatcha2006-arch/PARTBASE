import pytest
from app.utils.helpers import mask_phone, format_currency

def test_mask_phone_standard():
    assert mask_phone("+919876543210") == "+91 98xxx xxxxx"

def test_mask_phone_without_country_code():
    assert mask_phone("9876543210") == "98xxx xxxxx"

def test_mask_phone_empty():
    assert mask_phone("") == ""
    assert mask_phone(None) == ""

def test_format_currency_hour():
    assert format_currency(120, "hour") == "₹120/hr"

def test_format_currency_day():
    assert format_currency(600, "day") == "₹600/day"

def test_format_inr():
    from app.utils.helpers import format_inr
    assert format_inr(500) == "₹500"
    assert format_inr(1000) == "₹1,000"
    assert format_inr(150000) == "₹1,50,000"
    assert format_inr(None) == "₹0"

def test_format_relative_time_helper():
    from app.utils.helpers import format_relative_time
    assert format_relative_time(0) == "Just now"
    assert format_relative_time(15) == "15m ago"
    assert format_relative_time(120) == "2h ago"
