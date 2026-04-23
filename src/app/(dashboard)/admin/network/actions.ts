'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// -------- network_setup (singleton) --------
export async function updateNetworkSetup(patch: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase.from('network_setup').update(patch).eq('id', 1);
  if (error) return { error: error.message };
  revalidatePath('/admin/network');
  revalidatePath('/admin');
  return { ok: true };
}

// -------- network_ssps --------
export async function addNetworkSSP() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('network_ssps')
    .insert({
      ssp_domain: `nuovo-ssp-${Date.now().toString(36)}.com`,
      ssp_name: 'Nuovo SSP',
      relationship: 'DIRECT',
      status: 'prospected',
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath('/admin/network');
  return { ok: true, id: data.id };
}

export async function updateNetworkSSP(id: string, patch: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase.from('network_ssps').update(patch).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/network');
  return { ok: true };
}

export async function deleteNetworkSSP(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('network_ssps').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/network');
  return { ok: true };
}
