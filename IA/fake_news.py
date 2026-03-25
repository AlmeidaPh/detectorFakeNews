import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
from imblearn.over_sampling import SMOTE
import joblib
import os
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Pre-download NLTK
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

# 1. Load Data
cols = ['id', 'label', 'statement', 'subject', 'speaker', 'job', 'state', 'party', 'bt', 'f', 'ht', 'mt', 'pof', 'context']
train = pd.read_csv("liar_dataset/train.tsv", sep='\t', header=None, names=cols).fillna('')
valid = pd.read_csv("liar_dataset/valid.tsv", sep='\t', header=None, names=cols).fillna('')

label_map = {
    'pants-fire': 0, 'false': 1, 'barely-true': 2, 
    'half-true': 3, 'mostly-true': 4, 'true': 5
}

train['y'] = train['label'].map(label_map)
valid['y'] = valid['label'].map(label_map)

# 2. Preprocess
print("Cleaning text...")
train['X'] = train['statement'].apply(clean_text)
valid['X'] = valid['statement'].apply(clean_text)

# 3. Pipeline Definition
print("Building Pipeline...")
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
    ('clf', LogisticRegression(max_iter=2000, multi_class='multinomial'))
])

# 4. Handle Imbalance (Prior to Pipeline or via Sample Weights)
# Since SMOTE is on sparse matrices, we'll do it manually before fit
tfidf_vec = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X_train_tfidf = tfidf_vec.fit_transform(train['X'])

print("Balancing with SMOTE...")
smote = SMOTE(random_state=42)
X_res, y_res = smote.fit_resample(X_train_tfidf, train['y'])

# 5. Train
print("Training model...")
pipeline.named_steps['clf'].fit(X_res, y_res)
# Set the fitted vectorizer back to pipeline to ensure consistency
pipeline.named_steps['tfidf'].vocabulary_ = tfidf_vec.vocabulary_
pipeline.named_steps['tfidf'].idf_ = tfidf_vec.idf_
pipeline.named_steps['tfidf'].stop_words_ = tfidf_vec.stop_words_

# 6. Evaluate
y_pred = pipeline.predict(valid['X'])
print(f"\nAccuracy: {accuracy_score(valid['y'], y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(valid['y'], y_pred, target_names=list(label_map.keys())))

# 7. Save Artifacts
joblib.dump(pipeline, 'modelo_fake_news_pipeline.pkl')
print("\n✅ Global Pipeline saved as 'modelo_fake_news_pipeline.pkl'")
