'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  updateNetworkSetup,
  addNetworkSSP,
  updateNetworkSSP,
  deleteNetworkSSP,
} from './actions';

type NetworkSetup = {
  id: number;
  legal_name: string | null;
  vat: string | null;
  fiscal_code: string | null;
  registered_address: string | null;
  billing_email: string | null;
  contact_email: string | null;
  gam_network_code: string | null;
  gam_network_domain: string | null;
  gam_admin_email: string | null;
  gam_service_account_email: string | null;
  gam_timezone: string | null;
  gam_currency: string | null;
  gam_adx_enabled: boolean;
  gam_adx_approved_at: string | null;
  gam_open_bidding_enabled: boolean;
  gam_pricing_rules_configured: boolean;
  gam_setup_status: string;
  gam_setup_applied_at: string | null;
  gam_setup_approved_at: string | null;
  policy_contact_email: string | null;
  dpo_email: string | null;
  privacy_policy_url: string | null;
  notes: string | null;
};

type NetworkSSP = {
  id: string;
  ssp_domain: string;
  ssp_name: string | null;
  account_id: string | null;
  relationship: string;
  tag_id: string | null;
  status: string;
  contract_signed_at: string | null;
  activated_at: string | null;
  commission_rate: number | null;
  notes: string | null;
  active: boolean;
};

const SETUP_STATUS_LABELS: Record<string, string> = {
  not_started: 'Non iniziato',
  applied: 'Richiesta inviata a Google',
  under_review: 'In revisione',
  approved: 'Approvato',
  operational: 'Operativo',
};

const SETUP_STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-slate-100 text-slate-700 border-slate-300',
  applied: 'bg-amber-100 text-amber-900 border-amber-300',
  under_review: 'bg-amber-100 text-amber-900 border-amber-300',
  approved: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  operational: 'bg-emerald-100 text-emerald-900 border-emerald-300',
};

const SSP_STATUS_LABELS: Record<string, string> = {
  prospected: 'Prospected',
  contacted: 'Contattato',
  negotiating: 'In trattativa',
  onboarding: 'Onboarding',
  active: 'Attivo',
  paused: 'Pausa',
};

