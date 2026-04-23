import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Login',
  description: 'Accesso riservato al team Advlink',
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-20">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-brand-800 text-white text-sm font-bold tracking-wider mb-4">
          AL
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Advlink Admin</h1>
        <p className="text-sm text-slate-500 mt-1">Accesso riservato al team</p>
      </div>
      <Suspense fallback={<div className="text-sm text-slate-500">Caricamento…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
