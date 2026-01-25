from collections import defaultdict
from typing import Dict, List, Any
from .local_llm import chat


# ---------------------------------------
# Relation → Category mapping
# ---------------------------------------

COMPARISON_MAP = {
    # Coverages
    "COVERS": "Coverages",
    "INCLUDES": "Coverages",
    "INSURED": "Coverages",
    "APPLIES_TO": "Coverages",

    # Exclusions
    "EXCLUDES": "Exclusions",
    "EXCLUDED_FROM": "Exclusions",

    # Limits
    "LIMIT": "Limits",
    "SUM_INSURED": "Limits",

    # Conditions
    "REQUIRES": "Conditions",
    "MUST": "Conditions",
    "OBLIGATION": "Conditions",

    # Definitions
    "DEFINED_AS": "Definitions",
    "DEFINED_IN": "Definitions",
}


# ---------------------------------------
# Build structured policy profile from KG
# ---------------------------------------

def build_policy_profile(G) -> Dict[str, Dict[str, List[Dict[str, str]]]]:
    """
    Convert raw KG edges into structured per-policy profiles.
    """
    profile = defaultdict(lambda: {
        "Coverages": [],
        "Exclusions": [],
        "Limits": [],
        "Conditions": [],
        "Definitions": [],
    })

    for u, v, data in G.edges(data=True):
        relation = data.get("relation", "").upper()
        source = data.get("source", "UNKNOWN")

        category = COMPARISON_MAP.get(relation)
        if not category:
            continue

        profile[source][category].append({
            "head": u,
            "relation": relation,
            "tail": v,
        })

    return dict(profile)


# ---------------------------------------
# Structured summary (NO LLM)
# ---------------------------------------

def summarize_policy(policy_name: str, G) -> Dict[str, Any] | None:
    """
    Returns a structured, factual policy summary.
    No interpretation. No hallucination.
    """
    profiles = build_policy_profile(G)
    return profiles.get(policy_name)


# ---------------------------------------
# Human-readable explanation (LLM)
# ---------------------------------------

def _humanize_rows(rows: List[Dict[str, str]]) -> List[str]:
    """
    Convert KG rows into short human-readable phrases.
    """
    bullets = []
    for r in rows:
        tail = r.get("tail")
        if tail:
            bullets.append(tail.capitalize())
    # de-duplicate while preserving order
    return list(dict.fromkeys(bullets))


def explain_policy(policy_name: str, G) -> str:
    """
    Generate a clean, UI-ready explanation of a single policy.
    Uses LLM but strictly grounded in extracted data.
    """

    profile = summarize_policy(policy_name, G)
    if not profile:
        return "No information found for this policy."

    coverages = _humanize_rows(profile.get("Coverages", []))
    exclusions = _humanize_rows(profile.get("Exclusions", []))
    limits = _humanize_rows(profile.get("Limits", []))
    conditions = _humanize_rows(profile.get("Conditions", []))
    definitions = _humanize_rows(profile.get("Definitions", []))

    prompt = f"""
You are an insurance analyst.

Using ONLY the facts below, write a clear, concise explanation of this policy.
Do NOT invent details. If information is missing, say "Not specified".

Policy name: {policy_name}

Coverages:
{", ".join(coverages) if coverages else "Not specified"}

Exclusions:
{", ".join(exclusions) if exclusions else "Not specified"}

Limits:
{", ".join(limits) if limits else "Not specified"}

Conditions:
{", ".join(conditions) if conditions else "Not specified"}

Definitions:
{", ".join(definitions) if definitions else "Not specified"}

Instructions:
- Write in plain English
- No arrows, no legal tone
- Max 8 short sentences
- Structure with short paragraphs (not headings)
"""

    response = chat(
        [{"role": "user", "content": prompt}],
        temperature=0.3,
        max_new_tokens=300,
    )

    return response.strip()
