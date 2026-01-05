import re
from .llm_client import call_openrouter


TRIPLET_PROMPT = """
Extract insurance knowledge as triples.

Format STRICTLY:
(HEAD, RELATION, TAIL)

Relations ONLY:
COVERS, EXCLUDES, LIMIT, CONDITION, DEFINITION

Text:
{TEXT}
"""


def generate_triplets(text: str) -> str:
    prompt = TRIPLET_PROMPT.replace("{TEXT}", text)
    return call_openrouter(prompt)


def parse_triplets(raw_text: str):
    pattern = r"\(([^,]+),\s*([^,]+),\s*([^)]+)\)"
    matches = re.findall(pattern, raw_text)
    return [(h.strip(), r.strip(), t.strip()) for h, r, t in matches]
