import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy — Advlink',
  description: 'Politica sui cookie del sito Advlink.',
  openGraph: {
    title: 'Cookie Policy — Advlink',
    description: 'Politica sui cookie del sito Advlink.',
    url: 'https://advlink.it/cookie',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy — Advlink',
    description: 'Politica sui cookie del sito Advlink.',
  },
};

export default function CookiePage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Ultimo aggiornamento: 23 aprile 2026
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Cookie Policy
        </h1>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Cosa sono i cookie
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          I cookie sono piccoli file di testo che i siti visitati inviano al
          terminale dell’utente, dove vengono memorizzati, per poi essere
          ritrasmessi agli stessi siti in occasione delle visite successive.
          Sono comunemente usati per garantire il funzionamento del sito o per
          raccogliere informazioni sull’utilizzo.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Cookie tecnici
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Il sito advlink.it utilizza esclusivamente cookie tecnici e di
          sessione strettamente necessari al corretto funzionamento delle
          pagine e al supporto del framework Next.js che genera il sito.
          Questi cookie non richiedono consenso preventivo ai sensi dell’art.
          122 del Codice Privacy e del Provvedimento del Garante del 10 giugno
          2021.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Cookie analitici
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Al momento il sito non utilizza alcun cookie analitico né di
          misurazione. Nessun tracciamento statistico è attivo sulle visite
          degli utenti.
          {/* TODO fase 2: valutare integrazione Plausible o Umami privacy-first. */}
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Cookie di terze parti
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Il sito non installa alcun cookie di terze parti. In particolare non
          sono presenti Google Analytics, Meta Pixel, Hotjar, né altri
          strumenti di tracciamento o profilazione pubblicitaria. Nessun dato
          di navigazione viene condiviso con network esterni.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Come gestire i cookie
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          L’utente può in ogni momento gestire i cookie dal proprio browser,
          bloccandoli o eliminando quelli già salvati. Le istruzioni sono
          disponibili nelle sezioni di aiuto dei principali browser: Google
          Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge. Poiché il
          sito utilizza solo cookie tecnici, la disabilitazione non impedisce
          l’utilizzo di quasi nessuna funzionalità.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Aggiornamenti
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          La presente cookie policy può essere aggiornata in caso di modifiche
          tecniche o normative. Le versioni precedenti restano consultabili su
          richiesta scrivendo a{' '}
          <a
            href="mailto:privacy@advlink.it"
            className="font-semibold text-brand-700 underline hover:text-brand-900"
          >
            privacy@advlink.it
          </a>
          .
        </p>
      </div>
    </main>
  );
}
