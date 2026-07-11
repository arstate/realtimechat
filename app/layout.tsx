
import type {Metadata, Viewport} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Surabaya Community Live Chat',
  other: {
    google: 'notranslate'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" translate="no" className="notranslate">
      <body>
        {children}
      </body>
    </html>
  );
}
