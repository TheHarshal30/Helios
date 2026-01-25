from .policy_profile import build_policy_profile
from .local_llm import chat


def format_single_policy(policy_name, profiles):
    if policy_name not in profiles:
        return None, "Policy not found in knowledge graph."

    policy_data = profiles[policy_name]

    formatted = f"\n=== {policy_name} ===\n"

    for category, rows in policy_data.items():
        formatted += f"\n[{category}]\n"

        if not rows:
            formatted += "- None found\n"
        else:
            for h, r, t in rows:
                formatted += f"- {h} → {r} → {t}\n"

    return formatted, None


def explain_single_policy(policy_name, G):
    profiles = build_policy_profile(G)

    formatted, err = format_single_policy(policy_name, profiles)

    if err:
        return err

    prompt = f"""
You are analyzing ONE insurance policy.

Use ONLY the facts below:

{formatted}

Write the explanation with this format:

POLICY OVERVIEW
Short summary of what this policy mainly focuses on.

COVERAGES
Bullet points summarizing what types of risks are covered.

EXCLUSIONS
Bullet points summarizing what is excluded (if anything appears).

LIMITS
Bullet points summarizing limits / sums insured if mentioned.

CONDITIONS
Bullet points explaining important requirements or obligations.

DEFINITIONS
Explain only definitions that matter (if present).

NOTES
If anything is unclear, say: "not specified in the provided text".

Do NOT invent details.
"""

    return chat([
        {"role": "user", "content": prompt}
    ])
