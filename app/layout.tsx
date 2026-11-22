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
  title: 'AegisSim — Simulateur Tactique B2B & Serious Games IA',
  description:
    "Plateforme SaaS B2B de simulation professionnelle assistée par IA combinant un Moteur d'État déterministe, un Moteur Narratif multi-personas, une base documentaire RAG et un Agent Évaluateur.",
  openGraph: {
    title: 'AegisSim — Simulateur Tactique B2B & Serious Games IA',
    description:
      "Plateforme SaaS B2B de simulation professionnelle assistée par IA combinant un Moteur d'État déterministe, un Moteur Narratif multi-personas, une base documentaire RAG et un Agent Évaluateur.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AegisSim — Simulateur Tactique B2B & Serious Games IA',
    description:
      "Plateforme SaaS B2B de simulation professionnelle assistée par IA combinant un Moteur d'État déterministe, un Moteur Narratif multi-personas, une base documentaire RAG et un Agent Évaluateur.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`dark ${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#0B0F17] text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200 min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}
