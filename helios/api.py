from fastapi import FastAPI
from pydantic import BaseModel

from src.pipeline import load_or_build_graph
from src.policy_summary import summarize_policy, explain_policy
from src.risk_engine import policy_precheck
from src.coverage_matcher import compare_policy_with_needs, explain_policy_vs_risks

G = load_or_build_graph()

app = FastAPI(title="Insurance AI Engine")


class RiskRequest(BaseModel):
    text: str


class CompareRequest(BaseModel):
    text: str
    policy_name: str


@app.post("/risk")
def detect_risk(req: RiskRequest):
    return policy_precheck(req.text)


@app.get("/summaries")
def get_summaries():
    policies = set(
        data.get("source")
        for _, _, data in G.edges(data=True)
    )

    result = {}

    for p in policies:
        if p:
            result[p] = summarize_policy(p, G)

    return result


@app.post("/compare")
def compare_policy(req: CompareRequest):
    needs = policy_precheck(req.text)
    comparison = compare_policy_with_needs(G, req.policy_name, needs)
    explanation = explain_policy_vs_risks(req.policy_name, needs, comparison)

    return {
        "needs": needs,
        "comparison": comparison,
        "explanation": explanation
    }
