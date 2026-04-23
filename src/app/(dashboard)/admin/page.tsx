import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createPublisher } from './actions';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending onboarding',
  active: 'Attivo',
  offboarded: 'Offboarded',
  suspended: 'Sospeso',
};

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900 border-amber-300',
  active: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  offboarded: 'bg-slate-200 text-slate-700 border-slate-300',
  suspended: 'bg-red-100 text-red-900 border-red-300',
};

const NETWORK_STATUS_LABEL: Record<string, string> = {
  not_started: 'Non iniziato',
  applied: 'Richiesta inviata',
  under_review: 'In revisione Google',
  approved: 'Approvato',
  operational: 'Operativo',
};

export default async function AdminHome() {
  const supabase = createClient();

  const [pubRes, netRes] = await Promise.all([
    supabase
      .from('publishers')
      .select('id, name, slug, status, commission_advlink, commission_publisher, onboarding, updated_at, sites(count)')
      .order('updated_at', { ascending: false }),
    supabase.from('network_setup').select('gam_setup_status, gam_network_code').eq('id', 1).maybeSingle(),
  ]);

  if (pubRes.error) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded">
          Errore caricamento clienti: {pubRes.error.message}
        </div>
      </main>
    );
  }
  const publishers = pubRes.data;
  const networkStatus = netRes.data?.gam_setup_status || 'not_started';
  const networkCode = netRes.data?.gam_network_code;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Banner stato Network Advlink */}
      {networkStatus !== 'operational' && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-semibold text-amber-900">
              Network Advlink: {NETWORK_STATUS_LABEL[networkStatus] || networkStatus}
            </div>
            <div className="text-xs text-amber-800 mt-0.5">
              Il network GAM Advlink non è ancora operativo — tutti i publisher servono inventory dentro concessionario precedente.
            </div>
          </div>
          <Link href="/admin/network" className="text-sm font-medium text-amber-900 hover:text-amber-950 bg-white border border-amber-300 px-3 py-1.5 rounded-md">
            Configura Network →
          </Link>
        </div>
      )}
      {networkStatus === 'operational' && networkCode && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-2.5 flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="text-emerald-900">
            Network Advlink operativo · GAM code <span className="font-mono">{networkCode}</span>
          </div>
          <Link href="/admin/network" className="text-emerald-800 hover:text-emerald-950 font-medium">
            Gestisci →
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clienti</h1>
          <p className="text-sm text-slate-500 mt-1">
            {publishers?.length || 0} {publishers?.length === 1 ? 'publisher censito' : 'publisher censiti'}
          </p>
        </div>
        <form action={createPublisher} className="flex items-center gap-2">
          <input
            type="text"
            name="name"
            required
            placeholder="Nome nuovo cliente (es. OPS Media)"
            className="px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700 bg-white w-72"
          />
          <button
            type="submit"
            className="bg-brand-800 hover:bg-brand-900 text-white px-4 py-2 rounded-md font-medium text-sm"
          >
            + Nuovo cliente
          </button>
        </form>
      </div>

      {!publishers || publishers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Nessun cliente censito</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Inserisci il nome del primo cliente nel campo in alto (es. <span className="font-mono">OPS Media</span>) e clicca &quot;Nuovo cliente&quot; per iniziare.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {publishers.map(p => {
            const obKeys = Object.keys(p.onboarding || {});
            const obDone = obKeys.filter(k => (p.onboarding as Record<string, boolean>)[k]).length;
            const obPct = obKeys.length > 0 ? Math.round((obDone / obKeys.length) * 100) : 0;
            const sitesCount = Array.isArray(p.sites) && p.sites[0] ? (p.sites[0] as { count: number }).count : 0;

            return (
              <Link
                key={p.id}
                href={`/admin/clients/${p.id}`}
                className="block bg-white border border-slate-200 rounded-lg p-5 hover:border-brand-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLOR[p.status] || STATUS_COLOR.pending}`}>
                        {STATUS_LABEL[p.status] || p.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex gap-4 flex-wrap">
                      <span>{sitesCount} {sitesCount === 1 ? 'testata' : 'testate'}</span>
                      <span>Advlink {p.commission_advlink}% · Editore {p.commission_publisher}%</span>
                      {p.slug && <span className="font-mono">{p.slug}</span>}
                    </div>
                  </div>
                  <div className="w-40 shrink-0">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Onboarding</span>
                      <span className="font-medium text-slate-700">{obPct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-800 transition-all" style={{ width: `${obPct}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
