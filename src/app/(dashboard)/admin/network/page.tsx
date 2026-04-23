import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { NetworkForm } from './NetworkForm';

export const dynamic = 'force-dynamic';

export default async function NetworkPage() {
  const supabase = createClient();

  const [setupRes, sspsRes] = await Promise.all([
    supabase.from('network_setup').select('*').eq('id', 1).maybeSingle(),
    supabase.from('network_ssps').select('*').order('ssp_domain'),
  ]);

  if (setupRes.error || !setupRes.data) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded">
          Errore caricamento network setup: {setupRes.error?.message || 'record singleton mancante'}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-4">
        <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
          ← Torna all&apos;elenco clienti
        </Link>
      </div>
      <NetworkForm setup={setupRes.data} ssps={sspsRes.data || []} />
    </main>
  );
}
