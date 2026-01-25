import os
import requests

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY not set")

OPENROUTER_MODEL = "tngtech/deepseek-r1t2-chimera:free"

API_URL = "https://openrouter.ai/api/v1/chat/completions"


def chat(messages, temperature=0.4, max_tokens=500) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Insurance AI Engine",
    }

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    resp = requests.post(API_URL, headers=headers, json=payload, timeout=60)
    resp.raise_for_status()

    data = resp.json()
    return data["choices"][0]["message"]["content"].strip()
