import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Advlink',
  description:
    'Come Advlink tratta i tuoi dati personali ai sensi del GDPR.',
  openGraph: {
    title: 'Privacy Policy — Advlink',
    description:
      'Come Advlink tratta i tuoi dati personali ai sensi del GDPR.',
    url: 'https://advlink.it/privacy',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Advlink',
    description:
      'Come Advlink tratta i tuoi dati personali ai sensi del GDPR.',
  },
};

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-sm uppercase tracking-wide text-slate-500">
          Ultimo aggiornamento: 23 aprile 2026
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-6 text-slate-700 leading-relaxed">
          La presente informativa descrive le modalità con cui Advlink tratta i
          dati personali raccolti attraverso il sito advlink.it, ai sensi del
          Regolamento (UE) 2016/679 (GDPR) e della normativa italiana vigente
          in materia di protezione dei dati personali.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Titolare del trattamento
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Il titolare del trattamento è Advlink Srl.
          {/* TODO Paolo: completare P.IVA e sede legale */}
          {' '}P.IVA e sede legale verranno indicate al completamento della
          costituzione societaria. Per qualunque richiesta puoi scrivere a{' '}
          <a
            href="mailto:privacy@advlink.it"
            className="font-semibold text-brand-700 underline hover:text-brand-900"
          >
            privacy@advlink.it
          </a>
          {' '}
          {/* TODO Paolo: confermare indirizzo DPO/privacy */}
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Dati raccolti
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Tramite il form di contatto raccogliamo esclusivamente i dati che
          l’utente fornisce spontaneamente: nome e cognome, indirizzo email,
          nome della testata o azienda di riferimento, testo libero del
          messaggio. Non raccogliamo dati sensibili ai sensi dell’art. 9 GDPR
          e non effettuiamo profilazione automatizzata.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Base giuridica
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Il trattamento si fonda sul consenso esplicito dell’interessato
          manifestato con l’invio del form, ai sensi dell’art. 6, par. 1,
          lett. a) GDPR. Il consenso può essere revocato in qualsiasi momento
          scrivendo all’indirizzo privacy indicato sopra.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Finalità del trattamento
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          I dati raccolti vengono utilizzati esclusivamente per rispondere alla
          richiesta commerciale o informativa inviata dall’interessato e per
          gestire l’eventuale rapporto che dovesse nascere da tale contatto.
          Non effettuiamo attività di marketing non richiesto e non cediamo i
          dati a terzi per finalità pubblicitarie.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Conservazione
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          I dati raccolti attraverso il form vengono conservati per un periodo
          massimo di 24 mesi dalla data dell’ultimo contatto utile. Decorso
          tale termine, i dati sono cancellati dai nostri sistemi, fatto salvo
          l’obbligo di conservazione per finalità fiscali, contabili o di
          difesa in giudizio previsto dalla legge.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Diritti dell’interessato
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          In qualsiasi momento l’interessato può esercitare i diritti previsti
          dagli artt. 15-22 GDPR: accesso ai propri dati, rettifica,
          cancellazione, limitazione del trattamento, portabilità dei dati e
          opposizione. È inoltre possibile proporre reclamo all’Autorità
          Garante per la protezione dei dati personali (www.garanteprivacy.it).
          Per esercitare questi diritti basta scrivere a privacy@advlink.it.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Trasferimento extra-UE
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          I dati sono conservati e trattati all’interno dell’Unione Europea.
          L’hosting del sito è gestito tramite Netlify su infrastruttura
          europea. L’invio delle email transazionali è gestito tramite Resend,
          che può elaborare i dati negli Stati Uniti con clausole contrattuali
          standard GDPR approvate dalla Commissione Europea come strumento di
          tutela del trasferimento.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">
          Contatti
        </h2>
        <p className="mt-4 text-slate-700 leading-relaxed">
          Per qualunque domanda relativa alla presente informativa o
          all’esercizio dei propri diritti, l’interessato può scrivere a{' '}
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
