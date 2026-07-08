const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

// A common bug in Next.js 13+ App Router is when `pages` dir is missing but it expects it to throw errors, 
// or maybe something in `globals.css` is triggering it? Or maybe it is capitalizing html? No, it's lowercased `<html`.

// Let's create a minimal layout.
const minLayout = `
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Surabaya Community Live Chat',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
`;

fs.writeFileSync('app/layout.tsx', minLayout);
