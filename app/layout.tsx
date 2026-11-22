import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'MiraStudio — Simulateur Tactique B2B & Serious Games IA',
  description:
    "Plateforme SaaS B2B de simulation professionnelle assistée par IA combinant un Moteur d'État déterministe, un Moteur Narratif multi-personas, une base documentaire RAG et un Agent Évaluateur.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'MiraStudio — Simulateur Tactique B2B & Serious Games IA',
    description:
      "Plateforme SaaS B2B de simulation professionnelle assistée par IA combinant un Moteur d'État déterministe, un Moteur Narratif multi-personas, une base documentaire RAG et un Agent Évaluateur.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiraStudio — Simulateur Tactique B2B & Serious Games IA',
    description:
      "Plateforme SaaS B2B de simulation professionnelle assistée par IA combinant un Moteur d'État déterministe, un Moteur Narratif multi-personas, une base documentaire RAG et un Agent Évaluateur.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-[#FAF8FF] text-[#1A1B21]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Source+Code+Pro:wght@500;600;700&family=Wix+Madefor+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#FAF8FF] text-[#1A1B21] font-sans antialiased selection:bg-[#CBD6FE] selection:text-[#002C76] min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}
