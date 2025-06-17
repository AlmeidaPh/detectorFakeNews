from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import numpy as np

app = Flask(__name__)
CORS(app)  # Libera o acesso ao backend por outros domínios

# Carrega o modelo e o vetorizador salvos
modelo = joblib.load('/IA/modelo_fake_news.pkl')              # Modelo treinado
vectorizer = joblib.load('/IA/vetorizador_tfidf.pkl')         # Vetorizador TF-IDF treinado

# Função para limpar o texto
def limpar_texto(texto):
    texto = texto.lower()
    texto = re.sub(r'[^\w\s]', '', texto)  # remove pontuação
    texto = re.sub(r'\d+', '', texto)      # remove números
    return texto

# Função para gerar explicação com palavras mais relevantes
def gerar_explicacao(texto_vetorizado, texto_original):
    try:
        # Obtem os coeficientes do modelo
        pesos = modelo.coef_

        # Para classificação multiclasse, usa a classe prevista
        classe_predita = modelo.predict(texto_vetorizado)[0]
        pesos_classe = pesos[classe_predita]

        # Pega o vocabulário do TF-IDF
        vocabulario = vectorizer.vocabulary_

        # Divide o texto original em termos
        termos = texto_original.lower().split()

        # Mapeia os termos para os pesos correspondentes
        explicacoes = {}
        for termo in termos:
            if termo in vocabulario:
                idx = vocabulario[termo]
                peso = pesos_classe[idx]
                explicacoes[termo] = round(float(peso), 4)

        # Ordena as palavras por peso absoluto (maior influência)
        explicacoes_ordenadas = dict(sorted(
            explicacoes.items(), key=lambda x: abs(x[1]), reverse=True
        ))

        return explicacoes_ordenadas
    except Exception as e:
        print("Erro ao gerar explicação:", str(e))
        return {}

# Rota para prever se uma notícia é fake ou não
@app.route('/prever', methods=['POST'])
def prever_fake_news():
    data = request.get_json()

    if 'texto' not in data:
        return jsonify({'erro': 'Campo "texto" é obrigatório.'}), 400

    texto_original = data['texto']
    texto_limpo = limpar_texto(texto_original)

    texto_vetorizado = vectorizer.transform([texto_limpo])
    predicao = modelo.predict(texto_vetorizado)[0]

    # Mapeia o rótulo
    label_map_reverso = {
        0: 'pants-fire',
        1: 'false',
        2: 'barely-true',
        3: 'half-true',
        4: 'mostly-true',
        5: 'true'
    }
    resultado = label_map_reverso.get(predicao, 'desconhecido')

    # Gera a explicação
    explicacao = gerar_explicacao(texto_vetorizado, texto_original)

    return jsonify({
        'veredito': resultado,
        'explicacao_natural': f"O modelo classificou como '{resultado}' com base nas palavras-chave abaixo.",
        'palavras_chave': explicacao
    })

if __name__ == '__main__':
    app.run(debug=True)
