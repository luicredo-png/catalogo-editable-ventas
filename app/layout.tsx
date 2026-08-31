import type { Metadata } from 'next';
import { Abril_Fatface, Bebas_Neue, Cinzel, Cormorant_Garamond, Geist, Geist_Mono, Lobster, Oswald, Outfit, Pacifico, Playfair_Display, Space_Grotesk } from 'next/font/google';
import './globals.css';
import './notice.css';
import './clothing.css';
import './cover.css';
import './inventory.css';
import './flyer.css';

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
const bebas = Bebas_Neue({variable:'--font-bebas',subsets:['latin'],weight:'400'});
const oswald = Oswald({variable:'--font-oswald',subsets:['latin']});
const abril = Abril_Fatface({variable:'--font-abril',subsets:['latin'],weight:'400'});
const cinzel = Cinzel({variable:'--font-cinzel',subsets:['latin']});
const lobster = Lobster({variable:'--font-lobster',subsets:['latin'],weight:'400'});
const pacifico = Pacifico({variable:'--font-pacifico',subsets:['latin'],weight:'400'});

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
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${spaceGrotesk.variable} ${playfair.variable} ${cormorant.variable} ${bebas.variable} ${oswald.variable} ${abril.variable} ${cinzel.variable} ${lobster.variable} ${pacifico.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
