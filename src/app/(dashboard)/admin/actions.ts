'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function createPublisher(formData: FormData) {
  const supabase = createClient();
  const name = String(formData.get('name') || '').trim();
  if (!name) throw new Error('Il nome del cliente è obbligatorio.');

  const { data, error } = await supabase
    .from('publishers')
    .insert({ name, status: 'pending' })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  redirect(`/admin/clients/${data.id}`);
}

export async function updatePublisher(id: string, patch: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase
    .from('publishers')
    .update(patch)
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath('/admin');
  return { ok: true };
}

export async function deletePublisher(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('publishers').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin');
  redirect('/admin');
}

export async function addSite(publisherId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sites')
    .insert({
      publisher_id: publisherId,
      domain: `nuovo-dominio-${Date.now().toString(36)}.it`,
      name: 'Nuova testata',
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clients/${publisherId}`);
  return { ok: true, id: data.id };
}

export async function updateSite(id: string, publisherId: string, patch: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase.from('sites').update(patch).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clients/${publisherId}`);
  return { ok: true };
}

export async function deleteSite(id: string, publisherId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('sites').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clients/${publisherId}`);
  return { ok: true };
}

export async function addSSP(publisherId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ssps')
    .insert({
      publisher_id: publisherId,
      ssp_domain: `nuovo-ssp-${Date.now().toString(36)}.com`,
      account_id: 'PLACEHOLDER',
      relationship: 'DIRECT',
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/admin/clients/${publisherId}`);
  return { ok: true, id: data.id };
}

export async function updateSSP(id: string, publisherId: string, patch: Record<string, unknown>) {
  const supabase = createClient();
  const { error } = await supabase.from('ssps').update(patch).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clients/${publisherId}`);
  return { ok: true };
}

export async function deleteSSP(id: string, publisherId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('ssps').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/clients/${publisherId}`);
  return { ok: true };
}

export async function toggleOnboardingStep(publisherId: string, key: string, value: boolean) {
  const supabase = createClient();
  const { data: current } = await supabase
    .from('publishers')
    .select('onboarding')
    .eq('id', publisherId)
    .single();

  const onboarding = { ...(current?.onboarding || {}), [key]: value };
  const { error } = await supabase
    .from('publishers')
    .update({ onboarding })
    .eq('id', publisherId);

  if (error) return { error: error.message };
  revalidatePath(`/admin/clients/${publisherId}`);
  revalidatePath('/admin');
  return { ok: true };
}
