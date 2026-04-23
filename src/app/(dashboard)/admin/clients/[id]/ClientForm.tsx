'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  updatePublisher, deletePublisher,
  addSite, updateSite, deleteSite,
  addSSP, updateSSP, deleteSSP,
  toggleOnboardingStep,
} from '../../actions';

// -------- Types (subset dei campi che editiamo) --------
type Publisher = {
  id: string;
  created_at: string;
  name: string;
  legal_name: string | null;
  slug: string | null;
  vat: string | null;
  fiscal_code: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  billing_email: string | null;
  status: string;
  notes: string | null;
  commission_advlink: number;
  commission_publisher: number;
  payment_terms_days: number;
  payment_method: string | null;
  iban: string | null;
  contract_signed_at: string | null;
  contract_end_at: string | null;
  gam_network_code: string | null;
  gam_network_domain: string | null;
  gam_admin_email: string | null;
  gam_service_account_email: string | null;
  gam_mcm_status: string;
  gam_mcm_parent_code: string | null;
  gam_adx_enabled: boolean;
  gam_open_bidding_enabled: boolean;
  gam_pricing_rules_configured: boolean;
  gam_timezone: string | null;
  gam_currency: string | null;
  gam_integration_mode: string;
  gam_access_granted_at: string | null;
  gam_notes: string | null;
  previous_concessionaire: string | null;
  previous_wrapper_url: string | null;
  previous_dashboard_url: string | null;
  onboarding: Record<string, boolean>;
};

type Site = {
  id: string;
  publisher_id: string;
  domain: string;
  name: string | null;
  pageviews_monthly: number;
  tier: string;
  ads_txt_status: string;
  owner_domain: string | null;
  manager_domain: string | null;
  active: boolean;
  notes: string | null;
};

type SSP = {
  id: string;
  publisher_id: string;
  ssp_domain: string;
  account_id: string;
  relationship: string;
  tag_id: string | null;
  comment: string | null;
  active: boolean;
};

const ONBOARDING_LABELS: Record<string, string> = {
  contract_signed: 'Contratto firmato',
  gam_credentials_received: 'Credenziali GAM ricevute',
  gam_access_verified: 'Accesso GAM verificato',
  adstxt_generated: 'File ads.txt generati',
  adstxt_deployed: 'ads.txt caricati sui domini',
  tag_deployed: 'Tag Advlink installato',
  first_report_received: 'Primo report ricevuto',
  first_payment: 'Primo pagamento processato',
};

