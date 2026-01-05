from .local_llm import local_chat
import json


def policy_covers(G, policy_name: str):
    """
    Returns a set of normalized cover strings that the policy actually covers.
    """
    covers = set()

    for u, v, data in G.edges(data=True):
        if data.get("source") != policy_name:
            continue

        relation = data.get("relation", "").upper()

        if relation in ["COVERS", "INCLUDES", "INSURED", "APPLIES_TO"]:
            covers.add(v.lower().strip())

    return covers


def compare_policy_with_needs(G, policy_name: str, needs: dict):
    """
    needs = output of policy_precheck()
    """

    available = policy_covers(G, policy_name)

    mandatory_missing = []
    mandatory_covered = []

    optional_missing = []
    optional_covered = []

    for item in needs["mandatory"]:
        if item.replace("_", " ") in available:
            mandatory_covered.append(item)
        else:
            mandatory_missing.append(item)

    for item in needs["optional"]:
        if item.replace("_", " ") in available:
            optional_covered.append(item)
        else:
            optional_missing.append(item)

    return {
        "available": sorted(list(available)),
        "mandatory_covered": mandatory_covered,
        "mandatory_missing": mandatory_missing,
        "optional_covered": optional_covered,
        "optional_missing": optional_missing
    }




def explain_policy_vs_risks(policy_name: str, needs: dict, comparison: dict):
    prompt = f"""
You are an insurance assistant.

POLICY NAME:
{policy_name}

RISK ANALYSIS:
{json.dumps(needs, indent=2)}

POLICY COVERAGE COMPARISON:
{json.dumps(comparison, indent=2)}

Explain clearly:

SUMMARY
What kind of business risks this user has.

MANDATORY COVERAGE
Say which requirements are already covered and which are missing.
Explain why missing ones matter, without fearmongering.

OPTIONAL COVERAGE
Explain optional protections in practical terms.

FINAL VERDICT
Is this policy adequate, partially adequate, or insufficient?

Important rules:
- Do NOT invent new risks
- Base everything ONLY on the JSON
- Use clear bullet points
"""

    return local_chat([
        {"role": "user", "content": prompt}
    ])
