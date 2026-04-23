'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton({ className, label }: { className?: string; label: string }) {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };
  return (
    <button onClick={handleLogout} className={className} type="button">
      {label}
    </button>
  );
}
