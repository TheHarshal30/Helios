import os
import json
from typing import List, Optional, Dict, Any

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.pipeline import load_or_build_graph
from src.policy_summary import summarize_policy
from src.risk_engine import (
    policy_precheck,
    analyze_business_risk,
)
from src.coverage_matcher import (
    compare_policy_with_needs,
    explain_policy_vs_risks,
)
from src.ai_client import chat

# ---------------------------------------------------
# APP INIT
# ---------------------------------------------------

app = FastAPI(title="Insurance AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

G = load_or_build_graph()

# ---------------------------------------------------
# MODELS
# ---------------------------------------------------

class RiskRequest(BaseModel):
    text: str


class CompareRequest(BaseModel):
    text: str
    policy_name: str


class PolicyCard(BaseModel):
    file_name: str
    summary: str
    recommendation: str


class BusinessRiskResponse(BaseModel):
    identified_risks: List[Any]
    mandatory_coverages: List[str]
    optional_coverages: List[str]


class PolicyDashboardResponse(BaseModel):
    policies: List[PolicyCard]
    business_risk: Optional[BusinessRiskResponse] = None


# ---------------------------------------------------
# HELPERS
# ---------------------------------------------------

def humanize_triplets(triplets: list) -> list[str]:
    bullets = []

    for t in triplets:
        if isinstance(t, dict):
            tail = t.get("tail")
            if tail:
                bullets.append(tail.strip().capitalize())
        elif isinstance(t, str):
            bullets.append(t.strip().capitalize())

    return list(dict.fromkeys(bullets))


def format_policy_summary(raw_summary: Dict) -> str:
    sections = []

    if raw_summary.get("Coverages"):
        coverages = humanize_triplets(raw_summary["Coverages"])
        if coverages:
            sections.append(
                "Key Coverages:\n" +
                "\n".join(f"• {c}" for c in coverages[:6])
            )

    if raw_summary.get("Exclusions"):
        exclusions = humanize_triplets(raw_summary["Exclusions"])
        if exclusions:
            sections.append(
                "Important Exclusions:\n" +
                "\n".join(f"• {e}" for e in exclusions[:5])
            )

    if raw_summary.get("Limits"):
        limits = humanize_triplets(raw_summary["Limits"])
        if limits:
            sections.append(
                "Coverage Limits:\n" +
                "\n".join(f"• {l}" for l in limits[:3])
            )

    return "\n\n".join(sections) if sections else "No structured summary available."


def generate_recommendation(
    policy_name: str,
    policy_summary: str,
    business_info: Optional[dict],
) -> str:

    business_context = ""
    if business_info:
        business_context = f"""
Business context:
- Industry: {business_info.get("industry")}
- Employees: {business_info.get("employees")}
- Revenue: {business_info.get("revenue")}
- Description: {business_info.get("description")}
"""

    prompt = f"""
You are a senior commercial insurance advisor.

Evaluate whether the following insurance policy is useful for the business.

{business_context}

Policy summary:
\"\"\"
{policy_summary}
\"\"\"

Instructions:
- Start with: Assessment: <Highly relevant | Partially relevant | Not relevant>
- Explain WHY in simple business language
- Mention key gaps or mismatches
- End with a clear action (keep / upgrade / supplement / replace)
- Max 6 short sentences
- Do NOT restate the policy summary
"""

    return chat(
        [{"role": "user", "content": prompt}],
        temperature=0.4,
        max_new_tokens=250,
    ).strip()


def build_policy_cards(business_info: Optional[dict] = None) -> List[PolicyCard]:
    cards: List[PolicyCard] = []

    policies = sorted(
        set(
            data.get("source")
            for _, _, data in G.edges(data=True)
            if data.get("source")
        )
    )

    for policy in policies:
        try:
            raw_summary = summarize_policy(policy, G)
            summary_text = (
                format_policy_summary(raw_summary)
                if isinstance(raw_summary, dict)
                else str(raw_summary)
            )
        except Exception:
            summary_text = "Summary unavailable for this policy."

        try:
            recommendation_text = generate_recommendation(
                policy_name=policy,
                policy_summary=summary_text,
                business_info=business_info,
            )
        except Exception:
            recommendation_text = "Recommendation unavailable."

        cards.append(
            PolicyCard(
                file_name=policy,
                summary=summary_text[:1000],
                recommendation=recommendation_text[:500],
            )
        )

    return cards


# ---------------------------------------------------
# CORE ENDPOINTS
# ---------------------------------------------------

@app.post("/risk")
def detect_risk(req: RiskRequest):
    return policy_precheck(req.text)


@app.post("/compare")
def compare_policy(req: CompareRequest):
    needs = policy_precheck(req.text)
    comparison = compare_policy_with_needs(G, req.policy_name, needs)
    explanation = explain_policy_vs_risks(req.policy_name, needs, comparison)

    return {
        "needs": needs,
        "comparison": comparison,
        "explanation": explanation,
    }


@app.get("/policy-dashboard", response_model=PolicyDashboardResponse)
def policy_dashboard():
    return PolicyDashboardResponse(
        policies=build_policy_cards()
    )


# ---------------------------------------------------
# UPLOAD + ANALYZE
# ---------------------------------------------------

@app.post("/analyze-after-upload", response_model=PolicyDashboardResponse)
async def analyze_after_upload(
    files: List[UploadFile] = File(...),
    business_info: Optional[str] = Form(None),
):
    global G

    for file in files:
        if file.filename.lower().endswith(".pdf"):
            with open(os.path.join(UPLOAD_DIR, file.filename), "wb") as f:
                f.write(await file.read())

    G = load_or_build_graph()

    business_data = json.loads(business_info) if business_info else None
    cards = build_policy_cards(business_data)

    business_risk = None
    if business_data:
        risk = analyze_business_risk(business_data)
        business_risk = BusinessRiskResponse(**risk)

    return PolicyDashboardResponse(
        policies=cards,
        business_risk=business_risk,
    )


# ---------------------------------------------------
# BUSINESS ONLY
# ---------------------------------------------------

@app.post("/analyze-business")
def analyze_business(data: dict):
    if not data.get("description"):
        raise HTTPException(status_code=400, detail="Business description is required")

    analysis = analyze_business_risk(data)
    return {
        "status": "success",
        "business_profile": data,
        "risk_analysis": analysis,
    }
