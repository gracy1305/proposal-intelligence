from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from scoring import (
    calculate_completeness,
    calculate_sla_risk,
    extract_proposal_fields,
)


app = FastAPI(
    title="Proposal Intelligence API",
    description="Explainable proposal completeness and SLA risk scoring.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProposalFields(BaseModel):
    room_rate: Optional[str] = None
    room_block: Optional[str] = None
    meeting_space: Optional[str] = None
    fnb_minimum: Optional[str] = None
    resort_fee: Optional[str] = None
    cancellation_terms: Optional[str] = None
    deposit_schedule: Optional[str] = None
    av_minimum: Optional[str] = None
    concessions: Optional[str] = None
    expiration_date: Optional[str] = None


class SLARequest(BaseModel):
    hours_elapsed: float
    sla_hours: float = 24
    followup_count: int = 0
    historical_response_hours: float = 8

class ProposalTextRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {
        "service": "Proposal Intelligence API",
        "status": "healthy",
    }


@app.post("/score/completeness")
def score_completeness(proposal: ProposalFields):
    return calculate_completeness(proposal.model_dump())


@app.post("/score/sla")
def score_sla(request: SLARequest):
    return calculate_sla_risk(
        hours_elapsed=request.hours_elapsed,
        sla_hours=request.sla_hours,
        followup_count=request.followup_count,
        historical_response_hours=request.historical_response_hours,
    )

@app.post("/analyze/proposal")
def analyze_proposal(request: ProposalTextRequest):
    extracted_fields = extract_proposal_fields(request.text)

    completeness = calculate_completeness(extracted_fields)

    return {
        "extracted_fields": extracted_fields,
        "completeness": completeness,
    }