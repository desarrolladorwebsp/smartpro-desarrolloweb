import { MessageCircle } from "lucide-react";

import { getWhatsAppUrl } from "@/lib/site-content";

export function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir a SmartPro por WhatsApp"
      className="fixed bottom-5 right-5 z-[30] inline-flex h-14 w-14 items-center justify-center rounded-full bg-sp-success text-sp-white shadow-sp-card transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-success focus-visible:ring-offset-2 active:scale-95"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </a>
  );
}
