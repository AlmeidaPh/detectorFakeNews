import pandas as pd
import re
import os
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
from imblearn.over_sampling import SMOTE

# 🎯 Configurações
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'liar_dataset')
OUTPUT_PATH = os.path.join(BASE_DIR, 'modelo_fake_news_pipeline.pkl')

# ⏬ Download NLTK data
try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')

def clean_text(text):
    if not isinstance(text, str): return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    
    words = text.split()
    cleaned = [lemmatizer.lemmatize(w) for w in words if w not in stop_words]
    return " ".join(cleaned)

# 1. Carregar Dados
print("📂 Carregando dataset LIAR...")
cols = ['id', 'label', 'statement', 'subject', 'speaker', 'job', 'state', 'party', 'bt', 'f', 'ht', 'mt', 'pof', 'context']
train = pd.read_csv(os.path.join(DATA_DIR, "train.tsv"), sep='\t', header=None, names=cols).fillna('')
valid = pd.read_csv(os.path.join(DATA_DIR, "valid.tsv"), sep='\t', header=None, names=cols).fillna('')

label_map = {
    'pants-fire': 0, 'false': 1, 'barely-true': 2, 
    'half-true': 3, 'mostly-true': 4, 'true': 5
}

train['y'] = train['label'].map(label_map)
valid['y'] = valid['label'].map(label_map)

# 2. Pré-processamento
print("🧹 Limpando textos...")
train['X'] = train['statement'].apply(clean_text)
valid['X'] = valid['statement'].apply(clean_text)

# 3. Construção e Treinamento
print("🏗️ Construindo Pipeline e Vetorizando...")
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X_train_tfidf = tfidf.fit_transform(train['X'])

print("⚖️ Balanceando classes com SMOTE...")
smote = SMOTE(random_state=42)
X_res, y_res = smote.fit_resample(X_train_tfidf, train['y'])

print("🚂 Treinando Classificador (Logistic Regression)...")
clf = LogisticRegression(max_iter=2000)
clf.fit(X_res, y_res)

# 4. Criar o Pipeline Final com os componentes treinados
pipeline = Pipeline([
    ('tfidf', tfidf),
    ('clf', clf)
])

# 5. Avaliação
print("📊 Avaliando no conjunto de validação...")
y_pred = pipeline.predict(valid['X'])
print(f"\nAcurácia: {accuracy_score(valid['y'], y_pred):.4f}")
print("\nRelatório de Classificação:")
print(classification_report(valid['y'], y_pred, target_names=list(label_map.keys())))

# 6. Salvar Artefatos
print(f"💾 Salvando pipeline em: {OUTPUT_PATH}")
joblib.dump(pipeline, OUTPUT_PATH)
print("\n✅ Treinamento concluído com sucesso!")
