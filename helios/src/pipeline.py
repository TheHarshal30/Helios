import os
import json
import pickle
from pathlib import Path

from .pdf_reader import get_pdf_files, extract_text
from .triplets import generate_triplets, parse_triplets
from .graph_builder import build_graph

from .policy_summary import summarize_policy, explain_policy
from .risk_engine import policy_precheck, explain_risk_profile

from .risk_engine import policy_precheck
from .coverage_matcher import (
    compare_policy_with_needs,
    explain_policy_vs_risks
)



DATA_DIR = Path("./data")
DATA_DIR.mkdir(exist_ok=True)

TRIPLETS_PATH = DATA_DIR / "triplets.json"
GRAPH_PATH = DATA_DIR / "graph.pkl"


# ---------------------------------------------------
# LOAD OR BUILD KNOWLEDGE GRAPH
# ---------------------------------------------------

def load_or_build_graph():
    # Load cached graph if available
    if GRAPH_PATH.exists():
        with open(GRAPH_PATH, "rb") as f:
            print("Loading cached knowledge graph...")
            return pickle.load(f)

    # Otherwise rebuild from PDFs
    documents = {}

    for pdf in get_pdf_files():
        documents[os.path.basename(pdf)] = extract_text(pdf)

    print("Loaded documents:", list(documents.keys()))

    all_triplets = {}

    for name, text in documents.items():
        print(f"Processing: {name}")
        raw = generate_triplets(text)
        all_triplets[name] = parse_triplets(raw)

    # Save triplets for debug / reuse
    with open(TRIPLETS_PATH, "w") as f:
        json.dump(all_triplets, f, indent=2)

    print(f"Saved triplets to {TRIPLETS_PATH}")

    G = build_graph(all_triplets)

    with open(GRAPH_PATH, "wb") as f:
        pickle.dump(G, f)

    print(f"Saved graph to {GRAPH_PATH}")

    return G


# ---------------------------------------------------
# MAIN PIPELINE
# ---------------------------------------------------

def run_pipeline():
    print("=== BUILD / LOAD KNOWLEDGE GRAPH ===")
    G = load_or_build_graph()

    print("\n=== POLICY SUMMARIES ===")

    # Summaries for all known policies
    policies = set(
        data.get("source")
        for _, _, data in G.edges(data=True)
    )

    for policy in policies:
        if not policy:
            continue

        print(f"\n--- {policy} ---\n")

        summary = summarize_policy(policy, G)
        explanation = explain_policy(policy, G)

        print("STRUCTURED SUMMARY:")
        print(summary)

        print("\nEXPLANATION:")
        print(explanation)

    print("\n=== RISK + POLICY MATCHING ===\n")

    user_text = """
    I run a sneaker store. Theft and fire are major risks.
    Also concerned about business shutdown.
    """

    needs = policy_precheck(user_text)

    for policy in policies:
        if not policy:
            continue

        print(f"\n--- {policy} ---")

        comparison = compare_policy_with_needs(G, policy, needs)

        print("\nSTRUCTURED RESULT:")
        print(json.dumps(comparison, indent=2))

        explanation = explain_policy_vs_risks(policy, needs, comparison)

        print("\nEXPLANATION:\n")
        print(explanation)

    
    return G
