#!/bin/bash
# Script de inicialização do serviço de ML para produção
echo "🚀 Iniciando Scandit.AI Machine Learning Service..."

# Verifica se o ambiente virtual existe, senão cria e instala dependências
if [ ! -d "venv_ml" ]; then
    echo "📦 Criando ambiente virtual e instalando dependências..."
    python3 -m venv venv_ml
    source venv_ml/bin/activate
    pip install --upgrade pip
    pip install -r requirements_ml.txt
else
    source venv_ml/bin/activate
fi

# Inicia o serviço usando Uvicorn com Workers para performance
# --workers 4 aumenta a capacidade de processamento paralelo
uvicorn ml_service:app --host 0.0.0.0 --port 8000 --workers 4
