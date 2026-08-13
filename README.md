# Proposal Intelligence

An explainable proposal reliability engine for venue sourcing workflows.

Proposal Intelligence helps sourcing teams quickly understand which venue proposals are complete, which responses need attention, and where human intervention is most valuable.

Rather than treating every proposal or unanswered venue equally, the system extracts key commercial terms, calculates proposal completeness, evaluates SLA risk, and surfaces the items that deserve attention first.

---

## Why I Built This

Venue sourcing teams often receive proposals in inconsistent formats.

Important terms such as room rates, meeting space, food & beverage minimums, cancellation policies, deposits, concessions, and proposal expiration dates can be buried inside emails or proposal documents.

At the same time, sourcing teams may be managing responses from many venues at once.

That creates two related problems:

1. **Proposal reliability**  
   Is the proposal complete enough to confidently compare with other venues?

2. **Response prioritization**  
   Which unanswered venues actually require human intervention right now?

Proposal Intelligence explores how these decisions can be made more structured, explainable, and actionable.

---

## What It Does

### Proposal Analysis

Users can paste raw venue proposal text into the application.

The FastAPI backend extracts structured commercial terms including:

- Guest room rate
- Room block
- Meeting space
- Food & beverage minimum
- Resort fee
- Cancellation terms
- Deposit schedule
- AV minimum
- Concessions
- Proposal expiration date

The system then calculates a weighted completeness score and identifies missing contract-critical information.

For example, a proposal containing most commercial terms but missing cancellation terms and an AV minimum can be flagged for human review rather than treated as complete.

### SLA Risk Scoring

The backend also calculates response risk using signals such as:

- Time elapsed since outreach
- Expected SLA
- Number of follow-ups
- Historical response behavior
- Time remaining before the SLA threshold

This creates an explainable risk score that can help distinguish between venues that can continue through automated follow-up and those that may require human intervention.

### Intervention Queue

The interface surfaces higher-risk proposals and venue responses so a sourcing team can focus attention where it is most useful.

Instead of simply showing data, the goal is to answer:

**What needs my attention, and why?**

---

## Product Screens

### Proposal Pipeline

The main pipeline provides an overview of the active sourcing event, proposal responses, SLA status, and items requiring attention.

> <img width="1885" height="872" alt="image" src="https://github.com/user-attachments/assets/e7fc5a54-f22d-4313-b7e7-e7f14f56b009" />

### Proposal Analysis

The analysis workflow converts unstructured proposal text into structured fields and evaluates proposal completeness.

> <img width="970" height="871" alt="image" src="https://github.com/user-attachments/assets/0d51166d-a035-4a8d-ab56-81f9b868e78c" />

### Proposal Assessment

Proposal details show extracted terms, missing fields, confidence indicators, and recommended next actions.

> <img width="1323" height="877" alt="image" src="https://github.com/user-attachments/assets/6183e9fc-0f9c-42b9-979f-7d716b39e27e" />

> <img width="1339" height="774" alt="image" src="https://github.com/user-attachments/assets/3414fe22-27ac-4190-adcc-872154a2f1de" />


---

## Architecture

```text
                    ┌─────────────────────┐
                    │     Next.js UI      │
                    │                     │
                    │ Pipeline / Analysis │
                    │ Intervention Views  │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI API      │
                    │                     │
                    │ Proposal Analysis   │
                    │ Scoring Endpoints   │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │ Proposal Field  │         │ SLA Risk Engine │
        │   Extraction    │         │                 │
        └────────┬────────┘         └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Completeness   │
        │     Scoring     │
        └─────────────────┘
```

---

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript

**Backend**
- Python
- FastAPI
- Pydantic

**Deployment / Development**
- Git & GitHub
- Vercel
- Render

---

## API

The FastAPI service exposes a small set of explainable scoring endpoints.

### Health Check

```http
GET /
```

Returns the current API status.

### Analyze Proposal

```http
POST /analyze/proposal
```

Example request:

```json
{
  "text": "Guest Room Rate: $389 per night\nRoom Block: 140 rooms\nMeeting Space: 18,500 sq ft..."
}
```

The endpoint:

1. Extracts proposal fields
2. Calculates completeness
3. Returns the structured proposal assessment

