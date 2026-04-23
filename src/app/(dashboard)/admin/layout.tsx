import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './LogoutButton';

export const metadata = {
  title: 'Admin Console',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?next=/admin');
  }

  // Verifica che l'utente sia nel team. Se la riga non esiste, mostro schermata "in attesa di approvazione".
  const { data: member } = await supabase
    .from('team_members')
    .select('user_id, role, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!member) {
    return (
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-brand-800 text-white text-sm font-bold tracking-wider mb-4">AL</div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Account in attesa di approvazione</h1>
        <p className="text-sm text-slate-600 mb-6">
          Sei loggato come <span className="font-mono">{user.email}</span>, ma questo account non è ancora autorizzato ad accedere all&apos;Admin Console.
          Contatta un amministratore per l&apos;abilitazione.
        </p>
        <LogoutButton className="inline-block text-xs text-slate-600 underline hover:text-slate-900" label="Esci" />
      </main>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-800 rounded flex items-center justify-center text-white text-xs font-bold tracking-wider">AL</div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900 text-sm">Advlink</div>
              <div className="text-[11px] text-slate-500">Admin Console</div>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">
              {member.display_name || user.email} · <span className="uppercase tracking-wide text-slate-400">{member.role}</span>
            </span>
            <LogoutButton className="text-slate-600 hover:text-slate-900" label="Logout" />
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
