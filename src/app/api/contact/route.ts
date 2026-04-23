// TODO: verificare dominio Resend (advlink.it) e confermare email destinazione con Paolo
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

type ContactPayload = {
  nome?: unknown;
  email?: unknown;
  testata?: unknown;
  messaggio?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const nome = asString(body.nome);
  const email = asString(body.email);
  const testata = asString(body.testata);
  const messaggio = asString(body.messaggio);

  if (!nome || !email || !messaggio) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (messaggio.length < 10) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      '[contact] RESEND_API_KEY not set, skipping email send (graceful degrade)',
    );
    return NextResponse.json({ ok: true });
  }

  const fromAddress = process.env.CONTACT_EMAIL_FROM || 'noreply@advlink.it';
  const toAddress = process.env.CONTACT_EMAIL_TO || 'info@advlink.it';

  const subject = `Nuovo contatto da ${nome}${
    testata ? ' — ' + testata : ''
  }`;

  const textBody = [
    `Nome: ${nome}`,
    `Email: ${email}`,
    testata ? `Testata: ${testata}` : null,
    '',
    'Messaggio:',
    messaggio,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      subject,
      replyTo: email,
      text: textBody,
    });
  } catch (error) {
    console.error('[contact] resend send failed', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
