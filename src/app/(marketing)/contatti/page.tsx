import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contatti',
  description:
    'Scrivi ad Advlink. Rispondiamo entro due giorni lavorativi con un’analisi concreta del tuo setup.',
  openGraph: {
    title: 'Contatti — Advlink',
    description:
      'Scrivi ad Advlink. Rispondiamo entro due giorni lavorativi con un’analisi concreta del tuo setup.',
    url: 'https://advlink.it/contatti',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contatti — Advlink',
    description:
      'Scrivi ad Advlink. Rispondiamo entro due giorni lavorativi.',
  },
};

export default function ContattiPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Parliamone.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            Rispondiamo entro 2 giorni lavorativi.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
          <ContactForm />

          <p className="mt-8 text-sm text-slate-600">
            Oppure scrivici a{' '}
            <a
              href="mailto:info@advlink.it"
              className="font-semibold text-brand-700 underline hover:text-brand-900"
            >
              info@advlink.it
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
