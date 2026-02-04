# Helios ☀️

> **AI-Powered Insurance Policy Analysis & Risk Assessment Engine**

Helios is an advanced system designed to bridge the gap between complex insurance policy documents and specific business needs. By leveraging **Knowledge Graphs (NetworkX)** and **Large Language Models (LLMs)**, Helios transforms static PDF policies into queryable intelligence, allowing businesses to automatically detect coverage gaps and assess risks.

---

## 🚀 Key Features

*   **📄 Automated Policy Ingestion**: Extracts text from PDF insurance policies and converts unstructured legal language into structured data.
*   **🕸️ Knowledge Graph Construction**: Builds a semantic graph of policy terms, coverages, exclusions, and limits using LLMs to extract "triplets" (Subject -> Relationship -> Object).
*   **🛡️ Business Risk Profiling**: Analyzes plain-text business descriptions (e.g., *"I run a sneaker store in downtown Chicago"*) to identify specific liabilities (Theft, Fire, Business Interruption).
*   **⚖️ Gap Analysis & Matching**: Systematically compares identified business risks against policy provisions (Coverage, Exclusions) to highlight gaps.
*   **🧠 Hybrid AI Engine**: Supports both **Local LLMs** (via `transformers` + `torch`) for privacy/offline use and **OpenRouter** (DeepSeek, GPT-4, etc.) for enhanced reasoning.

---

## 🛠️ Architecture Overview

The repository is divided into two main components:

1.  **Back-End (`helios/`)**:
    *   **Framework**: FastAPI
    *   **Core Logic**: `src/pipeline.py` (Orchestrator), `src/graph_builder.py` (KG Construction), `src/risk_engine.py` (Risk Analysis).
    *   **Data**: Stores processed graphs in `data/graph.pkl`.

2.  **Front-End (`helios-website/`)**:
    *   **Framework**: Next.js (React)
    *   **UI**: Dashboard for uploading files and viewing risk vs. coverage comparisons.

---

## 📋 Prerequisites

*   **Python**: 3.9+
*   **Node.js**: 18+ (for frontend)
*   **GPU (Optional)**: Recommended if running local LLMs (Qwen/Llama).

---

## ⚡ Getting Started

### 1. Backend Setup (API)

The backend exposes the REST API for analysis.

```bash
# Navigate to backend
cd helios

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Set up Environment Variables
# If you want to use OpenRouter instead of local models:
export AI_PROVIDER="openrouter"
export OPENROUTER_API_KEY="your_key_here"

# Start the Server
python main.py
```

*Server will start at `http://localhost:8000`*

### 2. Frontend Setup (Dashboard)

The frontend visualizes the analysis results.

```bash
# Navigate to frontend
cd helios-website

# Install dependencies
npm install

# Start the dev server
npm run dev
```

*Access the dashboard at `http://localhost:3000`*

---

## 🔧 Configuration

The backend behavior can be controlled via environment variables or direct code config in `src/local_llm.py`.

| Variable | Values | Description |
| :--- | :--- | :--- |
| `AI_PROVIDER` | `local` (default), `openrouter` | specifices which LLM backend to use. |
| `OPENROUTER_API_KEY` | `sk-xxxx` | Required if `AI_PROVIDER` is `openrouter`. |

**Default Local Model**: `Qwen/Qwen3-0.6B` (Lightweight, runs on CPU).
**Default OpenRouter Model**: `tngtech/deepseek-r1t2-chimera:free`.

---

## 🔌 API Reference

### `POST /risk`
Analyzes a raw business description string and returns a list of potential risks.
*   **Body**: `{"text": "I own a coffee shop..."}`

### `POST /compare`
Matches a specific policy against a set of business needs.
*   **Body**: `{"text": "business description", "policy_name": "policy_A.pdf"}`

### `POST /analyze-after-upload`
Full pipeline: Uploads PDFs, builds graph, and runs comparison against business info provided in the form data.

---

## 📦 Tech Stack

*   **Language**: Python, TypeScript
*   **Web**: FastAPI, Next.js
*   **ML/AI**: HuggingFace Transformers, PyTorch, LangChain (concepts), NetworkX
*   **Parsing**: PDFPlumber
