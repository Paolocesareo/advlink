import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// TODO: generare immagine Open Graph definitiva a /public/og.png (1200x630)
export const metadata: Metadata = {
  metadataBase: new URL('https://advlink.it'),
  title: {
    default: 'Advlink — Da editori, per editori',
    template: '%s — Advlink',
  },
  description:
    'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano. Trasparenza, integrazione nativa Google Ad Manager, focus sull’editoria locale e regionale.',
  openGraph: {
    title: 'Advlink — Da editori, per editori',
    description:
      'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano.',
    url: 'https://advlink.it',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Advlink — Da editori, per editori',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advlink — Da editori, per editori',
    description:
      'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body
        className={`${inter.variable} font-sans min-h-screen flex flex-col bg-white text-slate-900`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
