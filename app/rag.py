import google.generativeai as genai
from typing import List, Dict
from .config import GOOGLE_API_KEY, GEMINI_MODEL

SYSTEM_INSTRUCTIONS = """You are a precise assistant answering from policy documents.
Follow STRICT rules:
1) Answer ONLY using the provided context snippets.
2) If the answer is not present, say "I couldn't find that in the documents."
3) Include citations like [Doc: {doc_name}, p.{page}] where relevant but only include it is sources not is answer.
4) Be concise and quote exact policy language for critical numbers.
"""

def build_context(snippets: List[Dict]) -> str:
    lines = []
    for i, sn in enumerate(snippets, 1):
        lines.append(f"[{i}] DOC={sn['doc_name']} PAGE={sn['page']}\n{sn['text']}\n")
    return "\n---\n".join(lines)

def ask_llm(question: str, snippets: List[Dict], model_name: str = GEMINI_MODEL) -> str:
    """
    Send the question + context snippets to Gemini and return an answer.
    """
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel(model_name)

    context = build_context(snippets)
    prompt = f"""{SYSTEM_INSTRUCTIONS}

Question: {question}

Context Snippets:
{context}

Answer (with citations):
"""

    resp = model.generate_content(prompt)
    return resp.text.strip()
