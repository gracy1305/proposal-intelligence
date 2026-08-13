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
    Uses flexible deterministic regex patterns so the scoring remains
    explainable and auditable.
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

    # Simple commercial fields
    patterns = {
        "room_rate": [
            r"(?:guest\s*room\s*rate|room\s*rate|nightly\s*rate)"
            r"\s*(?:is|of|at|:|-)?\s*"
            r"(\$[\d,]+(?:\.\d{1,2})?(?:\s*(?:per night|/night))?)",
        ],

        "room_block": [
            r"(?:room\s*block|guest\s*room\s*block)"
            r"\s*(?:is|of|at|:|-)?\s*(\d+\s*rooms?)",
            r"(?:block\s+of)\s*(\d+\s*rooms?)",
        ],

        "meeting_space": [
            r"(?:meeting\s*space|event\s*space)"
            r"\s*(?:includes?|is|of|:|-)?\s*"
            r"([^.;]+)",
        ],

        "fnb_minimum": [
            r"(?:food\s*(?:&|and)\s*beverage\s*minimum|f&b\s*minimum|fnb\s*minimum)"
            r"\s*(?:is|of|at|:|-)?\s*"
            r"(\$[\d,]+(?:\.\d{1,2})?)",
        ],

        "resort_fee": [
            r"(?:resort\s*fee|destination\s*fee)"
            r"\s*(?:is|of|at|:|-)?\s*"
            r"(\$[\d,]+(?:\.\d{1,2})?(?:\s*per\s+(?:room|night)(?:\s*per\s*night)?)?)",
        ],

        "av_minimum": [
            r"(?:av\s*minimum|a/v\s*minimum|audio[\s-]*visual\s*minimum)"
            r"\s*(?:is|of|at|:|-)?\s*"
            r"(\$[\d,]+(?:\.\d{1,2})?)",
        ],

        "expiration_date": [
            r"(?:proposal\s*)?(?:expires?|expiration(?:\s*date)?|valid\s*until)"
            r"\s*(?:is|on|:|-)?\s*"
            r"([A-Za-z]+\s+\d{1,2},?\s+\d{4})",
        ],
    }

    for field, field_patterns in patterns.items():
        for pattern in field_patterns:
            match = re.search(pattern, text, re.IGNORECASE)

            if match:
                extracted[field] = match.group(1).strip()
                break

    # Cancellation terms
    cancellation_patterns = [
        r"(Cancellation\s+(?:is|terms?\s*(?:are|:)?|policy\s*(?:is|:)?)\s*[^.]+\.?)",
        r"(Cancellation[^.]+\.?)",
    ]

    for pattern in cancellation_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["cancellation_terms"] = match.group(1).strip()
            break

    # Deposit schedule
    deposit_patterns = [
        r"((?:A\s+)?\d+(?:\.\d+)?%\s+deposit\s+[^.]+\.?)",
        r"(Deposit(?:\s+schedule|\s+terms)?\s*(?:is|are|:|-)?\s*[^.]+\.?)",
    ]

    for pattern in deposit_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["deposit_schedule"] = match.group(1).strip()
            break

    # Concessions
    concession_patterns = [
        r"((?:Complimentary|Free|Included)\s+[^.]+(?:included|provided|offered)[^.]*\.?)",
        r"(Concessions?\s*(?:include|are|:|-)?\s*[^.]+\.?)",
    ]

    for pattern in concession_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["concessions"] = match.group(1).strip()
            break

    return extracted
