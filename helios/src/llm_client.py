import json
import requests
from .config import OPENROUTER_API_KEY, BASE_URL, TRIPLET_MODEL


def call_openrouter(prompt: str) -> str:
    payload = {
        "model": TRIPLET_MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }

    res = requests.post(
        BASE_URL,
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        data=json.dumps(payload)
    )

    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"]
