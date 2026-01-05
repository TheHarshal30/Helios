FROM python:3.11

WORKDIR /app

# --- System dependencies (performance + pdf support) ---
RUN apt-get update && apt-get install -y \
    build-essential \
    libopenblas-dev \
    liblapack-dev \
    libjpeg-dev \
    zlib1g-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# --- Install Python dependencies ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Copy project ---
COPY . .

# Make Python output flush immediately
ENV PYTHONUNBUFFERED=1

# HuggingFace cache location inside container
ENV HF_HOME=/root/.cache/huggingface

# --- Start API ---
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]