# Spec evolutiva — Iterazione sito vetrina + bridge a Fase 2 Platform

**Versione**: 1.0
**Data**: 23 aprile 2026
**Owner**: Paolo · Esecutore: Claude Code via @advlink-dev (+ @tester-qa)
**Stato precedente**: Fase 1 completata (5 pagine, form Resend, 15/15 test PASS, 2 commit su main)

---

## 0. Regole operative (immutate)

- Procedi senza chiedere conferma per implementazione e micro-decisioni
- Chiedi conferma solo per: scelte di posizionamento/copy strategica, nuove dipendenze pesanti, modifiche stack, modifiche palette/tono
- Pusha su `main` ad ogni milestone funzionante; commit message inglese (`feat:`, `fix:`, `chore:`, `docs:`)
- Per dato bloccante mancante: usa placeholder sensato + `// TODO:` invece di fermarti
- Delega: `@advlink-dev` per dev full-stack, `@tester-qa` per E2E
- Tu sei orchestratore: leggi risultati, decidi prossimo passo, lanci prossimo agente

---

## 1. Sito vetrina — Iterazione 2 (Sprint corto, 1 settimana max)

### M6 — Aggiornamento copy con dati reali

**Contesto**: ora abbiamo dati certificati sul cliente OPS Idea. Il sito può usarli (anonimizzati ma quantificati) per pitch più efficace.

**Su `/`** (home):
- Sostituire eventuali placeholder generici con metriche di posizionamento:
  - Hero sub: aggiungere riga sotto: "Network di oltre 100 testate, 7 regioni italiane, 4 capoluoghi."
  - Sezione "Perché Advlink": aggiungere 2 punti ai 3 esistenti:
    - "Commissione esplicita e dichiarata, sotto la media di mercato"
    - "Pagamenti a 30 giorni — non a 90 come la concorrenza"
  - Sezione metriche numeriche (nuovo blocco): "150+ testate gestite · 7 regioni · 4 capoluoghi · 60+ comuni" come banner sopra il footer

**Su `/editori`**:
- Sezione "Cosa otterrai dal cambio piattaforma" (nuova): tabella confronto prima/dopo
  - Commissione: "42% → 22%"
  - Pagamento: "60-90 giorni → 30 giorni"
  - Trasparenza: "Opaca → Esplicita in dashboard"
  - Health monitoring: "Solo segnalazione → Azione in 1 click"
  - Categorizzazione: "4 macro-categorie → IAB 2.2 completa (700+ categorie)"

**Su `/inserzionisti`**:
- Sezione pacchetti regionali (nuova): card per ognuno
  - "Lombardia Premium Local" — 15 testate, audience qualificato, CPM €8-12
  - "Italia Centrale Network" — 30 testate, 4 capoluoghi (Roma/Firenze/Torino/Venezia), copertura 7 regioni, CPM €6-15
  - "Toscana Brand Safe" — 9 testate, target medio-alto, CPM €7-10
- CTA "Richiedi proposta su misura" → form contatti pre-compilato

**Su `/chi-siamo`**:
- TODO ancora aperto: Paolo deve fornire testo finale con eventuali nomi gruppo + team
- Lasciare placeholder con `// TODO Paolo: testo finale`

### M7 — Pagine legali

Crea 2 pagine nuove:

**`/privacy`** — Privacy policy GDPR-compliant per sito marketing italiano
- Titolare trattamento: Advlink Srl (placeholder + // TODO Paolo)
- Dati raccolti: form contatti (nome, email, testata, messaggio)
- Base giuridica: consenso esplicito
- Conservazione: 24 mesi
- Diritti utente: accesso, rettifica, cancellazione, portabilità
- Contatti DPO: privacy@advlink.it (// TODO)

**`/cookie`** — Cookie policy
- Cookie tecnici: solo session/preferenze (no consenso necessario)
- Cookie analitici: solo se attivati (placeholder per quando aggiungeremo Plausible/Umami)
- Cookie terze parti: nessuno in fase 1
- Niente Google Analytics, niente Hotjar, niente FB pixel

Aggiornare Footer per linkare le 2 pagine nuove (rimuovere `href="#"`).

### M8 — Asset visivi base

**OG image** `public/og.png` (1200×630):
- Sfondo bianco
- Logo Advlink wordmark + pallino brand-800
- Tagline "Da editori, per editori"
- Sottotitolo "Tecnologia pubblicitaria per editori italiani"

Generabile con qualunque tool (Canva, Figma) o con script Node + sharp/canvas.
Per ora se serve: generare con Claude Code via SVG → PNG export, o usare placeholder colorato uniforme con testo.

**Favicon `public/favicon.ico`**: generare 32x32, 16x16 con pallino brand-800 su sfondo bianco.

### M9 — SEO improvements

- `metadata` di ogni pagina: aggiungere `openGraph` + `twitter` cards completi
- `sitemap.ts`: aggiungere le 2 nuove pagine legali (lastModified dinamica)
- `robots.ts`: confermare `Allow: /`, `Sitemap: https://advlink.it/sitemap.xml`
- Aggiungere structured data JSON-LD sulla home (Organization schema):
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Advlink",
    "description": "Piattaforma pubblicitaria per editori italiani",
    "url": "https://advlink.it",
    "logo": "https://advlink.it/logo.png"
  }
  ```

### M10 — Security headers

Aggiungere a `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.resend.com;"
```

### M11 — Test E2E iterazione 2

Lancia `@tester-qa` per:
- 15 test esistenti (regression)
- 5 nuovi test:
  - Pagina /privacy renderizza
  - Pagina /cookie renderizza
  - Sitemap include /privacy e /cookie
  - OG image accessibile a /og.png con dimensioni corrette
  - Headers di sicurezza presenti su HTTP response

Dopo M11: pusha + dammi link Netlify aggiornato.

---

## 2. Bridge architetturale a Fase 2 — Preparazione del repo (NON sviluppo)

**Obiettivo**: predisporre il repo `advlink` per ospitare la dashboard publisher (fase 2) senza ancora costruirla. Strutturalmente il monorepo deve essere pronto.

### M12 — Predisporre struttura monorepo

Riorganizzare `src/app/` con segregazione delle aree:

```
src/app/
├── (marketing)/          # gruppo route pubbliche, nessuna auth
│   ├── page.tsx          # / (home)
│   ├── editori/page.tsx
│   ├── inserzionisti/page.tsx
│   ├── chi-siamo/page.tsx
│   ├── contatti/page.tsx
│   ├── privacy/page.tsx
│   └── cookie/page.tsx
├── (dashboard)/          # gruppo route protette, auth required (FASE 2)
│   ├── layout.tsx        # placeholder che ridireziona a /login se non auth
│   ├── dashboard/page.tsx # placeholder "Dashboard in arrivo"
│   └── login/page.tsx    # placeholder
├── api/
│   ├── contact/route.ts  # esistente
│   ├── ingest/route.ts   # placeholder per tag JS publisher (FASE 2)
│   └── health/route.ts   # health check endpoint nuovo
└── layout.tsx            # root layout
```

**Importante**: i route group `(marketing)` e `(dashboard)` non aggiungono al path. La home resta `/`, la dashboard sarà `/dashboard`.

### M13 — Aggiungere endpoint health check

Crea `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'advlink',
    version: process.env.npm_package_version ?? 'unknown',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
```

Utile per monitoring esterno (UptimeRobot/BetterStack) e per il `tester-qa` su prod.

### M14 — Placeholder pagina dashboard

Crea `src/app/(dashboard)/dashboard/page.tsx`:

```tsx
export const metadata = {
  title: 'Dashboard — Advlink',
  description: 'Area riservata editori Advlink',
};

export default function DashboardPlaceholder() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-medium text-slate-900 mb-4">
        Dashboard in arrivo
      </h1>
      <p className="text-slate-600 mb-8">
        L'area riservata editori sarà disponibile a breve.
        Ti contatteremo per l'onboarding.
      </p>
      <a
        href="/contatti"
        className="inline-block bg-brand-800 hover:bg-brand-900 text-white px-6 py-3 rounded-md font-medium"
      >
        Parlaci della tua testata
      </a>
    </main>
  );
}
```

E `src/app/(dashboard)/layout.tsx`:

```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO Fase 2: aggiungere auth check con Supabase
  // Per ora layout passa-attraverso
  return <>{children}</>;
}
```

### M15 — Predisporre integrazione Supabase (preparazione, non implementazione)

- Aggiungere `@supabase/supabase-js` come devDependency (non runtime ancora)
- Creare `src/lib/supabase.ts` placeholder:

```typescript
// TODO Fase 2: configurare client Supabase
// import { createClient } from '@supabase/supabase-js';
//
// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