export function NetworkForm({ setup: initial, ssps: initialSSPs }: {
  setup: NetworkSetup;
  ssps: NetworkSSP[];
}) {
  const router = useRouter();
  const [setup, setSetup] = useState<NetworkSetup>(initial);
  const [ssps, setSSPs] = useState<NetworkSSP[]>(initialSSPs);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateField = <K extends keyof NetworkSetup>(key: K, value: NetworkSetup[K]) => {
    setSetup(s => ({ ...s, [key]: value }));
  };

  const saveSetup = () => {
    setErrorMsg(null);
    startTransition(async () => {
      const { id, ...patch } = setup;
      void id;
      const res = await updateNetworkSetup(patch);
      if (res?.error) { setErrorMsg(res.error); setSaveStatus('error'); }
      else { setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }
    });
  };

  const handleAddSSP = () => startTransition(async () => {
    await addNetworkSSP();
    router.refresh();
  });
  const saveSSP = (ssp: NetworkSSP) => startTransition(async () => {
    const { id, ...patch } = ssp;
    await updateNetworkSSP(id, patch);
    setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000);
  });
  const removeSSP = (id: string) => {
    if (!confirm('Rimuovere questo SSP?')) return;
    startTransition(async () => {
      await deleteNetworkSSP(id);
      setSSPs(s => s.filter(x => x.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Network Advlink</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configurazione del concessionario: anagrafica, GAM Network, SSP partner
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && <span className="text-xs text-emerald-700">✓ Salvato</span>}
          {saveStatus === 'error' && <span className="text-xs text-red-700">✗ Errore</span>}
          <button onClick={saveSetup} disabled={isPending} className="bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white px-4 py-1.5 rounded-md font-medium text-sm">
            {isPending ? 'Salvando…' : 'Salva modifiche'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{errorMsg}</div>
      )}

      {/* Status banner */}
      <div className={`border rounded-lg px-5 py-3 flex items-center gap-3 ${SETUP_STATUS_COLORS[setup.gam_setup_status] || SETUP_STATUS_COLORS.not_started}`}>
        <span className="text-xs uppercase tracking-wide font-semibold">GAM Network Advlink</span>
        <span className="text-sm font-medium">
          {SETUP_STATUS_LABELS[setup.gam_setup_status] || setup.gam_setup_status}
        </span>
        {setup.gam_network_code && (
          <span className="text-xs font-mono ml-auto">Code: {setup.gam_network_code}</span>
        )}
      </div>

      {/* Anagrafica Advlink Srl */}
      <Section title="Anagrafica Advlink Srl (concessionario)">
        <Grid>
          <Field label="Ragione sociale" value={setup.legal_name} onChange={v => updateField('legal_name', v)} placeholder="Advlink Srl" />
          <Field label="P. IVA" value={setup.vat} onChange={v => updateField('vat', v)} mono />
          <Field label="Codice fiscale" value={setup.fiscal_code} onChange={v => updateField('fiscal_code', v)} mono />
          <Field label="Sede legale" value={setup.registered_address} onChange={v => updateField('registered_address', v)} />
          <Field label="Email fatturazione" value={setup.billing_email} onChange={v => updateField('billing_email', v)} type="email" />
          <Field label="Email contatto generale" value={setup.contact_email} onChange={v => updateField('contact_email', v)} type="email" />
        </Grid>
      </Section>

      {/* GAM Network Advlink */}
      <Section title="Google Ad Manager Network (Advlink)">
        <p className="text-xs text-slate-500 mb-4">
          I dati qui sotto riguardano il GAM Network che Advlink apre a proprio nome. Tutti i publisher
          gestiti serviranno inventory dentro questo network (modello concessionario).
        </p>
        <Grid>
          <Select label="Stato setup GAM" value={setup.gam_setup_status} onChange={v => updateField('gam_setup_status', v)} options={[
            ['not_started', 'Non iniziato'],
            ['applied', 'Richiesta inviata a Google'],
            ['under_review', 'In revisione Google'],
            ['approved', 'Approvato'],
            ['operational', 'Operativo']
          ]} />
          <Field label="Network Code GAM" value={setup.gam_network_code} onChange={v => updateField('gam_network_code', v)} placeholder="assegnato da Google" mono />
          <Field label="Network domain" value={setup.gam_network_domain} onChange={v => updateField('gam_network_domain', v)} placeholder="advlink.it" mono />
          <Field label="Admin email GAM" value={setup.gam_admin_email} onChange={v => updateField('gam_admin_email', v)} type="email" />
          <Field label="Service account email" value={setup.gam_service_account_email} onChange={v => updateField('gam_service_account_email', v)} type="email" mono />
          <Field label="Timezone" value={setup.gam_timezone} onChange={v => updateField('gam_timezone', v)} placeholder="Europe/Rome" mono />
          <Field label="Valuta" value={setup.gam_currency} onChange={v => updateField('gam_currency', v)} placeholder="EUR" mono />
          <Field label="Data richiesta setup" value={setup.gam_setup_applied_at} onChange={v => updateField('gam_setup_applied_at', v || null)} type="date" />
          <Field label="Data approvazione" value={setup.gam_setup_approved_at} onChange={v => updateField('gam_setup_approved_at', v || null)} type="date" />
          <Field label="AdX approvato il" value={setup.gam_adx_approved_at} onChange={v => updateField('gam_adx_approved_at', v || null)} type="date" />
        </Grid>
        <div className="mt-4 flex gap-4 flex-wrap">
          <Check label="AdX (Ad Exchange) attivo" checked={setup.gam_adx_enabled} onChange={v => updateField('gam_adx_enabled', v)} />
          <Check label="Open Bidding attivo" checked={setup.gam_open_bidding_enabled} onChange={v => updateField('gam_open_bidding_enabled', v)} />
          <Check label="Pricing Rules configurate" checked={setup.gam_pricing_rules_configured} onChange={v => updateField('gam_pricing_rules_configured', v)} />
        </div>
      </Section>

      {/* Policy & compliance */}
      <Section title="Policy & compliance">
        <Grid>
          <Field label="Email policy contact" value={setup.policy_contact_email} onChange={v => updateField('policy_contact_email', v)} type="email" />
          <Field label="Email DPO" value={setup.dpo_email} onChange={v => updateField('dpo_email', v)} type="email" />
          <Field label="URL privacy policy" value={setup.privacy_policy_url} onChange={v => updateField('privacy_policy_url', v)} placeholder="https://advlink.it/privacy" mono />
        </Grid>
      </Section>

      {/* SSP partner */}
      <Section title={`SSP partner di Advlink (${ssps.length})`} action={
        <button onClick={handleAddSSP} disabled={isPending} className="text-xs text-brand-800 hover:text-brand-900 font-medium">+ Aggiungi SSP</button>
      }>
        <p className="text-xs text-slate-500 mb-3">
          SSP con cui Advlink ha (o avrà) un contratto diretto. Questi account_id vengono ereditati da tutti i publisher gestiti — finiscono nell&apos;ads.txt di ogni loro dominio.
        </p>
        {ssps.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Nessun SSP. Aggiungi con il bottone sopra. Suggeriti per editoria italiana: Magnite (Rubicon), Index Exchange, Pubmatic, Criteo, Adkaora.</p>
        ) : (
          <div className="space-y-2">
            {ssps.map(ssp => (
              <NetworkSSPRow key={ssp.id} ssp={ssp} onSave={saveSSP} onRemove={removeSSP} disabled={isPending} />
            ))}
          </div>
        )}
      </Section>

      {/* Note */}
      <Section title="Note operative network">
        <textarea
          value={setup.notes || ''}
          onChange={e => updateField('notes', e.target.value)}
          rows={5}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
          placeholder="Es. contatti referente Google, ID ticket di supporto, scadenze…"
        />
      </Section>
    </div>
  );
}

