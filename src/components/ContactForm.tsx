'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type FormState = {
  nome: string;
  email: string;
  testata: string;
  messaggio: string;
};

const initialState: FormState = {
  nome: '',
  email: '',
  testata: '',
  messaggio: '',
};

export default function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        setStatus('error');
        return;
      }

      setState(initialState);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const inputClasses =
    'w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 outline-none transition-colors focus:border-brand-700 focus:ring-1 focus:ring-brand-700';
  const labelClasses = 'mb-1 block text-sm font-medium text-slate-700';

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="nome" className={labelClasses}>
          Nome <span aria-hidden="true">*</span>
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          value={state.nome}
          onChange={(e) =>
            setState((prev) => ({ ...prev, nome: e.target.value }))
          }
          className={inputClasses}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={state.email}
          onChange={(e) =>
            setState((prev) => ({ ...prev, email: e.target.value }))
          }
          className={inputClasses}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="testata" className={labelClasses}>
          Testata <span className="text-slate-400">(facoltativo)</span>
        </label>
        <input
          id="testata"
          name="testata"
          type="text"
          value={state.testata}
          onChange={(e) =>
            setState((prev) => ({ ...prev, testata: e.target.value }))
          }
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="messaggio" className={labelClasses}>
          Messaggio <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          required
          minLength={10}
          rows={6}
          value={state.messaggio}
          onChange={(e) =>
            setState((prev) => ({ ...prev, messaggio: e.target.value }))
          }
          className={inputClasses}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center rounded-md bg-brand-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Invio in corso…' : 'Invia messaggio'}
        </button>
      </div>

      {status === 'success' && (
        <p
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Grazie, ti risponderemo presto.
        </p>
      )}

      {status === 'error' && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          Qualcosa è andato storto, riprova o scrivici direttamente a{' '}
          <a
            href="mailto:info@advlink.it"
            className="font-medium text-brand-700 underline hover:text-brand-900"
          >
            info@advlink.it
          </a>
          .
        </p>
      )}
    </form>
  );
}
