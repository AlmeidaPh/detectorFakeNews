# Scandit.AI — Detector de Fake News 🤖📰

Projeto de Inteligência Artificial de alta performance para detecção e análise de veracidade em notícias utilizando Machine Learning.

## 🧠 Sobre o Projeto
O **Scandit.AI** é uma aplicação Full-Stack que analisa declarações reais e as classifica em 6 níveis de veracidade. O sistema foi totalmente modernizado para utilizar **Clean Architecture**, garantindo um código desacoplado, testável e pronto para produção.

## 🛠️ Tecnologias Utilizadas

### 💻 Frontend (Moderno)
- **Next.js 15 (App Router)**: Framework React de última geração.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **Framer Motion**: Animações de interface fluidas.
- **Lucide React**: Biblioteca de ícones premium.

### ⚙️ Backend (Clean Architecture)
- **Node.js & Express**: API REST escalável e segura.
- **Mongoose & MongoDB**: Banco de dados NoSQL performático.
- **JWT (JSON Web Tokens)**: Sistema de autenticação persistente.
- **Helmet & CSP**: Proteções rigorosas contra vulnerabilidades web (XSS, Clickjacking).

### 🤖 Machine Learning
- **Python & FastAPI**: Backend de alta performance para inferência.
- **Scikit-learn**: Modelo de regressão logística baseado no dataset **LIAR**.
- **TF-IDF**: Vetorização e análise estatística de texto.

## 🏰 Arquitetura do Sistema
O backend implementa os padrões de **Clean Architecture**:
- **Domain**: Entidades cruciais (`Analysis`, `User`) e interfaces de repositório.
- **Application**: Casos de Uso (`VerifyNews`, `GetHistory`) que contêm as regras da aplicação.
- **Infrastructure**: Adaptadores (`MongooseRepository`, `WebControllers`) que conectam o sistema ao mundo externo.

## 🚀 Funcionalidades Principais
- 🔍 **Verificação Instantânea**: Classificação de veracidade em tempo real.
- 📁 **Painel do Usuário**: Histórico completo de análises salvas automaticamente.
- 📊 **Insights de IA**: Explicações detalhadas sobre os termos que mais influenciaram o veredito.
- 🛡️ **Seguro por Design**: Proteção nativa contra injeção NoSQL, DoS e vazamento de dados infraestruturais.

## 🚀 Inicialização Rápida (Recomendado)

O **Scandit.AI** possui um orquestrador centralizado que inicia os três serviços (Backend, Frontend e IA) simultaneamente com um único comando.

### 📋 Pré-requisitos
- **Node.js**: v20+ 
- **Python**: 3.10+ (com módulos `venv` e `pip`)
- **MongoDB**: Cluster no Atlas ou Instância Local.

### ⚙️ Configuração do Ambiente
1.  **Dependências do Sistema (Linux/Debian)**:
    ```bash
    sudo apt update && sudo apt install python3-pip python3-venv -y
    ```
2.  **Variáveis de Ambiente**:
    - Crie um arquivo `.env` na pasta `backend/` seguindo o modelo:
      ```env
      MONGO_URI=mongodb+srv://...
      JWT_SECRET=sua_chave_secreta
      PORT=5000
      ML_SERVICE_URL=http://localhost:8000/predict
      ```

### 🏁 Rodando o Projeto
Na raiz do projeto, execute:
```bash
# Instala todas as dependências (Backend, Frontend e Venv de IA)
npm run install:all

# Inicia todos os serviços (Backend + Frontend + ML Service)
npm run dev
```

## 🏗️ Estrutura de Diretórios
- `/backend`: API em Clean Architecture (Node.js).
- `/frontend-new`: Interface Next.js 15 (App Router).
- `/IA`: Scripts de treinamento e modelos (`.pkl`).
- `ml_service.py`: Microserviço FastAPI funcional.
- `.venv/`: Ambiente virtual Python isolado.

## 🛡️ Segurança e Hardening
- **CSP Estrita**: Cabeçalhos de segurança via Helmet.
- **Anti-DoS**: Limites de payload configurados no Express.
- **Segredos**: Expurgo total de tokens e senhas do histórico Git.

---
