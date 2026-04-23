# CLAUDE.md — Brief Advlink

Workspace di progetto con brief completo, roadmap, intelligence commerciale:
https://github.com/Paolocesareo/Paolo/blob/master/advlink.md

**Leggilo prima di iniziare. Contiene tutto il contesto strategico.**

---

## Sviluppo via team-dev

Lo sviluppo di Advlink usa gli agenti specializzati del team-dev di Paolo (`team-dev/.claude/agents/`).

**Per sviluppo full-stack** (sito, dashboard, integrazioni, Edge Functions, tag JS):
→ usa `@advlink-dev`

L'agente conosce già stack, palette brand, roadmap, conflitti tecnici e regole. Brief integrato.

**Per testing end-to-end** (API, deploy Netlify, flussi reali):
→ usa `@tester-qa` (generico riusabile)

Per fase 1 bastano questi due. Per fase 2 (GAM + Prebid) valuteremo se creare un `advlink-adops` specialist.

---

## Stato attuale

- **Fase 1 (M1-M5)** — completata. Sito pubblico vetrina online (home + editori + inserzionisti + chi-siamo + contatti con Resend).
- **Sprint iter.2 (M6-M11)** — completato. Dati OPS Idea integrati, pagine legali (privacy, cookie), OG image, structured data, security headers (commit `2c7e0eb`).
- **Bridge Fase 2 (M12-M16)** — completato. Monorepo predisposto con route groups `(marketing)` / `(dashboard)`, `/api/health`, `/api/ingest` placeholder, scaffolding Supabase, documentazione (`ARCHITECTURE.md`). Il codice è pronto a ospitare la dashboard senza averla ancora costruita.

## Prossimi passi

**Fase 2** — da avviare solo dopo input bloccanti di Paolo (vedi `docs/03-spec-evolutiva-claude-code.md` §7):

1. GAM Network Code OPS Idea
2. GAM Service Account JSON (credenziali API)
3. Supabase project credentials (URL, anon key, service role key)
4. Lista testate per pilota (la più piccola)
5. Conferma palette finale (rosso editoriale già ok)
6. Conferma commission rate Advlink (proposta 22%)

Finché questi input non arrivano, il repo resta in stato "Fase 1 + bridge". Per contesto tecnico completo sull'architettura target vedi `ARCHITECTURE.md`.

## Fase 1 (storico — completata)

Solo marketing. Sito statico vetrina. Niente piattaforma tecnica, niente dashboard, niente integrazione GAM.

## Stack vincolante

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Deploy target: Netlify (config già presente in `netlify.toml`)
- Quando servirà: Supabase (fase 2, NON ora)

## Posizionamento del sito (CRITICO)

Advlink non si presenta come "ennesima ad-tech". Il messaging deve essere chiaro:

- **"Da editori, per editori"** — non società tech esterna, ma piattaforma nata dentro un gruppo editoriale (ex-Netweek)
- **Trasparenza commissioni** — esplicita la commissione, mentre il mercato è opaco
- **Specializzazione editoria locale e regionale** — il segmento dove i grandi player (Dorvan ecc.) non operano
- **Integrazione nativa Google Ad Manager** — credibilità tecnica
- **Tre prodotti chiari**: Piattaforma (header bidding + dashboard) · Reach+ (raccolta) · Analytics (revenue real-time)

Tono: martech, sobrio, professionale. Mai "agenzia creativa", mai "rivoluzionario".

## Task iniziale (storico — completato)

> Questa sezione resta come riferimento: descrive il setup iniziale del repo Next.js, ora completo. Per il prossimo step vedi "Prossimi passi" sopra.

1. **Inizializza** Next.js 14 nella root del repo (App Router, TypeScript, Tailwind, ESLint)
2. **Setup base:**
   - `src/app/layout.tsx` con Header + Footer
   - Tailwind config con palette brand rosso editoriale (vedi sotto)
   - Font: Inter da `next/font/google`

### Palette brand (vincolante)

```js
// tailwind.config.ts → theme.extend.colors
brand: {
  50:  '#fef2f2',  // soft background per sezioni accent
  100: '#fee2e2',  // tag/badge bg
  600: '#dc2626',  // (riserva)
  700: '#b91c1c',  // link, text accent, focus ring
  800: '#991b1b',  // button primario, accent dominante
  900: '#7f1d1d',  // hover button, dark accent
}
```

Uso:
- **Bottoni primari**: bg `brand.800`, hover `brand.900`, testo bianco
- **Link e text accent**: `brand.700`
- **Bordi e ring focus**: `brand.700`
- **Background soft per sezioni**: `brand.50`
- **Logo wordmark**: nero `slate-900`, con pallino accent `brand.800` accanto

Neutri: usa Tailwind `slate` (slate-50 background, slate-900 testo body, slate-600 testo secondario, slate-200 bordi).

Niente gradienti, niente shadow drammatici. Sobrio.
3. **Pagine** (tutte statiche in fase 1):
   - `/` — Home: hero, value prop editori, 3 sezioni servizi (Piattaforma · Reach+ · Analytics), CTA contatti
   - `/editori` — target editori: integrazione GAM, trasparenza commissioni, focus locale, dashboard real-time
   - `/inserzionisti` — target brand: performance in ambienti editoriali premium, CPC/CPCV
   - `/chi-siamo` — nati dentro un gruppo editoriale, missione, team
   - `/contatti` — form (in fase 1 invia via email con Resend; Supabase arriva in fase 2)

## Regole di codice

- TypeScript strict
- Componenti in `src/components`, pagine in `src/app`
- SEO: `metadata` export in ogni pagina, sitemap.xml, robots.txt
- Niente Shadcn/ui se basta Tailwind puro
- Accessibilità minima: tag semantici, alt, contrasti AA
- Mobile first

## Deploy

`netlify.toml` già presente nel repo.
Plugin: `@netlify/plugin-nextjs` (va installato come devDependency).

## Fase 2 (NON svilupparla ora — è solo per contesto)

Piattaforma tecnica con MVP in 6 settimane:
- Auth Supabase per editori (RLS per isolamento dati)
- Dashboard EditorView-like (revenue, CPM, impression, fill rate, payable pageview per testata)
- Integrazione Google Ad Manager via API + Service Account
- Prebid.js wrapper proprietario, 3 SSP iniziali (Magnite, Index Exchange, Pubmatic)
- Tag Advlink servito da `cdn.advlink.it/s/{publisher}/adv.js`
- Webhook SSP → Supabase per dati real-time

## Fase 3 (NON svilupparla ora — solo contesto)

- Layer AI categorizzazione IAB contenuti
- Revenue forecasting
- Pannello admin gestione publisher

---

Se serve una decisione strategica o di posizionamento, scrivi a Paolo nella chat Claude principale — non improvvisare.
