
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Surabaya Community Live Chat',
  other: {
    google: 'notranslate'
  }
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
