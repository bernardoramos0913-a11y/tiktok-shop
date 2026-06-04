# TikTok Shop Clone + Pix SimpSP

## Estrutura
```
/
├── tiktok-shop.html   ← Frontend (abrir no navegador)
├── server.js          ← Backend Node.js (integração SimpSP)
├── package.json       ← Dependências
└── README.md
```

## Como rodar localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar o servidor
```bash
node server.js
# ou com auto-reload:
npx nodemon server.js
```

Você verá:
```
🚀 Servidor rodando em http://localhost:3001
📡 Endpoints disponíveis:
   POST http://localhost:3001/pix/criar
   GET  http://localhost:3001/pix/status/:id
```

### 3. Abrir o frontend
Abra o arquivo `tiktok-shop.html` no navegador normalmente (duplo clique).

> ⚠️ O servidor precisa estar rodando para o Pix funcionar.

---

## Endpoints do backend

### POST `/pix/criar`
Cria uma cobrança Pix na SimpSP.

**Body:**
```json
{
  "amount": 89.90,
  "name": "João Silva",
  "cpf": "12345678900",
  "email": "joao@email.com"
}
```

**Resposta:**
```json
{
  "success": true,
  "transactionId": "txn_abc123",
  "qrCode": "00020126...",
  "qrCodeImage": "data:image/png;base64,...",
  "status": "pending"
}
```

### GET `/pix/status/:id`
Verifica o status de uma transação.

**Resposta:**
```json
{
  "success": true,
  "transactionId": "txn_abc123",
  "status": "paid"
}
```

---

## Publicar no GitHub

```bash
git init
git add .
git commit -m "TikTok Shop + Pix SimpSP"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

> ⚠️ **Importante:** Antes de publicar no GitHub, mova as chaves para variáveis de ambiente:
> 1. Crie um arquivo `.env` com:
>    ```
>    PUBLIC_KEY=pk_pVLC9dkHNQLQt63Of...
>    SECRET_KEY=sk_pJPSh4ByUPoQPSud...
>    ```
> 2. Adicione `.env` no `.gitignore`
> 3. No `server.js`, use `process.env.PUBLIC_KEY` e `process.env.SECRET_KEY`
