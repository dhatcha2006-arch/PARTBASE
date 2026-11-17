import re
from typing import Dict, List, Any

# Prohibited patterns in English, Tamil & Tanglish
SCAM_PATTERNS = [
    # English keywords
    (r"\bregistration\s+fee\b", "registration fee"),
    (r"\bsecurity\s+deposit\b", "security deposit"),
    (r"\bprocessing\s+fee\b", "processing fee"),
    (r"\bkit\s+charges\b", "kit charges"),
    (r"\badvance\b", "advance payment"),
    (r"\bpay\s+first\b", "pay first"),
    (r"\bsend\s+money\b", "send money"),
    (r"\bpay\s+money\b", "pay money"),
    (r"\brefundable\s+(deposit|fee|amount)\b", "refundable fee"),
    (r"\b(deposit|fee)\s+rs\.?\s*\d+", "fee with amount"),
    (r"\b(rs|₹)\.?\s*\d+\s+before\b", "pay before joining"),
    (r"\b(gpay|phonepe|paytm|upi)\s+before\b", "UPI payment before work"),
    (r"\bpay\s+via\s+(gpay|phonepe|paytm|upi)\b", "advance UPI request"),

    # Work From Home Typing Scam combinations
    (r"work\s+from\s+home\s+typing.*(fee|pay|deposit|charge|rs|₹)", "typing job asking for money"),
    (r"typing\s+job.*(fee|pay|deposit|charge|advance)", "typing job asking for money"),

    # Tamil / Tanglish keywords
    (r"\bpanam\s+anupavum\b", "money request (Tamil: panam anupavum)"),
    (r"\bkatnam\b", "fee request (Tamil: katnam)"),
    (r"\bmuthalil\s+panam\b", "pay upfront (Tamil: muthalil panam)"),
    (r"\bdeposit\s+pannunga\b", "deposit request (Tanglish: deposit pannunga)"),
    (r"\bfees\s+katunga\b", "pay fee (Tanglish: fees katunga)"),
    (r"\bpanam\s+kattavum\b", "pay fee (Tamil: panam kattavum)")
]

class ScamCheckService:
    @staticmethod
    def check_text(title: str, details: str = "") -> Dict[str, Any]:
        """
        Runs live rule-based scam check on job title and details.
        Returns: {ok: bool, flags: list, message: str}
        """
        combined = f"{title or ''} {details or ''}".lower()
        flags = []

        for pattern, label in SCAM_PATTERNS:
            if re.search(pattern, combined, re.IGNORECASE):
                flags.append(label)

        if flags:
            return {
                "ok": False,
                "flags": flags,
                "message": "This looks like a fee request. Jobs that ask for money are not allowed on PARTBASE. Please remove it.",
                "banner_text": "Safety check: blocked. Remove the fee or advance to publish."
            }

        return {
            "ok": True,
            "flags": [],
            "message": "Safety check passed. No fee or advance mentioned.",
            "banner_text": "Safety check passed. No fee or advance mentioned."
        }

    @staticmethod
    def check_job_submission(title: str, details: str = "") -> bool:
        res = ScamCheckService.check_text(title, details)
        return res["ok"]
