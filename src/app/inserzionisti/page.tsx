import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Inserzionisti',
  description:
    'Reach+ di Advlink: campagne su testate editoriali indipendenti, brand safety reale e metriche performance trasparenti.',
  openGraph: {
    title: 'Inserzionisti — Advlink',
    description:
      'Reach+ di Advlink: campagne su testate editoriali indipendenti, brand safety reale e metriche performance trasparenti.',
    url: 'https://advlink.it/inserzionisti',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inserzionisti — Advlink',
    description:
      'Campagne su testate editoriali indipendenti, brand safety reale e metriche trasparenti.',
  },
};

type Principle = {
  eyebrow: string;
  title: string;
  description: string;
};

const principles: ReadonlyArray<Principle> = [
  {
    eyebrow: '01',
    title: 'Ambienti editoriali verificati',
    description:
      'Campagne esclusivamente su testate editoriali indipendenti verificate, senza inventory di qualità incerta.',
  },
  {
    eyebrow: '02',
    title: 'Performance trasparenti',
    description:
      'Metriche CPC e CPCV leggibili, reportistica sui KPI reali della campagna senza metriche di vanità.',
  },
  {
    eyebrow: '03',
    title: 'Piano media sugli obiettivi',
    description:
      'Costruiamo il piano sui tuoi obiettivi di business, non sul remainder inventory da svuotare a fine mese.',
  },
];

export default function InserzionistiPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Raggiungi audience qualificate in ambienti editoriali premium.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            Con Reach+ pianifichi campagne in contesti editoriali curati —
            locale, regionale, verticali di nicchia — con brand safety reale e
            metriche performance dichiarate.
          </p>
        </div>
      </section>

      {/* Come lavoriamo con i brand */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Come lavoriamo con i brand
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {principles.map((item) => (
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

      {/* Perché contesti editoriali */}
      <section className="bg-brand-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Perché l’editoria indipendente
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-slate-700">
            <p>
              Le testate editoriali indipendenti — soprattutto locali e
              regionali — raggiungono audience qualificate, fidelizzate e
              poco esposte al rumore delle grandi reti di content aggregator.
            </p>
            <p>
              Per un brand che cerca visibilità in contesti reali, editoriali e
              misurabili, questo inventory è un territorio ancora poco
              sfruttato e particolarmente efficiente sul costo per risultato.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="rounded-2xl bg-slate-900 p-10 text-center text-white md:p-16">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Parliamo della tua prossima campagna.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Raccontaci obiettivi e target: ti rispondiamo con un piano media
              concreto sulle nostre testate.
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
