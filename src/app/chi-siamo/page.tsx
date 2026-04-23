// TODO: Paolo darà testo finale con nomi gruppo editoriale, team, founder
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chi siamo',
  description:
    'Advlink nasce dentro un gruppo editoriale italiano. Conosciamo il mercato dell’ad tech dall’interno, e abbiamo deciso di farlo meglio.',
  openGraph: {
    title: 'Chi siamo — Advlink',
    description:
      'Advlink nasce dentro un gruppo editoriale italiano. Conosciamo il mercato dell’ad tech dall’interno, e abbiamo deciso di farlo meglio.',
    url: 'https://advlink.it/chi-siamo',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chi siamo — Advlink',
    description:
      'Nati dentro un gruppo editoriale italiano. Conosciamo il mestiere dall’interno.',
  },
};

export default function ChiSiamoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Nati dentro un gruppo editoriale.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            Conosciamo il mestiere dall’interno. Advlink nasce perché il
            mercato dell’ad tech ci è sempre sembrato opaco — e noi che
            pubblichiamo ogni giorno abbiamo deciso di fare qualcosa.
          </p>
        </div>
      </section>

      {/* Cosa ci rende diversi */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Cosa ci rende diversi
          </h2>
          <div className="mt-8 max-w-3xl space-y-6 text-slate-700">
            <p>
              Advlink non è nata in un ufficio tech per poi cercare editori.
              È nata dentro una redazione, con gente che guarda ogni mattina
              le dashboard revenue prima del caffè. Progettiamo gli strumenti
              che avremmo voluto avere a disposizione noi, quando la
              piattaforma la subivamo come clienti.
            </p>
            <p>
              Crediamo che il rapporto tra publisher e tecnologia debba essere
              leggibile: commissioni scritte nel contratto, metriche
              coerenti con quelle di Google Ad Manager, nessuna scatola
              nera tra il tuo inventario e la domanda.
            </p>
            <p>
              Siamo focalizzati sull’editoria locale e regionale — un segmento
              trascurato dai grandi player, dove la conoscenza del territorio
              e un servizio diretto fanno la differenza tra monetizzare e
              sopravvivere.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
          <div className="rounded-2xl bg-slate-900 p-10 text-center text-white md:p-16">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Vuoi capire se siamo gli editori giusti per te?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Scrivici due righe: ti rispondiamo direttamente.
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