### Completeness Score

```http
POST /score/completeness
```

Calculates proposal completeness from structured commercial fields.

### SLA Risk

```http
POST /score/sla
```

Evaluates intervention risk based on response timing and follow-up signals.

Example input:

```json
{
  "hours_elapsed": 19,
  "sla_hours": 24,
  "followup_count": 2,
  "historical_response_hours": 8
}
```

---

## Explainability by Design

A key product decision was to keep the scoring logic understandable.

For an operational workflow like venue sourcing, a score is much more useful when the user can understand **why** something was flagged.

For example:

```text
High SLA Risk

→ Response has been outstanding longer than historical behavior
→ Two automated follow-ups have already occurred
→ SLA deadline is approaching
→ Human intervention recommended
```

Similarly, proposal completeness is derived from explicit required fields rather than an unexplained black-box score.

This makes the output easier for an operations team to review, trust, and act on.

---

## Human-in-the-Loop Approach

The goal of Proposal Intelligence is not to automate every sourcing decision.

Instead, automation handles structured evaluation while humans are surfaced when judgment or intervention is valuable.

```text
Low risk
    ↓
Continue automated workflow

Medium risk
    ↓
Monitor / follow up

High risk
    ↓
Surface to intervention queue
    ↓
Human reviews context
    ↓
Call, follow up, or escalate
```

This allows human attention to become a prioritized resource rather than the default step for every venue.

---

## Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/gracy1305/proposal-intelligence.git
cd proposal-intelligence
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Next.js Application

```bash
npm run dev
```

The frontend will run locally at:

```text
http://localhost:3000
```

### 4. Install Backend Dependencies

```bash
pip install -r intelligence/requirements.txt
```

### 5. Start the FastAPI Service

From the `intelligence` directory:

```bash
python -m uvicorn main:app --reload --port 8001
```

The API will run locally at:

```text
http://localhost:8001
```

### 6. Configure the Frontend API URL

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

Restart the Next.js development server after changing environment variables.

---

## Project Structure

```text
proposal-intelligence/
│
├── app/
│   ├── analyze/
│   ├── interventions/
│   ├── proposals/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── intelligence/
│   ├── main.py
│   ├── scoring.py
│   └── requirements.txt
│
├── public/
├── package.json
└── README.md
```

`main.py` exposes the FastAPI endpoints while `scoring.py` contains the proposal extraction and scoring logic.

---

## Example Proposal

A sample proposal can contain information such as:

```text
Guest Room Rate: $389 per night
Room Block: 140 rooms
Meeting Space: 18,500 sq ft
Food & Beverage Minimum: $42,000
Resort Fee: $45 per night
Deposit Schedule: 25% at signing
Concessions: 1 per 40 comp room ratio
Proposal Expires: August 20, 2026
```

The system extracts the available fields and identifies important information that is missing.

This turns unstructured proposal text into an operational decision rather than requiring someone to manually inspect every term.

---

## Product Exploration

This project started as an exploration of how AI-assisted venue sourcing workflows could better prioritize human attention.

I first explored the product experience and visualization layer, then implemented the core proposal intelligence logic with a Next.js frontend and Python/FastAPI backend.

The repository focuses on the underlying mechanics: extraction, explainable scoring, API integration, and intervention-oriented workflows.

---

## Future Improvements

With additional development, I would extend the system with:

- Direct PDF and document ingestion
- LLM-assisted extraction for less structured proposals
- Persistent proposal and venue history
- Historical response-time learning
- Event-specific scoring weights
- Proposal comparison across venues
- CRM / sourcing-platform integrations
- Automated follow-up orchestration
- User feedback loops for improving extraction confidence

The larger opportunity is to build a reliability layer between automated venue sourcing and human operators, allowing software to handle routine evaluation while escalating the cases where human judgment has the highest value.

---

## Status

This is an independent product and engineering exploration inspired by AI-powered venue sourcing workflows.

The core proposal extraction, completeness scoring, SLA-risk logic, API, and frontend workflows are implemented. The repository is intended as a technical prototype and product exploration rather than a production-ready sourcing system.

---

## Author

**Gracy Patel**

MS Computer Science  
DePaul University

Built as an independent exploration of AI-assisted sourcing infrastructure.
