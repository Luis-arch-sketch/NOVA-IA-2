# NOVA AI

Uma nova geração de inteligência artificial.

Plataforma completa de IA com contas reais, chat persistente, projetos, créditos calculados no servidor e integração oficial com a API da OpenAI.

## Requisitos

- Node.js 18 ou superior
- PostgreSQL 13 ou superior
- Uma chave da OpenAI (ou endpoint compatível)

## Instalação

```bash
npm install
cp .env.example .env
```

## Variáveis de ambiente

Edite o `.env` com sua OPENAI_API_KEY, DATABASE_URL, SESSION_SECRET etc.

## Como iniciar

```bash
npm start
```

## Deploy (Render)

1. Crie um Web Service apontando para este repositório.
2. Adicione um PostgreSQL e copie a Internal Database URL para `DATABASE_URL`.
3. Defina OPENAI_API_KEY, OPENAI_MODEL, SESSION_SECRET, NODE_ENV=production.
4. Build: `npm install` — Start: `npm start`

Há também um `render.yaml` e um `Procfile` na raiz.
