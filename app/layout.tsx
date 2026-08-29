import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
