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

## 🔧 Instalação e Execução

1.  Configure as variáveis de ambiente nos arquivos `.env` das pastas `backend/` e `frontend-new/`.
2.  Inicie o serviço de Machine Learning:
    ```bash
    python ml_service.py
    ```
3.  Inicie o servidor Backend:
    ```bash
    cd backend && node server.js
    ```
4.  Inicie o Frontend:
    ```bash
    cd frontend-new && npm run dev
    ```

---
*Desenvolvido sob rigorosos padrões de engenharia de software.*