export function ClientForm({ publisher: initial, sites: initialSites, ssps: initialSSPs }: {
  publisher: Publisher;
  sites: Site[];
  ssps: SSP[];
}) {
  const router = useRouter();
  const [publisher, setPublisher] = useState<Publisher>(initial);
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [ssps, setSSPs] = useState<SSP[]>(initialSSPs);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateField = <K extends keyof Publisher>(key: K, value: Publisher[K]) => {
    setPublisher(p => ({ ...p, [key]: value }));
  };

  const savePublisher = () => {
    setErrorMsg(null);
    startTransition(async () => {
      const { id, created_at, onboarding, ...patch } = publisher;
      void id; void created_at; void onboarding;
      const res = await updatePublisher(publisher.id, patch);
      if (res?.error) { setErrorMsg(res.error); setSaveStatus('error'); }
      else { setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }
    });
  };

  const handleDelete = () => {
    if (!confirm(`Eliminare definitivamente "${publisher.name}" e tutti i dati collegati (testate, SSP)?`)) return;
    startTransition(async () => {
      await deletePublisher(publisher.id);
    });
  };

  const exportJSON = () => {
    const payload = { publisher, sites, ssps, exported_at: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advlink-client-${publisher.slug || publisher.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sites handlers
  const handleAddSite = () => startTransition(async () => {
    await addSite(publisher.id);
    router.refresh();
  });
  const saveSite = (site: Site) => startTransition(async () => {
    const { id, publisher_id, ...patch } = site;
    void publisher_id;
    await updateSite(id, publisher.id, patch);
    setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000);
  });
  const removeSite = (id: string) => {
    if (!confirm('Rimuovere questa testata?')) return;
    startTransition(async () => {
      await deleteSite(id, publisher.id);
      setSites(s => s.filter(x => x.id !== id));
    });
  };

  // SSPs handlers
  const handleAddSSP = () => startTransition(async () => {
    await addSSP(publisher.id);
    router.refresh();
  });
  const saveSSP = (ssp: SSP) => startTransition(async () => {
    const { id, publisher_id, ...patch } = ssp;
    void publisher_id;
    await updateSSP(id, publisher.id, patch);
    setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000);
  });
  const removeSSP = (id: string) => {
    if (!confirm('Rimuovere questa riga SSP?')) return;
    startTransition(async () => {
      await deleteSSP(id, publisher.id);
      setSSPs(s => s.filter(x => x.id !== id));
    });
  };

  // Onboarding
  const toggleOnb = (key: string) => startTransition(async () => {
    const newVal = !publisher.onboarding[key];
    setPublisher(p => ({ ...p, onboarding: { ...p.onboarding, [key]: newVal } }));
    await toggleOnboardingStep(publisher.id, key, newVal);
  });

  const obKeys = Object.keys(publisher.onboarding || {});
  const obDone = obKeys.filter(k => publisher.onboarding[k]).length;
  const obPct = obKeys.length > 0 ? Math.round((obDone / obKeys.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {publisher.name || <span className="text-slate-400 italic">Nuovo cliente</span>}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            ID {publisher.id.substring(0, 8)} · creato {new Date(publisher.created_at).toLocaleDateString('it-IT')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {saveStatus === 'saved' && <span className="text-xs text-emerald-700">✓ Salvato</span>}
          {saveStatus === 'error' && <span className="text-xs text-red-700">✗ Errore</span>}
          <button onClick={exportJSON} className="text-xs text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50">
            Export JSON
          </button>
          <button onClick={handleDelete} disabled={isPending} className="text-xs text-red-700 border border-red-200 px-3 py-1.5 rounded-md bg-white hover:bg-red-50">
            Elimina
          </button>
          <button onClick={savePublisher} disabled={isPending} className="bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white px-4 py-1.5 rounded-md font-medium text-sm">
            {isPending ? 'Salvando…' : 'Salva modifiche'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{errorMsg}</div>
      )}

      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-5 py-3">
        <span className="text-xs text-slate-500 uppercase tracking-wide">Onboarding</span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-800 transition-all" style={{ width: `${obPct}%` }} />
        </div>
        <span className="text-sm font-medium text-slate-700">{obPct}%</span>
      </div>

      {/* Anagrafica */}
      <Section title="Anagrafica">
        <Grid>
          <Field label="Nome commerciale *" value={publisher.name} onChange={v => updateField('name', v)} placeholder="OPS Media" />
          <Field label="Ragione sociale" value={publisher.legal_name} onChange={v => updateField('legal_name', v)} placeholder="OPS Media Srl" />
          <Field label="Slug URL-safe" value={publisher.slug} onChange={v => updateField('slug', v)} placeholder="ops-media" mono />
          <Field label="P. IVA" value={publisher.vat} onChange={v => updateField('vat', v)} placeholder="IT12345678901" mono />
          <Field label="Codice fiscale" value={publisher.fiscal_code} onChange={v => updateField('fiscal_code', v)} mono />
          <Field label="Indirizzo" value={publisher.address} onChange={v => updateField('address', v)} placeholder="Via Roma 1" />
          <Field label="Città" value={publisher.city} onChange={v => updateField('city', v)} />
          <Field label="CAP" value={publisher.postal_code} onChange={v => updateField('postal_code', v)} mono />
          <Field label="Paese" value={publisher.country} onChange={v => updateField('country', v)} placeholder="IT" mono />
          <Select label="Stato cliente" value={publisher.status} onChange={v => updateField('status', v)} options={[
            ['pending', 'Pending onboarding'],
            ['active', 'Attivo'],
            ['offboarded', 'Offboarded'],
            ['suspended', 'Sospeso']
          ]} />
        </Grid>
      </Section>

      {/* Contatti */}
      <Section title="Contatti">
        <Grid>
          <Field label="Referente tecnico" value={publisher.contact_name} onChange={v => updateField('contact_name', v)} />
          <Field label="Email referente" value={publisher.contact_email} onChange={v => updateField('contact_email', v)} type="email" />
          <Field label="Telefono" value={publisher.contact_phone} onChange={v => updateField('contact_phone', v)} />
          <Field label="Email fatturazione" value={publisher.billing_email} onChange={v => updateField('billing_email', v)} type="email" />
        </Grid>
      </Section>

      {/* Commerciale */}
      <Section title="Configurazione commerciale">
        <Grid>
          <Field label="Commissione Advlink (%)" value={publisher.commission_advlink} onChange={v => updateField('commission_advlink', parseFloat(v) || 0)} type="number" />
          <Field label="Quota editore (%)" value={publisher.commission_publisher} onChange={v => updateField('commission_publisher', parseFloat(v) || 0)} type="number" />
          <Field label="Termini pagamento (gg)" value={publisher.payment_terms_days} onChange={v => updateField('payment_terms_days', parseInt(v) || 0)} type="number" />
          <Field label="Modalità pagamento" value={publisher.payment_method} onChange={v => updateField('payment_method', v)} placeholder="bonifico" />
          <Field label="IBAN" value={publisher.iban} onChange={v => updateField('iban', v)} mono />
          <Field label="Data firma contratto" value={publisher.contract_signed_at} onChange={v => updateField('contract_signed_at', v || null)} type="date" />
          <Field label="Fine contratto" value={publisher.contract_end_at} onChange={v => updateField('contract_end_at', v || null)} type="date" />
        </Grid>
        {((publisher.commission_advlink || 0) + (publisher.commission_publisher || 0)) > 100 && (
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded">
            ⚠ La somma delle due percentuali supera 100%.
          </p>
        )}
      </Section>

      {/* GAM */}
      <Section title="Google Ad Manager">
        <Grid>
          <Field label="GAM Network Code" value={publisher.gam_network_code} onChange={v => updateField('gam_network_code', v)} placeholder="es. 123456789" mono />
          <Field label="Network domain" value={publisher.gam_network_domain} onChange={v => updateField('gam_network_domain', v)} placeholder="opsmedia.it" mono />
          <Field label="Admin email GAM" value={publisher.gam_admin_email} onChange={v => updateField('gam_admin_email', v)} type="email" />
          <Field label="Service account email" value={publisher.gam_service_account_email} onChange={v => updateField('gam_service_account_email', v)} type="email" mono />
          <Select label="Tipo accesso GAM (MCM)" value={publisher.gam_mcm_status} onChange={v => updateField('gam_mcm_status', v)} options={[
            ['not_configured', 'Non configurato'],
            ['own_network', 'Network proprietario'],
            ['mcm_parent', 'MCM Parent (delega ad altri)'],
            ['mcm_child_manage_inventory', 'MCM Child — Manage Inventory'],
            ['mcm_child_manage_account', 'MCM Child — Manage Account'],
            ['unknown', 'Da verificare']
          ]} />
          <Field label="MCM parent code (se child)" value={publisher.gam_mcm_parent_code} onChange={v => updateField('gam_mcm_parent_code', v)} mono />
          <Field label="Timezone GAM" value={publisher.gam_timezone} onChange={v => updateField('gam_timezone', v)} placeholder="Europe/Rome" mono />
          <Field label="Valuta GAM" value={publisher.gam_currency} onChange={v => updateField('gam_currency', v)} placeholder="EUR" mono />
          <Select label="Modalità di integrazione" value={publisher.gam_integration_mode} onChange={v => updateField('gam_integration_mode', v)} options={[
            ['none', 'Nessuna ancora'],
            ['manual_report', 'Report manuale'],
            ['api_service_account', 'GAM API Service Account'],
            ['adx_query_tool', 'Ad Exchange Query Tool']
          ]} />
          <Field label="Accesso concesso il" value={publisher.gam_access_granted_at} onChange={v => updateField('gam_access_granted_at', v || null)} type="date" />
        </Grid>
        <div className="mt-4 flex gap-4 flex-wrap">
          <Check label="AdX attivo" checked={publisher.gam_adx_enabled} onChange={v => updateField('gam_adx_enabled', v)} />
          <Check label="Open Bidding attivo" checked={publisher.gam_open_bidding_enabled} onChange={v => updateField('gam_open_bidding_enabled', v)} />
          <Check label="Pricing Rules configurate" checked={publisher.gam_pricing_rules_configured} onChange={v => updateField('gam_pricing_rules_configured', v)} />
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">Note GAM</label>
          <textarea
            value={publisher.gam_notes || ''}
            onChange={e => updateField('gam_notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
            placeholder="Es. da verificare se è MCM child di Dorvan, chiedere export Pricing Rules..."
          />
        </div>
      </Section>

      {/* Concessionario precedente */}
      <Section title="Concessionario precedente (transizione)">
        <Grid>
          <Field label="Nome concessionario" value={publisher.previous_concessionaire} onChange={v => updateField('previous_concessionaire', v)} placeholder="Dorvan" />
          <Field label="URL wrapper attuale" value={publisher.previous_wrapper_url} onChange={v => updateField('previous_wrapper_url', v)} placeholder="https://s.fluxtech.ai/..." mono />
          <Field label="URL dashboard concessionario" value={publisher.previous_dashboard_url} onChange={v => updateField('previous_dashboard_url', v)} placeholder="https://flux.dorvan.it" mono />
        </Grid>
      </Section>

      {/* Testate */}
      <Section title={`Testate (${sites.length})`} action={
        <button onClick={handleAddSite} disabled={isPending} className="text-xs text-brand-800 hover:text-brand-900 font-medium">+ Aggiungi testata</button>
      }>
        {sites.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Nessuna testata. Aggiungi con il bottone sopra.</p>
        ) : (
          <div className="space-y-3">
            {sites.map(site => (
              <SiteRow key={site.id} site={site} onSave={saveSite} onRemove={removeSite} disabled={isPending} />
            ))}
          </div>
        )}
      </Section>

      {/* SSPs */}
      <Section title={`SSP attivi (${ssps.length})`} action={
        <button onClick={handleAddSSP} disabled={isPending} className="text-xs text-brand-800 hover:text-brand-900 font-medium">+ Aggiungi SSP</button>
      }>
        <p className="text-xs text-slate-500 mb-3">
          Input per il tool <span className="font-mono">scripts/ads-txt/generate.js</span>: domain + account_id + relationship.
        </p>
        {ssps.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Nessun SSP. Aggiungi con il bottone sopra.</p>
        ) : (
          <div className="space-y-2">
            {ssps.map(ssp => (
              <SSPRow key={ssp.id} ssp={ssp} onSave={saveSSP} onRemove={removeSSP} disabled={isPending} />
            ))}
          </div>
        )}
      </Section>

      {/* Onboarding */}
      <Section title="Checklist onboarding">
        <div className="grid md:grid-cols-2 gap-2">
          {obKeys.map(key => (
            <button
              key={key}
              onClick={() => toggleOnb(key)}
              disabled={isPending}
              className={`flex items-center gap-3 p-3 rounded-md border text-left text-sm transition-colors ${
                publisher.onboarding[key]
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${publisher.onboarding[key] ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`}>
                {publisher.onboarding[key] && <span className="text-white text-[10px] flex items-center justify-center h-full leading-none">✓</span>}
              </div>
              {ONBOARDING_LABELS[key] || key}
            </button>
          ))}
        </div>
      </Section>

      {/* Note */}
      <Section title="Note operative">
        <textarea
          value={publisher.notes || ''}
          onChange={e => updateField('notes', e.target.value)}
          rows={5}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
          placeholder="Appunti, context switch, promemoria per il team…"
        />
      </Section>
    </div>
  );
}

// ---------- Site row (edit inline) ----------
function SiteRow({ site: initial, onSave, onRemove, disabled }: {
  site: Site; onSave: (s: Site) => void; onRemove: (id: string) => void; disabled: boolean;
}) {
  const [site, setSite] = useState(initial);
  const set = <K extends keyof Site>(k: K, v: Site[K]) => setSite(s => ({ ...s, [k]: v }));
  return (
    <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-12 md:col-span-3">
          <MiniField label="Dominio" value={site.domain} onChange={v => set('domain', v.trim().toLowerCase())} mono />
        </div>
        <div className="col-span-12 md:col-span-3">
          <MiniField label="Nome testata" value={site.name} onChange={v => set('name', v)} />
        </div>
        <div className="col-span-6 md:col-span-2">
          <MiniField label="PV/mese" value={site.pageviews_monthly} onChange={v => set('pageviews_monthly', parseInt(v) || 0)} type="number" />
        </div>
        <div className="col-span-6 md:col-span-1">
          <MiniSelect label="Tier" value={site.tier} onChange={v => set('tier', v)} options={[['top','Top'],['tier2','T2'],['tier3','T3']]} />
        </div>
        <div className="col-span-6 md:col-span-2">
          <MiniSelect label="ads.txt" value={site.ads_txt_status} onChange={v => set('ads_txt_status', v)} options={[
            ['absent','Assente'],['incomplete','Incompleto'],['present','Presente'],['verified','Verificato']
          ]} />
        </div>
        <div className="col-span-6 md:col-span-1 flex gap-1 justify-end pb-0.5">
          <button onClick={() => onSave(site)} disabled={disabled} title="Salva riga" className="text-xs px-2 py-1 rounded bg-brand-800 hover:bg-brand-900 text-white disabled:opacity-50">✓</button>
          <button onClick={() => onRemove(site.id)} disabled={disabled} title="Rimuovi" className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-500 hover:text-red-700 hover:border-red-300 bg-white">✕</button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-2">
        <div className="col-span-12 md:col-span-6">
          <MiniField label="OWNERDOMAIN ads.txt" value={site.owner_domain} onChange={v => set('owner_domain', v)} placeholder="opsmedia.it" mono />
        </div>
        <div className="col-span-12 md:col-span-6">
          <MiniField label="MANAGERDOMAIN ads.txt" value={site.manager_domain} onChange={v => set('manager_domain', v)} placeholder="advlink.it" mono />
        </div>
      </div>
    </div>
  );
}

// ---------- SSP row ----------
function SSPRow({ ssp: initial, onSave, onRemove, disabled }: {
  ssp: SSP; onSave: (s: SSP) => void; onRemove: (id: string) => void; disabled: boolean;
}) {
  const [ssp, setSSP] = useState(initial);
  const set = <K extends keyof SSP>(k: K, v: SSP[K]) => setSSP(s => ({ ...s, [k]: v }));
  return (
    <div className="border border-slate-200 rounded-md p-3 bg-slate-50 grid grid-cols-12 gap-3 items-end">
      <div className="col-span-12 md:col-span-3">
        <MiniField label="SSP domain" value={ssp.ssp_domain} onChange={v => set('ssp_domain', v.trim().toLowerCase())} mono />
      </div>
      <div className="col-span-12 md:col-span-3">
        <MiniField label="Account ID" value={ssp.account_id} onChange={v => set('account_id', v)} mono />
      </div>
      <div className="col-span-6 md:col-span-2">
        <MiniSelect label="Relation" value={ssp.relationship} onChange={v => set('relationship', v)} options={[['DIRECT','DIRECT'],['RESELLER','RESELLER']]} />
      </div>
      <div className="col-span-6 md:col-span-3">
        <MiniField label="Tag ID (opz)" value={ssp.tag_id} onChange={v => set('tag_id', v)} mono />
      </div>
      <div className="col-span-12 md:col-span-1 flex gap-1 justify-end pb-0.5">
        <button onClick={() => onSave(ssp)} disabled={disabled} title="Salva riga" className="text-xs px-2 py-1 rounded bg-brand-800 hover:bg-brand-900 text-white disabled:opacity-50">✓</button>
        <button onClick={() => onRemove(ssp.id)} disabled={disabled} title="Rimuovi" className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-500 hover:text-red-700 hover:border-red-300 bg-white">✕</button>
      </div>
    </div>
  );
}

// ---------- UI primitives ----------
function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg">
      <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}
type FieldVal = string | number | null;
function Field({ label, value, onChange, type = 'text', placeholder, mono = false }: {
  label: string; value: FieldVal; onChange: (v: string) => void; type?: string; placeholder?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700 ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}
function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded text-brand-800 focus:ring-brand-700" />
      {label}
    </label>
  );
}
function MiniField({ label, value, onChange, type = 'text', placeholder, mono = false }: {
  label: string; value: FieldVal; onChange: (v: string) => void; type?: string; placeholder?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-slate-500 mb-0.5 uppercase tracking-wide">{label}</label>
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700 ${mono ? 'font-mono' : ''}`} />
    </div>
  );
}
function MiniSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-slate-500 mb-0.5 uppercase tracking-wide">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
