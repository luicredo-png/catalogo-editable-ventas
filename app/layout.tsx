import type { Metadata } from 'next';
import { Cormorant_Garamond, Geist, Geist_Mono, Outfit, Playfair_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';
import './notice.css';
import './clothing.css';
import './cover.css';
import './inventory.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const outfit = Outfit({variable:'--font-outfit',subsets:['latin']});
const spaceGrotesk = Space_Grotesk({variable:'--font-space',subsets:['latin']});
const playfair = Playfair_Display({variable:'--font-playfair',subsets:['latin']});
const cormorant = Cormorant_Garamond({variable:'--font-cormorant',subsets:['latin'],weight:['500','600','700']});

export const metadata: Metadata = {
  title: 'Mío Catálogo | Tu tienda digital',
  description: 'Crea, edita y comparte tu catálogo. Recibe pedidos directamente en WhatsApp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${spaceGrotesk.variable} ${playfair.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
