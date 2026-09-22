/**
 * Contenido editable de desarrolloweb.smartpro.cl
 *
 * Aquí solo va la identidad del sitio: marca, contacto, navegación y textos.
 *
 * Los planes, precios y proyectos NO se escriben aquí: se leen del catálogo de
 * SmartPro por la API (`lib/smartpro.ts` y `lib/catalog.ts`). Si un precio está
 * desactualizado, se corrige en el panel de SmartPro, no en este archivo.
 */

export const SITE = {
  name: "SmartPro",
  url: "https://desarrolloweb.smartpro.cl",
  parentUrl: "https://www.smartpro.cl",
  locale: "es_CL",
  title: "Diseño y desarrollo web en Chile | SmartPro",
  description:
    "Diseño web, desarrollo web, landing pages y sitios web en Chile. Proyectos modernos, rápidos y pensados para convertir.",
  keywords: [
    "diseño web",
    "desarrollo web",
    "landing page",
    "sitios web en Chile",
    "e-commerce Chile",
    "agencia desarrollo web",
    "SmartPro",
  ],
} as const;

export const CONTACT = {
  email: "contacto@smartpro.cl",
  phoneLabel: "+56 9 4977 3707",
  phoneHref: "tel:+56949773707",
  whatsappNumber: "56949773707",
  whatsappMessage:
    "Hola SmartPro, quiero conversar sobre un proyecto de desarrollo web.",
  calendlyUrl: "https://calendly.com/agencia-smartpro/online",
  addresses: [
    {
      label: "Santa Elena 941 B, Santiago",
      href: "https://www.google.com/maps/search/?api=1&query=Santa+Elena+941+B+Santiago+Chile",
    },
    {
      label: "Vicuña Mackenna 920, of. 726, Ñuñoa",
      href: "https://www.google.com/maps/search/?api=1&query=Vicuna+Mackenna+920+Nunoa+Chile",
    },
  ],
  privacyUrl: "https://www.smartpro.cl/politica-privacidad",
} as const;

export const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/smartpro.chile/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/smart-pro-chile/" },
  { label: "Facebook", href: "https://www.facebook.com/people/TuPromesacl/61568563559545/" },
  { label: "YouTube", href: "https://www.youtube.com/@SmartPro-l3l" },
  { label: "X", href: "https://x.com/smartpro2025" },
] as const;

export const NAV = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Planes", href: "/#soluciones" },
  { label: "Portafolio", href: "/#portafolio" },
  { label: "Contacto", href: "/#contacto" },
] as const;

export const LOGOS = {
  header: "/images/logo/logo-smartpro-01.png",
  footer: "/images/logo/logo-smartpro-full.png",
  webpay: "/images/logo/webpay-plus.png",
  mercadoPago: "/images/logo/logo-mercado-pago.png",
} as const;

export const METRICS = [
  { value: "+200", label: "Proyectos entregados" },
  { value: "100%", label: "Diseño responsive" },
  { value: "SEO", label: "Optimizado para Google" },
] as const;

export const HERO = {
  image: "/images/hero/hero-desktop.webp",
  imageAlt: "",
} as const;

export function getWhatsAppUrl(message?: string) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message ?? CONTACT.whatsappMessage)}`;
}
