import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    absolute: 'Advlink — Da editori, per editori',
  },
  description:
    'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano. Trasparenza, integrazione nativa Google Ad Manager, focus sull’editoria locale e regionale.',
  openGraph: {
    title: 'Advlink — Da editori, per editori',
    description:
      'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano. Trasparenza, integrazione nativa Google Ad Manager, focus sull’editoria locale e regionale.',
    url: 'https://advlink.it/',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advlink — Da editori, per editori',
    description:
      'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano.',
  },
};

type SolutionCard = {
  eyebrow: string;
  title: string;
  description: string;
};

const solutions: ReadonlyArray<SolutionCard> = [
  {
    eyebrow: '01',
    title: 'Piattaforma',
    description:
      'Header bidding wrapper integrato a Google Ad Manager, multi-SSP, ottimizzazione real-time dell’asta.',
  },
  {
    eyebrow: '02',
    title: 'Reach+',
    description:
      'Divisione commerciale che vende campagne sui tuoi spazi a inserzionisti premium, con piani media costruiti sugli obiettivi.',
  },
  {
    eyebrow: '03',
    title: 'Analytics',
    description:
      'Dashboard real-time con revenue, CPM, fill rate e payable pageview per testata.',
  },
];

type ValueProp = {
  title: string;
  description: string;
};

const valueProps: ReadonlyArray<ValueProp> = [
  {
    title: 'Editori veri, non società tech esterna',
    description:
      'Advlink nasce dentro un gruppo editoriale italiano: conosciamo il mestiere dall’interno.',
  },
  {
    title: 'Commissioni chiare e dichiarate',
    description:
      'La cifra che tratteniamo è scritta nel contratto, senza markup nascosti tra publisher e SSP.',
  },
  {
    title: 'Specializzati nell’editoria locale e regionale',
    description:
      'Seguiamo il segmento che i grandi player trascurano, con attenzione a volumi e margini di ogni testata.',
  },
  {
    title: 'Commissione esplicita e dichiarata, sotto la media di mercato',
    description:
      'La trattenuta è scritta nel contratto, non nascosta nella catena SSP: una cifra inferiore alla media di settore.',
  },
  {
    title: 'Pagamenti a 30 giorni — non a 90 come la concorrenza',
    description:
      'Flusso di cassa prevedibile: il revenue maturato viene liquidato a 30 giorni, non dopo trimestri.',
  },
];

type Metric = {
  value: string;
  label: string;
};

const metrics: ReadonlyArray<Metric> = [
  { value: '150+', label: 'testate gestite' },
  { value: '7', label: 'regioni' },
  { value: '4', label: 'capoluoghi' },
  { value: '60+', label: 'comuni' },
];

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Advlink',
  description: 'Piattaforma pubblicitaria per editori italiani',
  url: 'https://advlink.it',
  logo: 'https://advlink.it/opengraph-image',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center md:px-6 md:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Da editori, per editori.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano.
            Trasparenza, integrazione nativa Google Ad Manager, focus
            sull’editoria locale e regionale.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-slate-700 md:text-lg">
            Network di oltre 100 testate, 7 regioni italiane, 4 capoluoghi.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/editori"
              className="inline-flex items-center justify-center rounded-md bg-brand-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2"
            >
              Parlaci della tua testata
            </Link>
            <Link
              href="/inserzionisti"
              className="inline-flex items-center justify-center rounded-md border border-brand-700 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2"
            >
              Sono un inserzionista
            </Link>
          </div>
        </div>
      </section>

      {/* Tre soluzioni */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Tre soluzioni per il tuo programmatic
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {solutions.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                  {card.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-3 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Perché Advlink */}
      <section className="bg-brand-50">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Perché Advlink
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metriche numeriche */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm uppercase tracking-wide text-slate-300 md:text-base">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="rounded-2xl bg-slate-900 p-10 text-center text-white md:p-16">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Vuoi vedere se Advlink è adatto alla tua testata?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Scrivici. Rispondiamo con un’analisi concreta del tuo setup
              attuale.
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
