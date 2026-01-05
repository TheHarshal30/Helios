from src.pipeline import run_pipeline
from src.risk_engine import policy_precheck


def main():
    print("Starting insurance pipeline...")
    graph = run_pipeline()

    # --- TEST RISK ENGINE ---
    print("\n--- RISK ENGINE DEMO ---\n")

    user_text = """
    I run a sneaker store. Theft and fire are big risks.
    I also worry if the shop has to close.
    """

    precheck = policy_precheck(user_text)

    print("RISKS IDENTIFIED:", precheck["risks"])
    print("MANDATORY:", precheck["mandatory"])
    print("OPTIONAL:", precheck["optional"])

    print("\nFinished successfully.")


if __name__ == "__main__":
    main()