export const supabasePlaceholder = null;
```

- Aggiungere a `.env.example`:
  ```
  # Supabase (Fase 2)
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ```

### M16 — Documentazione architettura nel repo

Aggiornare `CLAUDE.md` per riflettere il nuovo stato:
- Fase 1 completata
- Sprint M6-M11 completato (sito iterato)
- Bridge M12-M15 completato (monorepo predisposto)
- Fase 2 da partire dopo segnale Paolo + setup Supabase project + accesso GAM Service Account

Creare nuovo file `ARCHITECTURE.md` nel repo con:
- Schema route groups (`(marketing)` vs `(dashboard)`)
- Schema Supabase atteso (vedi `02-audit-cliente-ops-idea.md` sezione 5.2)
- Pipeline ingest dati prevista
- Tag JS publisher da costruire in fase 2

---

## 3. Fase 2 — Solo preview, NON sviluppare ancora

Questa sezione è informativa per l'agente, **non da eseguire** finché Paolo non dà il via libera con dati di onboarding (Network Code GAM, Service Account GAM, scelta testata pilota).

### Sequenza fase 2 attesa (6-7 settimane)

**S1 Foundation**:
- Crea Supabase project (region eu-central-1)
- Schema DB (vedi `01-analisi-piattaforma-flux.md` sez. 5.2)
- RLS policies multi-tenant per `publisher_id`
- Auth Supabase magic link + OAuth Google
- Layout dashboard con sidebar (Panoramica, Realtime, Report, Stato, Inviti, Profilo)

**S2 Connessione GAM**:
- Edge Function `gam-pull-daily` cron 04:00 → pull aggregati per site × ssp
- Edge Function `gam-pull-pageviews` cron 04:30
- Service Account GAM autenticato via env var
- Prima testata pilota onboarded (la più piccola)

**S3 Pagina Panoramica + Pagina Report Siti**
- KPI hero con commissione esplicita
- Bar chart top SSP, donut fonti, tabella granulare per testata
- Export Excel/CSV
- Filtri data + brand_family + geo

**S4 Pagina Realtime**
- Tag JS `cdn.advlink.it/s/{slug}/adv.js` deployato su pilota
- Edge Function `/api/ingest` con partitioning oraria
- Supabase Realtime subscription
- 6 KPI hero + bar chart + tabella top pages con € per articolo
- Anomaly badge + confronto vs ieri

**S5 Pagina Stato Siti**
- Health check endpoint → ping ogni 5min via Supabase scheduled
- Stato ads.txt + bottone "Genera ads.txt" funzionante
- Stato tag/SSP/GAM con semaforo

**S6 Pagina Inviti a Fatturare + Reach+ pipeline**
- Tabella inviti con breakdown per testata
- Storico pagamenti + status
- Forecast mese in corso
- Upload fattura PDF + trigger pagamento
- Promessa "30 giorni" come label

**S7 Cutover sequenziale OPS Idea**
- Coordinazione con Paolo + Giovanni Sciscione per ordine cutover
- Validazione 7gg per testata prima di switchare la successiva
- Rollback procedure documentata

---

## 4. Quick win pre-cutover (parallelo allo sviluppo Fase 2)

Da implementare come **standalone Edge Functions** anche prima di avere l'intera dashboard, così Paolo ha materiale da mostrare a Giovanni Sciscione subito:

### Q1 — ads.txt generator
Tool semplice (anche solo CLI o pagina interna admin Advlink):
- Input: dominio sito + lista SSP attivi (configurabile)
- Output: file `ads.txt` formattato secondo specifiche IAB
- Format:
  ```
  google.com, pub-XXXXXX, DIRECT, f08c47fec0942fa0
  rubiconproject.com, YYYYY, RESELLER, 0bfd66d529a55807
  ...
  ```
- Esegui per le ~30 testate problematiche di OPS Idea
- Genera 30 file pronti da consegnare a Sciscione

### Q2 — Audit Seedtag report
Documento PDF generato con dati Flux + benchmark:
- Performance Seedtag attuale (CPM 0,09€, 25M impression, €2.391 revenue)
- Benchmark mercato (CPM 1,50-2,50€)
- Stima recovery (€16k/mese aggiuntivi)
- Raccomandazioni tecniche (floor price, viewability check, contatto Seedtag account manager)

Genera con Claude Code via skill `pdf` (se disponibile) o template Markdown convertito.

### Q3 — Performance audit completo
Documento di sintesi per Sciscione:
- Recovery quantificato per intervento (Sezione 5 di `02-audit-cliente-ops-idea.md`)
- Confronto Dorvan vs Advlink
- Roadmap 8 settimane cutover
- Pricing Advlink (commissione 22%)

Output desiderato: 1 PDF di 4-5 pagine, brand Advlink, presentabile in meeting.

---

## 5. Setup Netlify (responsabilità Paolo, non Claude Code)

Paolo deve completare:

1. **Account Netlify** → Add new site → Import from GitHub → `Paolocesareo/advlink`
2. **Build settings**: già in `netlify.toml`, lasciare default
3. **Site name**: `advlink` (fallback `advlink-com`)
4. **Env vars** da settare in Netlify UI:
   ```
   RESEND_API_KEY=re_xxx (dopo signup Resend)
   CONTACT_EMAIL_TO=info@advlink.it
   CONTACT_EMAIL_FROM=noreply@advlink.it
   ```
5. **Custom domain**: collegare `advlink.it` (Paolo ha il dominio)
6. **HTTPS**: lasciare auto (Let's Encrypt)
7. **Resend**: account, verifica dominio `advlink.it`, ottieni API key

Quando Paolo dà l'URL Netlify pubblico, `@tester-qa` ripete i 15 test contro la prod + i 5 nuovi.

---

## 6. Ordine d'esecuzione consigliato per Claude Code

```
1. M6 (copy aggiornato)        ← @advlink-dev
2. M7 (pagine legali)          ← @advlink-dev
3. M8 (asset visivi)           ← @advlink-dev
4. M9 (SEO)                    ← @advlink-dev
5. M10 (security headers)      ← @advlink-dev
6. M11 (test regression)       ← @tester-qa
   ↓ pusha + segnala Paolo
