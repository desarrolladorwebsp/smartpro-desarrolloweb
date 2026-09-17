import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SITE } from "@/lib/site-content";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s | SmartPro",
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: "SmartPro Desarrollo Web",
    locale: SITE.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CL" className={manrope.variable}>
      <body className="min-h-dvh bg-sp-white font-sans text-sp-ink antialiased">
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-sp-ink focus:px-4 focus:py-2 focus:text-sp-white"
        >
          Saltar al contenido
        </a>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
