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
    default: 'Advlink',
    template: '%s — Advlink',
  },
  description:
    'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano.',
  openGraph: {
    title: 'Advlink',
    description:
      'Tecnologia pubblicitaria nata dentro un gruppo editoriale italiano.',
    url: 'https://advlink.it',
    siteName: 'Advlink',
    locale: 'it_IT',
    type: 'website',
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
