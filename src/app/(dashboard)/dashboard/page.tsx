export const metadata = {
  title: 'Dashboard — Advlink',
  description: 'Area riservata editori Advlink',
};

export default function DashboardPlaceholder() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-medium text-slate-900 mb-4">
        Dashboard in arrivo
      </h1>
      <p className="text-slate-600 mb-8">
        L&apos;area riservata editori sarà disponibile a breve.
        Ti contatteremo per l&apos;onboarding.
      </p>
      <a
        href="/contatti"
        className="inline-block bg-brand-800 hover:bg-brand-900 text-white px-6 py-3 rounded-md font-medium"
      >
        Parlaci della tua testata
      </a>
    </main>
  );
}
