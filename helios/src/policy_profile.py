from collections import defaultdict


# This builds high-level structured info per policy
def build_policy_profile(G):
    """
    Convert raw graph edges into grouped policy sections.
    """
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

    profile = defaultdict(lambda: {
        "Coverages": [],
        "Exclusions": [],
        "Limits": [],
        "Conditions": [],
        "Definitions": []
    })

    for u, v, data in G.edges(data=True):
        relation = data.get("relation", "").upper()
        source = data.get("source", "UNKNOWN")

        category = COMPARISON_MAP.get(relation)

        if not category:
            continue

        profile[source][category].append((u, relation, v))

    return profile
