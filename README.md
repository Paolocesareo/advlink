# Advlink

Piattaforma pubblicitaria per editori. Modello martech ispirato a Dorvan, applicato al mercato editoriale italiano.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Supabase** (auth, DB, storage)
- **Netlify** (deploy automatico on push)

## Moduli

- **Sito pubblico** — marketing, landing editori e inserzionisti
- **Area cliente** — dashboard editore con metriche in tempo reale (fase 2)
- **API** — ingest tag di tracking + integrazione Google Ad Manager (fase 2-3)

## Setup locale

```bash
npm install
npm run dev
```

Richiede `.env.local` con le credenziali Supabase (vedi `.env.example`).

## Deploy

Push su `main` → build e deploy automatici su Netlify.

## Workspace e brief

Brief completo, roadmap e decisioni nel workspace:
https://github.com/Paolocesareo/Paolo/blob/master/advlink.md

Brief specifico per Claude Code: vedi [`CLAUDE.md`](./CLAUDE.md).
