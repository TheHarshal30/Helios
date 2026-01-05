from collections import defaultdict
from .local_llm import local_chat


COMPARISON_MAP = {
    "COVERS": "Coverages",
    "INCLUDES": "Coverages",
    "INSURED": "Coverages",
    "APPLIES_TO": "Coverages",

    "EXCLUDES": "Exclusions",
    "EXCLUDED_FROM": "Exclusions",

    "LIMIT": "Limits",
    "SUM_INSURED": "Limits",

    "REQUIRES": "Conditions",
    "MUST": "Conditions",
    "OBLIGATION": "Conditions",

    "DEFINED_AS": "Definitions",
    "DEFINED_IN": "Definitions",
}


def build_policy_profile(G):
    """
    Convert raw graph edges into easily queryable policy structures.
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


def summarize_policy(policy_name: str, G):
    """
    Returns structured summary ready for UI / API.
    """
    profiles = build_policy_profile(G)

    if policy_name not in profiles:
        return None

    return profiles[policy_name]


def explain_policy(policy_name: str, G):
    """
    Uses local LLM only to generate human-readable explanation.
    """
    profile = summarize_policy(policy_name, G)

    if profile is None:
        return "Policy not found."

    formatted = f"=== {policy_name} ===\n"

    for category, rows in profile.items():
        formatted += f"\n[{category}]\n"
        if not rows:
            formatted += "- None found\n"
        else:
            for row in rows:
                formatted += f"- {row['head']} → {row['relation']} → {row['tail']}\n"

    prompt = f"""
You are analyzing ONE insurance policy.

Use ONLY the information below:

{formatted}

Write a clear explanation in this structure:

POLICY OVERVIEW
COVERAGES
EXCLUSIONS
LIMITS
CONDITIONS
DEFINITIONS
NOTES (say "not specified" when unclear)

Do NOT invent details.
"""

    return local_chat([
        {"role": "user", "content": prompt}
    ])
