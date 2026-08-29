import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://venturelens.app'),
  title: 'VentureLens — Test Your Business Idea',
  description:
    'A free financial decision tool for aspiring entrepreneurs. Enter your assumptions, get your break-even, cash runway, scenario analysis, and risk validation plan in minutes.',
  keywords: ['business idea', 'financial analysis', 'break-even', 'entrepreneurship', 'startup tool'],
  openGraph: {
    title: 'VentureLens',
    description: 'Test whether your business idea is financially viable.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
