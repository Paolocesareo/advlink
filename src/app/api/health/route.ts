import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'advlink',
    version: process.env.npm_package_version ?? 'unknown',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
