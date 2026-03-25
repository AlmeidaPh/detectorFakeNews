from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import re
import os
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from typing import Dict, List
import uvicorn

# Pre-download NLTK data
try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')

app = FastAPI(title="Fake News Detector ML Service", version="2.0")

# Robust path handling
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'IA', 'modelo_fake_news.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'IA', 'vetorizador_tfidf.pkl')

# 🚀 Global state for model pipeline
PIPELINE_PATH = os.path.join(BASE_DIR, 'IA', 'modelo_fake_news_pipeline.pkl')
FALLBACK_PATH = os.path.join(BASE_DIR, 'modelo_fake_news_pipeline.pkl')

print(f"🔍 Iniciando carregamento do modelo...", flush=True)

if os.path.exists(PIPELINE_PATH):
    pipeline = joblib.load(PIPELINE_PATH)
    print("🚀 Model Pipeline loaded successfully!", flush=True)
elif os.path.exists(FALLBACK_PATH):
    pipeline = joblib.load(FALLBACK_PATH)
    print(f"🚀 Model Pipeline loaded from fallback: {FALLBACK_PATH}", flush=True)
else:
    print(f"❌ ERRO CRÍTICO: Modelo não encontrado em {PIPELINE_PATH}!", flush=True)
    pipeline = None # Evita crash imediato, mas falhará no /predict

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    verdict: str
    explanation_natural: str
    keywords: Dict[str, float]

def clean_text(text: str) -> str:
    if not text: return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    
    words = text.split()
    cleaned_words = [lemmatizer.lemmatize(w) for w in words if w not in stop_words]
    
    return " ".join(cleaned_words)

def generate_explanation(original_text: str, pred_class: int):
    if pipeline is None:
        return {}
    try:
        classifier = pipeline.named_steps['clf']
        vectorizer = pipeline.named_steps['tfidf']
        
        if not hasattr(classifier, 'coef_'):
            return {}
            
        pesos = classifier.coef_
        pesos_classe = pesos[pred_class]
        
        vocab = vectorizer.vocabulary_
        termos = original_text.lower().split()
        
        explicacoes = {}
        for termo in termos:
            t_clean = clean_text(termo).strip()
            if t_clean in vocab:
                idx = vocab[t_clean]
                peso = float(pesos_classe[idx])
                explicacoes[termo] = round(peso, 4)
        
        return dict(sorted(explicacoes.items(), key=lambda x: abs(x[1]), reverse=True))
    except Exception as e:
        print(f"Error generating explanation: {e}")
        return {}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    if not pipeline:
        raise HTTPException(status_code=500, detail="Model pipeline not loaded")

    raw_text = request.text
    cleaned = clean_text(raw_text)
    
    # Predict directly via pipeline
    pred_idx = int(pipeline.predict([cleaned])[0])
    
    label_map = {
        0: 'pants-fire',
        1: 'false',
        2: 'barely-true',
        3: 'half-true',
        4: 'mostly-true',
        5: 'true'
    }
    
    verdict = label_map.get(pred_idx, 'unknown')
    expl = generate_explanation(raw_text, pred_idx)
    
    return {
        "verdict": verdict,
        "explanation_natural": f"A análise estatística correlaciona o texto com o padrão '{verdict}'.",
        "keywords": expl
    }

@app.get("/health")
async def health():
    return {"status": "online", "model": "logistic-regression-v2"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
