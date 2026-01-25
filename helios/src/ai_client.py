import os

AI_PROVIDER = os.getenv("AI_PROVIDER")

if not AI_PROVIDER:
    raise RuntimeError("AI_PROVIDER not set (local | openrouter)")

if AI_PROVIDER == "openrouter":
    from src.openrouter_llm import chat as _chat
elif AI_PROVIDER == "local":
    from src.local_llm import chat as _chat
else:
    raise RuntimeError(f"Unknown AI_PROVIDER: {AI_PROVIDER}")


print(AI_PROVIDER)

def chat(messages, **kwargs) -> str:
    return _chat(messages, **kwargs)
