import os
import torch
import requests
from transformers import AutoTokenizer, AutoModelForCausalLM

# =====================================================
# CONFIG
# =====================================================

AI_PROVIDER = os.getenv("AI_PROVIDER", "local")  # "local" or "openrouter"

# ---- OpenRouter config ----
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = "tngtech/deepseek-r1t2-chimera:free"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# ---- Local model config ----
MODEL_NAME = "Qwen/Qwen3-0.6B"

_tokenizer = None
_model = None


# =====================================================
# LOCAL MODEL LOADING
# =====================================================

def get_local_model():
    global _tokenizer, _model

    if _tokenizer is None or _model is None:
        print("🧠 Loading LOCAL LLM:", MODEL_NAME)

        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

        _model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            device_map="cpu",
            torch_dtype="auto",
        )

        _model.eval()

    return _tokenizer, _model


# =====================================================
# UNIFIED CHAT FUNCTION (SINGLE ENTRY POINT)
# =====================================================

def chat(messages, max_new_tokens=300, temperature=0.6):
    """
    SINGLE LLM ENTRY POINT FOR ENTIRE BACKEND

    Switches between:
    - Local Qwen model
    - OpenRouter (GPT / Claude / etc.)

    Controlled ONLY by env var:
        AI_PROVIDER = local | openrouter
    """

    # -------------------------------------------------
    # OPENROUTER MODE
    # -------------------------------------------------
    if AI_PROVIDER == "openrouter":
        if not OPENROUTER_API_KEY:
            raise RuntimeError("OPENROUTER_API_KEY not set")

        print("🌐 Using OPENROUTER model:", OPENROUTER_MODEL)

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
            "max_tokens": max_new_tokens,
        }

        resp = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=60,
        )

        resp.raise_for_status()

        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()

    # -------------------------------------------------
    # LOCAL MODEL MODE (DEFAULT)
    # -------------------------------------------------
    elif AI_PROVIDER == "local":
        print("🖥️ Using LOCAL LLM")

        tokenizer, model = get_local_model()

        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=False,
        )

        inputs = tokenizer([text], return_tensors="pt")

        with torch.no_grad():
            generated = model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=True,
                temperature=temperature,
                top_p=0.9,
                use_cache=True,
            )

        output_ids = generated[0][len(inputs.input_ids[0]):]
        return tokenizer.decode(output_ids, skip_special_tokens=True).strip()

    # -------------------------------------------------
    # INVALID CONFIG
    # -------------------------------------------------
    else:
        raise RuntimeError(
            f"Invalid AI_PROVIDER='{AI_PROVIDER}'. "
            "Use 'local' or 'openrouter'."
        )
