FIELD_WEIGHTS = {
    "room_rate": 15,
    "room_block": 10,
    "meeting_space": 10,
    "fnb_minimum": 10,
    "resort_fee": 5,
    "cancellation_terms": 15,
    "deposit_schedule": 10,
    "av_minimum": 10,
    "concessions": 5,
    "expiration_date": 10,
}


def calculate_completeness(fields: dict) -> dict:
    """
    Calculate an explainable proposal completeness score.

    Each commercial term has an explicit weight rather than relying
    on an opaque AI-generated score.
    """

    score = 0
    missing_fields = []
    verified_fields = []

    for field, weight in FIELD_WEIGHTS.items():
        value = fields.get(field)

        if value is not None and str(value).strip():
            score += weight
            verified_fields.append(field)
        else:
            missing_fields.append(field)

    return {
        "score": score,
        "verified_fields": verified_fields,
        "missing_fields": missing_fields,
    }


def calculate_sla_risk(
    hours_elapsed: float,
    sla_hours: float,
    followup_count: int,
    historical_response_hours: float,
) -> dict:
    """
    Calculate SLA risk using deterministic operational signals.
    """

    time_ratio = min(hours_elapsed / sla_hours, 1.5)

    time_pressure = min(time_ratio * 45, 45)

    followup_pressure = min(followup_count * 10, 20)

    historical_pressure = 0

    if hours_elapsed > historical_response_hours:
        historical_pressure = 20

    remaining_pressure = 0

    hours_remaining = sla_hours - hours_elapsed

    if hours_remaining <= 6:
        remaining_pressure = 15
    elif hours_remaining <= 12:
        remaining_pressure = 8

    score = round(
        min(
            time_pressure
            + followup_pressure
            + historical_pressure
            + remaining_pressure,
            100,
        )
    )

    if score >= 70:
        level = "High"
        action = "Call now"

    elif score >= 40:
        level = "Medium"
        action = "AI follow-up"

    else:
        level = "Low"
        action = "No action"

    return {
        "score": score,
        "level": level,
        "recommended_action": action,
        "hours_remaining": max(round(hours_remaining, 1), 0),
    }

import re


def extract_proposal_fields(text: str) -> dict:
    """
    Extract common hotel proposal terms from unstructured proposal text.
    """

    extracted = {
        "room_rate": None,
        "room_block": None,
        "meeting_space": None,
        "fnb_minimum": None,
        "resort_fee": None,
        "cancellation_terms": None,
        "deposit_schedule": None,
        "av_minimum": None,
        "concessions": None,
        "expiration_date": None,
    }

    patterns = {
        "room_rate": [
            r"(?:guest\s*room\s*rate|room\s*rate|nightly\s*rate)\s*[:\-]?\s*(\$[\d,]+(?:\.\d{2})?(?:\s*(?:per night|\/night))?)",
        ],

        "room_block": [
            r"(?:room\s*block|guest\s*rooms?)\s*[:\-]?\s*(\d+\s*(?:rooms?)?)",
        ],

        "meeting_space": [
            r"(?:meeting\s*space|event\s*space)\s*[:\-]?\s*([\d,]+\s*(?:sq\.?\s*ft|square\s*feet))",
        ],

        "fnb_minimum": [
            r"(?:food\s*(?:&|and)\s*beverage\s*minimum|f&b\s*minimum)\s*[:\-]?\s*(\$[\d,]+(?:\.\d{2})?)",
        ],

        "resort_fee": [
            r"(?:resort\s*fee|destination\s*fee)\s*[:\-]?\s*(\$[\d,]+(?:\.\d{2})?(?:\s*(?:per room|per night|\/night))?)",
        ],

        "av_minimum": [
            r"(?:av\s*minimum|a\/v\s*minimum|audio\s*visual\s*minimum)\s*[:\-]?\s*(\$[\d,]+(?:\.\d{2})?)",
        ],

        "expiration_date": [
            r"(?:proposal\s*(?:expires|expiration)|valid\s*until)\s*[:\-]?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})",
        ],
    }

    for field, field_patterns in patterns.items():
        for pattern in field_patterns:
            match = re.search(pattern, text, re.IGNORECASE)

            if match:
                extracted[field] = match.group(1).strip()
                break

    cancellation_match = re.search(
        r"(cancellation(?:\s+terms|\s+policy)?\s*[:\-]\s*[^\n]+)",
        text,
        re.IGNORECASE,
    )

    if cancellation_match:
        extracted["cancellation_terms"] = cancellation_match.group(1).strip()

    deposit_match = re.search(
        r"(deposit(?:\s+schedule|\s+terms)?\s*[:\-]\s*[^\n]+)",
        text,
        re.IGNORECASE,
    )

    if deposit_match:
        extracted["deposit_schedule"] = deposit_match.group(1).strip()

    concession_match = re.search(
        r"(concessions?\s*[:\-]\s*[^\n]+)",
        text,
        re.IGNORECASE,
    )

    if concession_match:
        extracted["concessions"] = concession_match.group(1).strip()

    return extracted