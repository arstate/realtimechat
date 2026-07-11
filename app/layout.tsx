
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('touchmove', function (event) {
                if (event.touches.length > 1) {
                  event.preventDefault();
                }
              }, { passive: false });
              
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  event.preventDefault();
                }
                lastTouchEnd = now;
              }, { passive: false });
            `,
          }}
        />
      </body>
    </html>
  );
}
