# Analisi piattaforma Flux (Dorvan) — Spec per Advlink Platform

**Versione**: 1.0
**Data**: 23 aprile 2026
**Owner**: Paolo (strategy) · Claude Code via @advlink-dev (build)
**Scopo**: spec operativa per replicare le funzionalità di Flux/Dorvan in Advlink, con miglioramenti distintivi.

---

## 1. Mappa funzionale Flux (sidebar)

Sei voci principali, ognuna analizzata con uso reale dell'editore.

### 1.1 Panoramica
La home dashboard. KPI principali del mese corrente:
- Revenue lorde / Ricavi Editore (con %)
- DN / Revenue Share (cifre)
- Bar chart "Ricavi per piattaforma" (top 6 SSP)
- Donut "Fonti di ricavo" (Open Market / Deal / Vendita diretta)
- Card "Metriche di rendimento" — RPM lordo/editore, eCPM lordo/CPM editore, donut breakdown per testata
- Card "Consigli di rendimento" — sito top performer / sito worst performer (statico)
- Tabella in fondo "Pagine viste pagabili" + "PV pagabili divise per sito"

### 1.2 EditorView → Analytics
Vista audience storica per sito.
- Filtri: data range, sito, editore, categoria, dispositivo
- 2 KPI hero: Browser unici, Pagine viste pagabili
- 2 line chart trend giornaliero
- Tabella "Pagine più viste mese corrente" con browser/PV pagabili/tempo medio

### 1.3 EditorView → Realtime
Vista live, pagina più curata di tutto il prodotto.
- Filtri: sito, editore, categoria
- Hero strip verde con 6 KPI: Browser 5min/30min, Ricavi stimati 30min/oggi, Pagine 5min/30min, Average RPM
- 2 bar chart 30 minuti granularità 1 minuto (utenti unici e pageview)
- Tabella "Top pages negli ultimi 5 minuti": sito + URL + browser + PV pagabili

### 1.4 Finanza → Inviti a fatturare
Una sola sotto-voce. Tabella minimale:
- Editore · Periodo · Email contatto · Ammontare · Data generazione · Azioni (Scaricare/Ri-manda)
- Modello self-billing: Dorvan genera l'invito a fatturare → editore emette fattura → Dorvan paga
- Ciclo finanziario reale: ~60-90 giorni dal mese di competenza

### 1.5 Report (6 sotto-voci)
- **Siti** — tabella granulare ricavi per testata. Colonne: Sito · Ricavi lordi · DN · Fee Ad Server · Fee tecnica · Ricavi netti · Revenue Share · Costo editoriale · Ricavi Editore · Pageview · RPM lordo · RPM editore · Impression. Paginata 25/pagina.
- **Siti gestiti** — partnership editoriali. **Vuoto sul cliente Netweek** (funzionalità zombie per la maggioranza dei publisher).
- **Piattaforme** — ricavi per SSP/network. Stesse colonne, granularità SSP. ~28 SSP attivi sul cliente.
- **Editori** — vista aggregata per gruppo editore (1 sola riga per Netweek).
- **Fonti di ricavo** — segmentazione Open Market / Deal / Vendita diretta. Sul cliente Netweek: 96% Open Market, 3,3% Deal, 0,7% Vendita diretta.
- **Pagine viste per sito** — top sites per PV + donut categorie contenuto + tabella dettaglio.

### 1.6 Stato → Integrazione siti
Lista completa testate del cliente con stato tecnico:
- Dominio · Stato ads.txt (complete/incomplete/absent) · Stato sito (n/a) · Flux Config (n/a) · Documento di setup (vuoto)
- 6 pagine di paginazione per il cliente Netweek = 134 testate totali integrate
- Solo 1 colonna su 4 effettivamente popolata
- Bottone "Download Missing" disponibile **solo per stato incomplete**, non per absent (bug di prodotto)

### 1.7 Aiuto / Filtri / Avatar utente
- Aiuto: vuoto
- Filtri (sidebar): solo placeholder UI per spostare il pannello filtri quando viene chiuso
- Avatar utente: solo selettore lingua, niente settings/integrazioni/profilo

**Conclusione architetturale**: 80% del valore percepito sta in 3 sezioni → Panoramica + Realtime + Report Siti. Le altre 9 sotto-voci sono complemento o feature non usate.

