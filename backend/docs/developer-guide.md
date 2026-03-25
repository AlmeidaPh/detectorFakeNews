# Scandit.AI — Guia do Desenvolvedor 🚀

Este guia fornece as informações necessárias para se integrar à API do Scandit.AI.

## 🔑 Autenticação

A API utiliza **JSON Web Tokens (JWT)** para autenticação.

1.  **Login**: Envie suas credenciais para `POST /api/auth/login`.
2.  **Token**: Você receberá um `token` na resposta.
3.  **Uso**: Inclua o token no cabeçalho de todas as requisições protegidas:
    ```http
    Authorization: Bearer <seu_token>
    ```

## 🔍 Endpoints Principais

### 1. Verificação de Notícias
**POST** `/api/news/verify`

Analisa um texto e retorna a probabilidade de ser Fake News.

**Exemplo cURL:**
```bash
curl -X POST http://localhost:5000/api/news/verify \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"text": "Notícia para analisar..."}'
```

### 2. Histórico de Análises
**GET** `/api/news/history`

Retorna todas as análises realizadas pelo usuário autenticado.

## 🏗️ Clean Architecture

O Scandit.AI segue os princípios da **Arquitetura Limpa**, o que significa que o código é dividido em camadas de responsabilidade:

1.  **Domain (Domínio)**: Contém as entidades (`Analysis.js`, `User.js`) e as regras de negócio que nunca mudam, independente de usarmos MongoDB ou SQL.
2.  **Application (Aplicação)**: Onde residem os **Casos de Uso** (`VerifyNewsUseCase.js`). Eles orquestram o fluxo de dados entre o domínio e o mundo externo.
3.  **Infrastructure (Infraestrutura)**: Contém os adaptadores técnicos, como o repositório de dados (`MongooseAnalysisRepository.js`) e os controladores Web.

## 🤖 Integração com Machine Learning

O Backend não processa a IA diretamente. Ele se comunica com um **Microserviço FastAPI** (porta 8000) especializado em inferência.

-   **Fluxo**: Backend ➔ `axios.post` ➔ FastAPI ➔ `joblib.load(model)` ➔ Resposta JSON.
-   **Segurança**: O backend possui um timeout de 15 segundos para evitar que falhas na IA travem a API principal.

## 🛡️ Segurança e Hardening

-   **Anti-DoS**: O limite de body no Express é de **15kb**.
-   **NoSQL Injection**: Sanitização automática via Mongoose.
-   **X-Powered-By**: Cabeçalho desabilitado para dificultar o reconhecimento da stack por atacantes.

## 🚦 Códigos de Erro

| Código | Descrição |
|---|---|
| 200 | Sucesso total |
| 400 | Erro na requisição (texto muito curto ou formato inválido) |
| 401 | Não autorizado (Token JWT ausente ou expirado) |
| 404 | Recurso não encontrado |
| 500 | Erro interno (Geralmente falha de conexão com DB ou IA) |

---
*Para ver a especificação técnica completa dos campos, consulte o arquivo [openapi.yaml](./openapi.yaml).*
