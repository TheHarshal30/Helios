import json
from .local_llm import local_chat


RISK_PROMPT = """
Identify business risks.

TEXT:
\"\"\"{TEXT}\"\"\"

Classify risks ONLY into:

physical:
- fire, theft, natural disaster, property damage, equipment damage…

liability:
- lawsuits, customer injury, product liability, third-party claims…

operational:
- business interruption, supply chain, inventory spoilage…

people:
- employee health, accidents, workers safety…

industry_specific:
- cyber/data breach, food spoilage, medical negligence, etc.

Return JSON only:

{
 "physical": [],
 "liability": [],
 "operational": [],
 "people": [],
 "industry_specific": []
}

If unknown, return empty list for that category.
"""


def _safe_json_parse(raw: str):
    raw = raw.strip()

    # handle fenced code blocks ```json ... ```
    if raw.startswith("```"):
        raw = raw.strip("`").strip()

        if raw.lower().startswith("json"):
            raw = raw[4:].strip()

    return json.loads(raw)


def extract_risk_profile(user_text: str):
    """
    Returns a dictionary containing detected risks.
    Never crashes — always returns full structure.
    """
    prompt = RISK_PROMPT.replace("{TEXT}", user_text)

    raw = local_chat([
        {"role": "user", "content": prompt}
    ])

    try:
        return _safe_json_parse(raw)
    except Exception:
        return {
            "physical": [],
            "liability": [],
            "operational": [],
            "people": [],
            "industry_specific": []
        }


# ---------------------------
# Classification Layer
# ---------------------------

MANDATORY_RULES = {
    "fire": "property_fire_cover",
    "theft": "burglary_theft_cover",
    "business interruption": "loss_of_profit",
    "employee accident": "workmen_compensation",
    "customer injury": "public_liability",
    "data breach": "cyber_insurance",
    "food spoilage": "deterioration_of_stock",
}

OPTIONAL_SUGGESTIONS = {
    "natural disaster": "catastrophe_addon",
    "equipment breakdown": "machinery_breakdown",
    "inventory spoilage": "stock_deterioration",
    "customer complaints": "professional_liability",
    "medical negligence": "medical_malpractice",
}


def classify_mandatory_optional(risks: dict):
    """
    Returns (mandatory, optional)
    Lists are deduplicated and stable.
    """
    mandatory = set()
    optional = set()

    for _, items in risks.items():
        for risk in items:
            r = risk.lower()

            for k, v in MANDATORY_RULES.items():
                if k in r:
                    mandatory.add(v)

            for k, v in OPTIONAL_SUGGESTIONS.items():
                if k in r:
                    optional.add(v)

    return sorted(mandatory), sorted(optional)


def policy_precheck(user_text: str):
    """
    Full risk pipeline — returns structured object.
    """
    risks = extract_risk_profile(user_text)
    mandatory, optional = classify_mandatory_optional(risks)

    return {
        "risks": risks,
        "mandatory": mandatory,
        "optional": optional,
    }



from .local_llm import local_chat


def explain_risk_profile(result: dict) -> str:
    """
    Turns risk JSON into a clear explanation for users.
    """

    prompt = f"""
You are an insurance assistant.

Here is a detected business risk profile:

{json.dumps(result, indent=2)}

Write a clear explanation with these sections:

BUSINESS RISKS
Explain what risks were detected and why they matter.

MANDATORY COVERAGE
Explain why each required coverage is important in practical terms.

OPTIONAL COVERAGE
Explain when optional covers are helpful.

NOTES
If something is empty, tell the user that it's not detected instead of inventing.

Use simple language. Do NOT add new risks. Base everything ONLY on the JSON.
"""

    return local_chat([
        {"role": "user", "content": prompt}
    ])
