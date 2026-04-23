export const metadata = {
  title: 'Login — Advlink',
  description: 'Accesso area riservata editori Advlink',
};

export default function LoginPlaceholder() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-medium text-slate-900 mb-4">
        Login — in arrivo
      </h1>
      <p className="text-slate-600 mb-8">
        L&apos;autenticazione per editori sarà disponibile a breve.
      </p>
      <a
        href="/"
        className="inline-block bg-brand-800 hover:bg-brand-900 text-white px-6 py-3 rounded-md font-medium"
      >
        Torna alla home
      </a>
    </main>
  );
}
