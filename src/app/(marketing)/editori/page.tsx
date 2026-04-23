import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editori',
  description:
    'Integrazione nativa Google Ad Manager, trasparenza commissioni e dashboard real-time con payable pageview per le testate editoriali.',
  openGraph: {
    title: 'Editori — Advlink',
    description:
      'Integrazione nativa Google Ad Manager, trasparenza commissioni e dashboard real-time con payable pageview per le testate editoriali.',
    url: 'https://advlink.it/editori',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editori — Advlink',
    description:
      'Integrazione nativa Google Ad Manager, trasparenza commissioni e dashboard real-time per gli editori.',
  },
};

type Benefit = {
  eyebrow: string;
  title: string;
  description: string;
};

const benefits: ReadonlyArray<Benefit> = [
  {
    eyebrow: '01',
    title: 'Integrazione Google Ad Manager nativa',
    description:
      'Wrapper header bidding integrato direttamente in GAM, senza livelli opachi tra asta e ad server.',
  },
  {
    eyebrow: '02',
    title: 'Trasparenza commissioni',
    description:
      'La cifra che tratteniamo è scritta nel contratto: nessun markup nascosto tra SSP e publisher.',
  },
  {
    eyebrow: '03',
    title: 'Dashboard real-time per testata',
    description:
      'Revenue, CPM, fill rate e payable pageview aggiornati in tempo reale, testata per testata.',
  },
];

type ComparisonRow = {
  label: string;
  before: string;
  after: string;
};

const comparison: ReadonlyArray<ComparisonRow> = [
  { label: 'Commissione', before: '42%', after: '22%' },
  { label: 'Pagamento', before: '60-90 giorni', after: '30 giorni' },
  { label: 'Trasparenza', before: 'Opaca', after: 'Esplicita in dashboard' },
  {
    label: 'Health monitoring',
    before: 'Solo segnalazione',
    after: 'Azione in 1 click',
  },
  {
    label: 'Categorizzazione',
    before: '4 macro-categorie',
    after: 'IAB 2.2 completa (700+ categorie)',
  },
];

export default function EditoriPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            La tua testata merita una piattaforma costruita per editori.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            Advlink integra nativamente Google Ad Manager, espone commissioni
            chiare nel contratto e offre una dashboard real-time con payable
            pageview per ogni testata.
          </p>
        </div>
      </section>

      {/* Cosa ottieni */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Cosa ottieni
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {benefits.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                  {item.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cosa otterrai dal cambio piattaforma */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Cosa otterrai dal cambio piattaforma
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Confronto diretto tra lo standard di mercato e quello che offriamo
            agli editori Advlink.
          </p>

          {/* Tabella desktop */}
          <div className="mt-10 hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Aspetto
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Prima
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    Dopo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="px-6 py-4 text-sm font-semibold text-slate-900"
                    >
                      {row.label}
                    </th>
                    <td className="px-6 py-4 text-slate-500 line-through">
                      {row.before}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-800">
                      {row.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card stack mobile */}
          <div className="mt-10 grid grid-cols-1 gap-4 md:hidden">
            {comparison.map((row) => (
              <article
                key={row.label}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {row.label}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] font-medium uppercase text-slate-400">
                      Prima
                    </p>
                    <p className="mt-1 text-slate-500 line-through">
                      {row.before}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase text-slate-400">
                      Dopo
                    </p>
                    <p className="mt-1 font-semibold text-brand-800">
                      {row.after}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Per chi è Advlink */}
      <section className="bg-brand-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Per chi è Advlink
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-slate-700">
            <p>
              Advlink è pensata per le testate editoriali indipendenti, con un
              focus specifico su editoria locale e regionale: il segmento dove
              i grandi player non operano e dove ogni punto di CPM fa la
              differenza sul margine.
            </p>
            <p>
              Lavoriamo con gruppi editoriali che vogliono uscire da wrapper
              opachi, leggere con chiarezza il loro revenue programmatic e
              ritrovare controllo sulla propria monetizzazione.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="rounded-2xl bg-slate-900 p-10 text-center text-white md:p-16">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Vuoi capire quanto lasci sul tavolo oggi?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Inviaci due righe sulla tua testata: ti rispondiamo con
              un’analisi concreta del setup attuale.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center rounded-md bg-brand-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Contattaci
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