function NetworkSSPRow({ ssp: initial, onSave, onRemove, disabled }: {
  ssp: NetworkSSP; onSave: (s: NetworkSSP) => void; onRemove: (id: string) => void; disabled: boolean;
}) {
  const [ssp, setSSP] = useState(initial);
  const set = <K extends keyof NetworkSSP>(k: K, v: NetworkSSP[K]) => setSSP(s => ({ ...s, [k]: v }));
  return (
    <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-12 md:col-span-3">
          <MiniField label="SSP domain" value={ssp.ssp_domain} onChange={v => set('ssp_domain', v.trim().toLowerCase())} mono />
        </div>
        <div className="col-span-12 md:col-span-2">
          <MiniField label="Nome" value={ssp.ssp_name} onChange={v => set('ssp_name', v)} />
        </div>
        <div className="col-span-6 md:col-span-2">
          <MiniField label="Account ID Advlink" value={ssp.account_id} onChange={v => set('account_id', v)} mono />
        </div>
        <div className="col-span-6 md:col-span-1">
          <MiniSelect label="Rel." value={ssp.relationship} onChange={v => set('relationship', v)} options={[['DIRECT','DIRECT'],['RESELLER','RESELLER']]} />
        </div>
        <div className="col-span-6 md:col-span-2">
          <MiniSelect label="Stato" value={ssp.status} onChange={v => set('status', v)} options={Object.entries(SSP_STATUS_LABELS)} />
        </div>
        <div className="col-span-6 md:col-span-1">
          <MiniField label="Tag ID" value={ssp.tag_id} onChange={v => set('tag_id', v)} mono />
        </div>
        <div className="col-span-12 md:col-span-1 flex gap-1 justify-end pb-0.5">
          <button onClick={() => onSave(ssp)} disabled={disabled} title="Salva" className="text-xs px-2 py-1 rounded bg-brand-800 hover:bg-brand-900 text-white disabled:opacity-50">✓</button>
          <button onClick={() => onRemove(ssp.id)} disabled={disabled} title="Rimuovi" className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-500 hover:text-red-700 hover:border-red-300 bg-white">✕</button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-2">
        <div className="col-span-6 md:col-span-3">
          <MiniField label="Contratto firmato il" value={ssp.contract_signed_at} onChange={v => set('contract_signed_at', v || null)} type="date" />
        </div>
        <div className="col-span-6 md:col-span-3">
          <MiniField label="Attivato il" value={ssp.activated_at} onChange={v => set('activated_at', v || null)} type="date" />
        </div>
        <div className="col-span-6 md:col-span-2">
          <MiniField label="Revshare SSP (%)" value={ssp.commission_rate} onChange={v => set('commission_rate', v ? parseFloat(v) : null)} type="number" />
        </div>
        <div className="col-span-12 md:col-span-4">
          <MiniField label="Note" value={ssp.notes} onChange={v => set('notes', v)} />
        </div>
      </div>
    </div>
  );
}

// ---------- UI primitives (duplicate locali) ----------
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
function Grid({ children }: { children: React.ReactNode }) { return <div className="grid md:grid-cols-2 gap-4">{children}</div>; }
type FieldVal = string | number | null;
function Field({ label, value, onChange, type = 'text', placeholder, mono = false }: {
  label: string; value: FieldVal; onChange: (v: string) => void; type?: string; placeholder?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700 ${mono ? 'font-mono' : ''}`} />
    </div>
  );
}
function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: [string, string][];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700">
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