---

## 2. Filtri globali Flux

Filtri presenti in quasi tutte le viste:
- Data range (default mese corrente)
- Sito (dropdown multi-select tra le 134 testate)
- Editore (dropdown — un editore può avere molti siti)
- Piattaforma (dropdown SSP)
- Fonti di ricavo (Open Market / Deal / Vendita diretta)
- Categoria (solo in Analytics e Realtime — IAB)
- Dispositivo (solo in Analytics)
- Toggle "Mostra solo siti attivi"

Bottone "Filtra" verde + "X" per reset. Pannello filtri spostabile.

---

## 3. Modello dati di base inferito da Flux

### 3.1 Entità principali

```
publisher (1) ─── has many ─── site (N)
site (1) ─── has many ─── page_url (N)
page_url (1) ─── classified as ─── category (1, IAB taxonomy)

site (N) ─── has revenue from ─── ssp (N) (many-to-many via revenue_record)
revenue_record: site_id, ssp_id, date, gross_revenue, dn, fee_tech, fee_adserver, net_revenue, rev_share_dorvan, publisher_revenue, impressions, ecpm

pageview_record: site_id, date, browser_unique, pageview_total, pageview_payable, time_on_page_avg
realtime_event: site_id, page_url, timestamp, event_type (pageview, impression), revenue_estimate

billing_invoice: publisher_id, period_month, amount, generated_at, contact_email, status, invoice_pdf_url

site_status: site_id, ads_txt_status (complete/incomplete/absent), site_health (n/a), flux_config (n/a)
```

### 3.2 Granularità temporale

- Realtime: granularità 1 minuto, finestra 30 minuti
- Daily aggregates: per dashboard storiche
- Monthly aggregates: per fatturazione

---

## 4. Stack tecnico Flux/Dorvan inferito

### 4.1 Front-end
- Framework probabile: Vue.js o React SPA classica
- Charting: Chart.js o ECharts (donut + bar + line)
- Sidebar collassabile, filtri sticky

### 4.2 Back-end inferito
- Integrazione Google Ad Manager API (per pull dati storici)
- Integrazione Prebid.js wrapper proprietario (script `s.fluxtech.ai/s/{publisher}/flux.js` o `ads.js`)
- Database OLAP per aggregazioni revenue (Postgres + materialized views o similari)
- Pipeline batch giornaliera per computazione ricavi netti, fee, rev-share

