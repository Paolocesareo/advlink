# CLAUDE.md — Brief Advlink per Claude Code

Tu sei il dev del progetto. Paolo è il cervello strategico. Non fare domande di progetto — quelle le gestisce lui nella chat Claude principale.

Workspace di progetto con roadmap, decisioni, parking lot:
https://github.com/Paolocesareo/Paolo/blob/master/advlink.md

---

## Fase attuale: 1 — Sito pubblico

Solo marketing. Niente area cliente, niente tracking, niente integrazione GAM. Quelle sono fasi successive.

## Stack vincolante

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Deploy target: Netlify
- Quando servirà: Supabase (già nel piano, ma NON in fase 1)

## Task iniziale

1. **Inizializza** Next.js 14 (App Router, TypeScript, Tailwind, ESLint) direttamente nella root del repo
2. **Setup base:**
   - `src/app/layout.tsx` con Header + Footer
   - Tailwind config con palette brand sobria (neutri + 1 accent color — confermare con Paolo in chat)
   - Font: Inter da `next/font/google`
3. **Pagine** (tutte statiche in fase 1):
   - `/` — Home: hero, value prop editori, 3 sezioni servizi, CTA contatti
   - `/editori` — target editori: cosa offriamo, integrazione Google Ad Manager, trasparenza
   - `/inserzionisti` — target brand: performance in ambienti editoriali premium
   - `/chi-siamo` — team, missione
   - `/contatti` — form (in fase 1 invia via email con Resend o simile; Supabase arriva in fase 2)

## Ispirazione design

- **dorvan.it** — tono martech, trasparenza, editoria
- Sobrio, professionale, non da agenzia creativa
- Mobile first

## Regole di codice

- TypeScript strict
- Componenti in `src/components`, pagine in `src/app`
- SEO: `metadata` export in ogni pagina, sitemap, robots.txt
- Niente Shadcn/ui se basta Tailwind puro
- Accessibilità minima: tag semantici, alt, contrasti ok

## Deploy

`netlify.toml` già presente nel repo.

Plugin: `@netlify/plugin-nextjs` (già dichiarato nel toml — va installato in locale come devDependency).

## Fase 2 (NON svilupparla ora)

- Auth Supabase per clienti editori
- Dashboard metriche (click, revenue, payable pageview)
- Integrazione Google Ad Manager via OAuth per cliente
- Script JS proprietario `/tag.js` servito dal dominio

## Fase 3 (NON svilupparla ora)

- Endpoint ingest eventi del tag
- Pannello admin per gestione clienti

---

Se serve una decisione strategica, scrivi a Paolo nella chat Claude — non prendere decisioni di architettura da solo.
