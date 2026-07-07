import type {Metadata} from 'next';
import { Outfit } from 'next/font/google';
import './globals.css'; // Global styles

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Surabaya Community Live Chat',
  description: 'Join the shared chat room for the Surabaya Community. Real-time updates and active admin moderation.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body className="font-outfit antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
