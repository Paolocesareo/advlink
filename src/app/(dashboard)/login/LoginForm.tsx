'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const supabase = createClient();

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setInfo('Account creato. Controlla la tua email per confermare, poi torna qui a fare il login.');
      setMode('signin');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 rounded-lg p-6">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
          placeholder="paolo@advlink.it"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5 uppercase tracking-wide">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
          placeholder="min. 8 caratteri"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />
      </div>

      {error && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}
      {info && (
        <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded">
          {info}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-800 hover:bg-brand-900 disabled:opacity-50 text-white font-medium text-sm py-2.5 rounded-md"
      >
        {loading ? '…' : mode === 'signin' ? 'Entra' : 'Crea account'}
      </button>

      <div className="text-center pt-2 border-t border-slate-100">
        {mode === 'signin' ? (
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setInfo(null); }}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Non hai un account? Registrati
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setInfo(null); }}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Hai già un account? Accedi
          </button>
        )}
      </div>
    </form>
  );
}