7. M12 (route groups)          ← @advlink-dev
8. M13 (health endpoint)       ← @advlink-dev
9. M14 (dashboard placeholder) ← @advlink-dev
10. M15 (Supabase preparation) ← @advlink-dev
11. M16 (documentazione)       ← @advlink-dev
12. Q1 (ads.txt generator)     ← @advlink-dev (standalone tool)
   ↓ pusha + segnala Paolo per consegna pre-vendita
```

**STOP qui finché Paolo non dà via libera per fase 2 con dati GAM**.

---

## 7. Cosa serve da Paolo per partire con Fase 2 (input bloccanti)

Quando Paolo è pronto a sviluppare la dashboard, deve fornire:

1. **GAM Network Code** del cliente OPS Idea (numero ID)
2. **GAM Service Account JSON** (credentials API per pull dati)
3. **Supabase project credentials**:
   - Project URL
   - Anon key
   - Service role key
4. **Lista testate per pilota** (la più piccola da onboarding zero)
5. **Conferma palette finale** (rimane rosso editoriale, ok confermato)
6. **Conferma commission rate Advlink** definitiva (proposta: 22%)

Tutto il resto (dominio, logo, copy, pacchetti commerciali) può essere iterato durante lo sviluppo senza bloccare.

---

## 8. Riferimenti

- Workspace progetto: https://github.com/Paolocesareo/Paolo/blob/master/advlink.md
- Spec piattaforma da costruire: `01-analisi-piattaforma-flux.md`
- Audit cliente con dati: `02-audit-cliente-ops-idea.md`
- Repo sito: https://github.com/Paolocesareo/advlink
- Brief agente dev: https://github.com/Paolocesareo/advlink/blob/main/CLAUDE.md
