import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from imblearn.over_sampling import SMOTE, RandomOverSampler
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter

# =============================
# Etapa 1 – Leitura dos Dados
# =============================

# Lê os três conjuntos do dataset LIAR
dados_colunas = ['id', 'label', 'statement', 'subject', 'speaker', 'speaker_job_title', 'state_info',
                 'party_affiliation', 'barely_true_counts', 'false_counts', 'half_true_counts',
                 'mostly_true_counts', 'pants_on_fire_counts', 'context']

train = pd.read_csv("liar_dataset/train.tsv", sep='\t', header=None)
test = pd.read_csv("liar_dataset/test.tsv", sep='\t', header=None)
valid = pd.read_csv("liar_dataset/valid.tsv", sep='\t', header=None)

train.columns = test.columns = valid.columns = dados_colunas

# =============================
# Etapa 2 – Análise Exploratória
# =============================

print(train[['label', 'statement']].head())
print("\nDistribuição de rótulos no conjunto de treino:")
print(train['label'].value_counts())

print("\nExemplo de frase por rótulo:")
rotulos_unicos = train['label'].unique()
for rotulo in rotulos_unicos:
    exemplo = train[train['label'] == rotulo]['statement'].iloc[0]
    print(f"Rótulo: {rotulo}\n  Exemplo: {exemplo}\n{'-'*40}")

print("\nVerificando valores ausentes (nulos):")
print(train.isnull().sum())

train.fillna('', inplace=True)
test.fillna('', inplace=True)
valid.fillna('', inplace=True)

# =============================
# Etapa 3 – Pré-processamento
# =============================

label_map = {
    'pants-fire': 0,
    'false': 1,
    'barely-true': 2,
    'half-true': 3,
    'mostly-true': 4,
    'true': 5
}

train['label_num'] = train['label'].map(label_map)
test['label_num'] = test['label'].map(label_map)
valid['label_num'] = valid['label'].map(label_map)

print("\nRótulos convertidos:")
print(train[['label', 'label_num']].head())

# Limpeza de texto
def limpar_texto(texto):
    texto = texto.lower()
    texto = re.sub(r'[^\w\s]', '', texto)
    texto = re.sub(r'\d+', '', texto)
    return texto

train['clean_statement'] = train['statement'].apply(limpar_texto)
test['clean_statement'] = test['statement'].apply(limpar_texto)
valid['clean_statement'] = valid['statement'].apply(limpar_texto)

print("\nTexto limpo de exemplo:")
print(train[['statement', 'clean_statement']].head(1))

# Vetorização TF-IDF
vectorizer = TfidfVectorizer(max_features=5000)
X_train_tfidf = vectorizer.fit_transform(train['clean_statement'])
X_test_tfidf = vectorizer.transform(test['clean_statement'])
X_valid_tfidf = vectorizer.transform(valid['clean_statement'])

print("\nTF-IDF aplicado com sucesso!")
print(f"Formato da matriz de treino: {X_train_tfidf.shape}")

# =============================
# Etapa 4 – Treinamento e Avaliação Inicial
# =============================

# Balanceamento com SMOTE
smote = SMOTE(random_state=42)
X_train_bal, y_train_bal = smote.fit_resample(X_train_tfidf, train['label_num'])

unique, counts = np.unique(y_train_bal, return_counts=True)
print("\nDistribuição após SMOTE:")
for label, count in zip(unique, counts):
    print(f"Classe {label}: {count} amostras")

# Treina o modelo
modelo = LogisticRegression(max_iter=1000)
modelo.fit(X_train_bal, y_train_bal)

#joblib é uma biblioteca que facilita salvar objetos como modelos, vetorizadores e arrays de forma eficiente.
import joblib

# Salva o modelo treinado
joblib.dump(modelo, 'modelo_fake_news.pkl')

# Salva o vetorizador TF-IDF
joblib.dump(vectorizer, 'vetorizador_tfidf.pkl')
print("\nModelo e vetorizador salvos com sucesso!")

# Avaliação no conjunto de validação
y_valid = valid['label_num']
y_pred = modelo.predict(X_valid_tfidf)

nomes_rotulos = ['pants-fire', 'false', 'barely-true', 'half-true', 'mostly-true', 'true']

print("\nAcurácia:", accuracy_score(y_valid, y_pred))
print("\nRelatório de Classificação (sem balanceamento):")
print(classification_report(y_valid, y_pred, target_names=nomes_rotulos))

# Matriz de confusão
cm = confusion_matrix(y_valid, y_pred)
plt.figure(figsize=(10, 7))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=nomes_rotulos, yticklabels=nomes_rotulos)
plt.xlabel('Previsto')
plt.ylabel('Real')
plt.title('Matriz de Confusão (sem balanceamento)')
plt.tight_layout()
plt.show()

# =============================
# Etapa 5 – Avaliação com RandomOverSampler
# =============================

ros = RandomOverSampler(random_state=42)
X_train_bal, y_train_bal = ros.fit_resample(X_train_tfidf, train['label_num'])
print("\nDistribuição após Oversampling:", Counter(y_train_bal))

modelo.fit(X_train_bal, y_train_bal)
y_pred_bal = modelo.predict(X_valid_tfidf)

print("\nResultados após balanceamento com RandomOverSampler:")
print(classification_report(y_valid, y_pred_bal, target_names=nomes_rotulos))
print("Acurácia:", accuracy_score(y_valid, y_pred_bal))

cm_bal = confusion_matrix(y_valid, y_pred_bal)
plt.figure(figsize=(10, 7))
sns.heatmap(cm_bal, annot=True, fmt='d', cmap='Blues', xticklabels=nomes_rotulos, yticklabels=nomes_rotulos)
plt.xlabel('Previsto')
plt.ylabel('Real')
plt.title('Matriz de Confusão (com Oversampling)')
plt.tight_layout()
plt.show()


