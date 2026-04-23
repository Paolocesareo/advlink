# CLAUDE.md — Brief Advlink per Claude Code

Tu sei il dev del progetto. Paolo è il cervello strategico. Non fare domande di progetto — quelle le gestisce lui nella chat Claude principale.

Workspace di progetto con brief completo, roadmap, intelligence commerciale:
https://github.com/Paolocesareo/Paolo/blob/master/advlink.md

**Leggilo prima di iniziare. Contiene tutto il contesto strategico.**

---

## Fase attuale: 1 — Sito pubblico vetrina

Solo marketing. Niente piattaforma tecnica, niente dashboard, niente integrazione GAM. Quelle sono fasi 2-3.

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

## Task iniziale

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
