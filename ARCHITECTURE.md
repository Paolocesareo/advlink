# Architettura Advlink

## 1. Panoramica

Advlink è una piattaforma di monetizzazione pubblicitaria per editori locali e regionali, nata dentro un gruppo editoriale italiano (ex-Netweek / Gruppo Sciscione). Il repo è un monorepo unico che ospita insieme sito marketing, dashboard publisher auth-only, endpoint API server-side e — in fase 2 — Edge Functions Supabase e tag JS servito da CDN: un'unica codebase Next.js 14 semplifica deploy, versioning, condivisione di tipi e componenti tra area pubblica e area riservata.

## 2. Route groups

La struttura `src/app/` segrega le aree tramite route group Next.js (le parentesi `()` nel nome non impattano l'URL):

```
src/app/
├── (marketing)/     # route pubbliche no-auth (home, editori, inserzionisti, chi-siamo, contatti, privacy, cookie)
├── (dashboard)/     # route protette auth Supabase (dashboard, login) — fase 2
├── api/             # server endpoints (contact, health, ingest, ...)
└── layout.tsx       # root layout con Header+Footer
```

La home resta `/`, `/editori` resta `/editori`, la dashboard sarà `/dashboard`, ecc. In fase 2 `(dashboard)/layout.tsx` diventerà un layout sostitutivo con sidebar propria e auth-check Supabase, sovrascrivendo Header/Footer marketing del root layout.

## 3. Schema Supabase atteso (Fase 2)

Lo schema completo multi-tenant con RLS per `publisher_id` è descritto in `docs/02-audit-cliente-ops-idea.md` §5.2 (vedi anche `docs/01-analisi-piattaforma-flux.md` per i pattern derivati da Flux). Non duplichiamo qui il DDL.

Tabelle attese di alto livello:

- `publishers` — anagrafica editore, slug, commission rate
- `sites` — testate per publisher
- `ssps` — header bidding partners
- `gam_daily_aggregates` — pull quotidiano da Google Ad Manager API
- `realtime_events` — eventi impression/revenue ingeriti dal tag JS
- `invoices` — inviti a fatturare mensili
- `ads_txt_status` — verifica ads.txt per dominio
- `health_checks` — uptime/status monitor interno

## 4. Pipeline ingest prevista

- Tag JS `cdn.advlink.it/s/{slug}/adv.js` iniettato dall'editore emette eventi impression/revenue lato browser.
- POST `/api/ingest` (attualmente placeholder 501 in Next, diventerà Edge Function Supabase con partitioning oraria e scrittura batched).
- Supabase Realtime channel emette aggiornamenti verso il client dashboard per i grafici live.
- Edge Function cron `gam-pull-daily` e `gam-pull-pageviews` eseguono il pull riconciliativo quotidiano da Google Ad Manager API via Service Account (vedi `docs/03-spec-evolutiva-claude-code.md` §3).

## 5. Tag JS publisher

Struttura pianificata per fase 2:

- Vanilla JS, zero dipendenze runtime (no framework, bundle piccolo).
- Inietta wrapper Prebid.js proprietario Advlink e invia eventi al beacon `/api/ingest`.
- Versioning via path: `cdn.advlink.it/s/{publisher}/v1/adv.js` (major-pinned lato editore).
- **Conflitto noto**: NON coesiste con il wrapper Dorvan sulla stessa pagina — lo switch richiede offboarding preventivo (vedi brief agente in `.claude/agents/advlink-dev.md`).

## 6. Security

- Security headers (CSP, HSTS, Referrer-Policy, X-Frame-Options, ecc.) configurati in `netlify.toml`.
- CSP attuale permette solo origini note (self + font/fogli Inter + resend domain per action form).
- Fase 2: RLS Supabase multi-tenant per `publisher_id` su ogni tabella — un editore non può mai vedere dati di un altro.
- GAM Service Account JSON tenuto esclusivamente in env vars Netlify (mai committato), esposto solo alle Edge Functions server-side.
- Chiave `SUPABASE_SERVICE_ROLE_KEY` usata solo server-side; il client browser riceve solo `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 7. Deploy

- Hosting: Netlify, auto-deploy dal branch `main`.
- Plugin: `@netlify/plugin-nextjs` (devDependency).
- Env vars sensibili (Resend API key, in fase 2 Supabase keys + GAM Service Account) gestite nella Netlify UI, mai nel repo.
- Il sito pubblico è SSG; le route dinamiche (`/api/*`) girano su Netlify Functions Node runtime.

## 8. Riferimenti

- `docs/01-analisi-piattaforma-flux.md` — analisi della piattaforma Flux/Dorvan come benchmark funzionale.
- `docs/02-audit-cliente-ops-idea.md` — audit del cliente OPS Idea, dati reali e schema target (§5.2).
- `docs/03-spec-evolutiva-claude-code.md` — spec evolutiva con milestone M1-M16 e preview Fase 2.
- `CLAUDE.md` — brief repo (stato corrente, stack, regole codice, palette brand).
- `.claude/agents/advlink-dev.md` — brief agente di sviluppo full-stack.
