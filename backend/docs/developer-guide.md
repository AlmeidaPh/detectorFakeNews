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

## 🛡️ Segurança e Limites

- **Limite de Payload**: A API aceita no máximo **15kb** por requisição (JSON).
- **CORS**: Apenas origens autorizadas podem consumir a API em ambiente de produção.
- **Headers**: O sistema utiliza `Helmet` para prevenir ataques de injeção e XSS.

## 🚦 Códigos de Erro

| Código | Descrição |
|---|---|
| 200 | Sucesso |
| 400 | Erro na requisição (ex: texto faltando) |
| 401 | Não autorizado (Token inválido ou expirado) |
| 500 | Erro interno do servidor |

---
*Para mais detalhes, consulte o arquivo [openapi.yaml](./openapi.yaml).*
