import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ClientForm } from './ClientForm';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [pubRes, sitesRes, sspsRes] = await Promise.all([
    supabase.from('publishers').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('sites').select('*').eq('publisher_id', params.id).order('created_at'),
    supabase.from('ssps').select('*').eq('publisher_id', params.id).order('created_at'),
  ]);

  if (pubRes.error || !pubRes.data) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-4">
        <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
          ← Torna all&apos;elenco clienti
        </Link>
      </div>
      <ClientForm
        publisher={pubRes.data}
        sites={sitesRes.data || []}
        ssps={sspsRes.data || []}
      />
    </main>
  );
}
