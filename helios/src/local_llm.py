

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

_tokenizer = None
_model = None
MODEL_NAME = "Qwen/Qwen3-0.6B"


def get_model():
    global _tokenizer, _model

    if _tokenizer is None or _model is None:
        print("Loading local LLM:", MODEL_NAME)

        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

        _model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            device_map="cpu",
            torch_dtype="auto"
        )

    return _tokenizer, _model


def local_chat(messages, max_new_tokens=300, temperature=0.6):
    tokenizer, model = get_model()

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
