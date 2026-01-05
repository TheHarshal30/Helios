import os

PDF_DIR = "./pdfs"

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY not set")

BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
TRIPLET_MODEL = "tngtech/deepseek-r1t2-chimera:free"
