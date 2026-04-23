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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advlink — Da editori, per editori',
    description:
      'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano.',
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