### 4.3 Stack SSP attivi sul cliente Netweek (28 piattaforme)
**Display Google**: Adex Display (#1, 25% revenue), Google OB Display, Direct Sales Display, PMP Display
**Native**: MGID (#2), Adkaora (#3, italiano premium)
**Video**: Adex Video, Teads, Showheroes, GAM Child Video, CRZ Video, GM Video, PMP Video
**SSP grandi**: Magnite, Index Exchange, Xandr, Equativ, Adform, TheTradeDesk, Criteo, Onetag
**Contestuali**: Seedtag, Apex, Richaudience, Missena
**Mobile/altri**: Ogury, Clever

---

## 5. Spec Advlink Platform — funzionalità da costruire

### 5.1 Architettura generale

**Stack scelto**:
- Frontend: Next.js 14 App Router + TypeScript + Tailwind (stesso del sito vetrina, monorepo unico)
- Backend: Supabase (Postgres + Edge Functions Deno + Auth + RLS)
- Realtime: Supabase Realtime via WebSocket
- Charting: Recharts (React-native, no dipendenze pesanti)
- Deploy: Netlify (auto da push)
- Header bidding: Prebid.js wrapper proprietario
- Tag publisher: servito da `cdn.advlink.it/s/{publisher_slug}/adv.js`

### 5.2 Schema Supabase (concreto)

```sql
-- Multi-tenant, isolamento via RLS
publishers (
  id uuid pk, slug text unique, name text,
  legal_name text, vat text,
  contact_admin_email text, iban text,
  commission_rate numeric, -- esplicito (es. 0.22)
  payment_terms_days int default 30,
  created_at timestamptz
);

sites (
  id uuid pk, publisher_id uuid fk,
  domain text unique, name text,
  geo_region text, geo_province text,
  brand_family text, -- prima* / giornaledi* / settegiorni* / singolo
  is_active boolean,
  ads_txt_status text, -- complete/incomplete/absent
  site_health text, last_health_check timestamptz,
  prebid_config jsonb, gam_unit_path text
);

ssps (
  id uuid pk, name text, type text, -- display/video/native/contextual
  active_globally boolean
);

site_ssp_config (
  site_id uuid fk, ssp_id uuid fk,
  enabled boolean, floor_price numeric,
  bid_rate_avg numeric, ecpm_avg numeric
);

revenue_daily (
  date date, site_id uuid fk, ssp_id uuid fk,
  source_type text, -- open_market / deal / direct
  impressions bigint, gross_revenue numeric,
  fee_tech numeric, fee_adserver numeric,
  net_revenue numeric, advlink_share numeric,
  publisher_revenue numeric, ecpm numeric,
  primary key (date, site_id, ssp_id, source_type)
);

pageviews_daily (
  date date, site_id uuid fk,
  browser_unique int, pageview_total bigint,
  pageview_payable bigint, time_on_page_avg int,
  primary key (date, site_id)
);

pages (
  url text pk, site_id uuid fk,
  iab_category text, iab_subcategory text,
  classified_at timestamptz, classification_source text -- ai/manual
);

realtime_events ( -- TTL 24h, partitioned hourly
  ts timestamptz, site_id uuid, page_url text,
  event_type text, -- pv/impression
  estimated_revenue numeric
);

billing_invitations (
  id uuid pk, publisher_id uuid fk,
  period_month date, gross_amount numeric,
  advlink_commission numeric, publisher_amount numeric,
  contact_email text, generated_at timestamptz,
  invoice_status text, -- pending_invoice / invoiced / paid
  invoice_received_at timestamptz, invoice_pdf_url text,
  paid_at timestamptz, payment_due_date date
);

recommendations ( -- alert + insight automatici
  id uuid pk, publisher_id uuid, site_id uuid nullable,
  type text, -- ads_txt_missing / seedtag_low_cpm / anomaly_traffic / etc
  severity text, -- info/warning/critical
  message text, action_label text, action_url text,
  estimated_impact_eur numeric,
  created_at timestamptz, dismissed_at timestamptz
);
```

### 5.3 Architettura ingest dati

**Pipeline batch giornaliera** (Edge Function cron 04:00):
1. Pull GAM API → aggregati giornalieri per site × ssp → `revenue_daily`
2. Pull GAM API → traffic data → `pageviews_daily`
3. Computo `advlink_share` e `publisher_revenue` con commission_rate del publisher
4. Genera `recommendations` automatiche (regole: ads.txt missing, CPM SSP <50% media, anomaly traffic ±X%)

**Pipeline realtime** (tag JS `cdn.advlink.it/s/{slug}/adv.js`):
1. Tag su pagine editore → POST `/api/ingest` con `{site_id, page_url, event_type, ts}`
2. Edge Function ingest → insert in `realtime_events` (partition oraria)
3. Supabase Realtime broadcast → dashboard editore via WebSocket
4. Aggregazione 5min/30min via materialized view refreshed ogni minuto

**Pipeline categorizzazione**:
1. Quando arriva un nuovo URL → coda async
2. Edge Function fetch HTML → estrai title + first 500 char + meta
3. Chiamata Claude Sonnet via API → ritorna IAB category
4. Insert in `pages` table

---

## 6. Roadmap funzionalità (priorità da Pareto Flux)

### MVP Tier 1 (settimane 1-6) — quello che produce 80% del valore

**S1 — Foundation**
- Schema Supabase + RLS isolamento per publisher
- Auth Supabase per login editore
- Layout dashboard (sidebar + header come il sito vetrina, palette brand)
- Connessione GAM API + Service Account, primo pull dati storici test

**S2 — Pagina Panoramica (= Flux Panoramica)**
- KPI mese corrente con trasparenza esplicita: "Commissione Advlink: 22% — Tu trattieni 78%"
- Bar chart ricavi per piattaforma (top 6)
- Donut fonti di ricavo
- Card metriche rendimento per testata
- Card "Azioni consigliate" — non statiche, derivanti da `recommendations` con bottoni azionabili

**S3 — Pagina Report Siti (= Flux Report > Siti)**
- Tabella granulare ricavi per testata, stesse colonne di Flux + colonna `Δ vs mese precedente`
- Filtri data + brand_family + geo_region
- Export Excel/CSV in 1 click
- Footer totali sticky in scroll

**S4 — Pagina EditorView Realtime (= Flux Realtime, killer feature)**
- 6 KPI hero (5min/30min/oggi)
- 2 bar chart trend 30 minuti
- Tabella top pages 5min con colonna **"€ generati 5min"** (non c'è in Flux)
- Anomaly badge su articoli ±X% media (non c'è in Flux)
- Confronto "vs ieri stesso orario" sotto KPI hero (non c'è in Flux)

**S5 — Pagina Stato Siti (= Flux Stato + miglioramenti)**
- Lista testate con stato ads.txt
- **Bottone "Genera ads.txt"** per stato absent E incomplete (Flux solo incomplete)
- Stato sito con health check ping ogni 5min
- Stato tag Advlink (latenza, errori)
- Stato SSP (bid rate per ognuno)
- Stato GAM (connessione API)
- Documento di setup auto-generato

**S6 — Pagina Inviti a Fatturare (= Flux Finanza, ma vera)**
- Tabella inviti con breakdown per testata della cifra (Flux non lo fa)
- Storico pagamenti con status (Flux non lo fa)
- Forecast invito mese in corso (Flux non lo fa)
- Upload fattura PDF dal cliente (trigger pagamento)
- Promessa "Advlink paga a 30 giorni" come label permanente

### MVP Tier 2 (settimane 7-10) — utile ma non bloccante

- EditorView Analytics storico (vista audience storica)
- Report Pagine viste per sito (con CPM medio per categoria — non in Flux)
- Report Piattaforme (con suggerimenti azione per SSP sotto-performante)
- Report Fonti di ricavo (con pipeline campagne dirette Reach+ in arrivo)

### Tier 3 (saltiamo o post-MVP)

- ❌ Siti gestiti / partnership editoriali (zombie su Flux)
- ❌ Editori standalone (vista ridondante)
- ⏳ Marketplace inserzionisti self-service (fase 4)

---

## 7. Differenziatori chiave Advlink vs Flux (riepilogo)

| Area | Flux Dorvan | Advlink |
|---|---|---|
| Trasparenza commissione | DN + Revenue Share + Fee tecnica oscuri | "Commissione 22% — Tu trattieni 78%" sempre visibile in dashboard |
| Recommendations | "Sito worst" statico | Azioni concrete con stima impatto € e bottone "Risolvi" |
| ads.txt assente | Lo segnalano e basta | Bottone "Genera ads.txt" → produce file pronto |
| Health monitoring | Vuoto (n/a su 3 colonne su 4) | Ping sito + tag + SSP + GAM con semaforo |
| Onboarding nuovo sito | Manuale via email | Wizard self-service |
| Realtime revenue per articolo | Solo browser+PV | Aggiunge € generati e RPM articolo |
| Anomaly detection | Niente | Badge automatici ±X% media |
| Confronto temporale | Niente | "Vs ieri stesso orario" sotto ogni KPI |
| Inviti a fatturare | Solo importo totale | Breakdown per testata + storico pagamenti + forecast |
| Pagamento editore | 60-90 gg (osservato) | 30 gg netti (promessa commerciale) |
| Categorizzazione | 96% local news, 3% uncategorized | 99%+ con tassonomia IAB 2.2 completa |

---

## 8. Tech debt da evitare (osservato su Flux)

- **Una pagina, una funzionalità sviluppata bene** — Flux ha 12 sotto-voci, di cui ~6 sono scaffold non implementato
- **Health monitoring vero, non placeholder** — Flux ha 3 colonne "n/a" che dichiarano una funzione mai costruita
- **Azionabilità sempre** — ogni segnalazione di problema in dashboard deve avere un bottone "fai-X"
- **Ordine tabelle coerente** — Flux ha tabelle ordinate male (es. inviti a fatturare con date out-of-order)
- **Mobile-first** — Flux è desktop-only

---

## 9. Riferimenti

- Workspace progetto: https://github.com/Paolocesareo/Paolo/blob/master/advlink.md
- Repo sito vetrina (fase 1 completata): https://github.com/Paolocesareo/advlink
- Brief Claude Code agente dev: https://github.com/Paolocesareo/advlink/blob/main/CLAUDE.md
