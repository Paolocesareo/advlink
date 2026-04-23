import { NextResponse } from 'next/server';

// TODO Fase 2: ingest endpoint per tag JS publisher
// Riceverà eventi da cdn.advlink.it/s/{publisher}/adv.js
// Partitioning oraria, scrittura batched su Supabase

export async function POST() {
  return NextResponse.json(
    { error: 'not implemented — available in Phase 2' },
    { status: 501 }
  );
}
