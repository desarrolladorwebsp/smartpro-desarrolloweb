/**
 * Contenido editable de desarrolloweb.smartpro.cl
 *
 * Precios, features y condiciones salen del catálogo público de SmartPro.cl
 * (public/js/plans.js del sitio principal). No inventes datos aquí.
 *
 * Campos con `unpublished: true` no aparecen publicados en SmartPro.cl.
 * Completa el `label` cuando tengas el dato real.
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

export type UnpublishedField = {
  unpublished: true;
  label: string;
};

export type WebPlan = {
  id: string;
  name: string;
  category: "Landing Page" | "Website" | "E-commerce";
  price: string;
  pricePrefix: string;
  tax: string;
  highlighted: boolean;
  badge: string | null;
  note: string;
  sectionsOrPages: string;
  integrations: string;
  seo: string;
  support: string;
  extras: string[];
  responsive: UnpublishedField;
  delivery: UnpublishedField;
};

const UNPUBLISHED_RESPONSIVE: UnpublishedField = {
  unpublished: true,
  label: "Consultar",
};

const UNPUBLISHED_DELIVERY: UnpublishedField = {
  unpublished: true,
  label: "A coordinar",
};

export const WEB_PLANS: WebPlan[] = [
  {
    id: "landing-start",
    name: "Landing Page Start",
    category: "Landing Page",
    price: "$199.990",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su presencia digital.",
    sectionsOrPages: "Hasta 5 secciones",
    integrations: "Hasta 2 integraciones",
    seo: "No publicado",
    support: "No publicado",
    extras: [
      "Diseño personalizado",
      "Botones RRSS",
      "Formulario de contacto",
      "Optimización básica de conversión",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "landing-pro",
    name: "Landing Page Pro",
    category: "Landing Page",
    price: "$299.990",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: true,
    badge: "Más contratado",
    note: "Ideal para emprendimientos que inician su presencia digital.",
    sectionsOrPages: "Hasta 10 secciones",
    integrations: "Hasta 4 integraciones",
    seo: "Optimización básica SEO para Google",
    support: "Soporte técnico y mantención incluida",
    extras: [
      "Dominio profesional (.cl o .com)",
      "Hosting rápido y seguro (12 meses)",
      "Diseño web enfocado en captar clientes",
      "Landing page optimizada para generar contactos",
      "Botón directo a WhatsApp",
      "Formulario de contacto con captación de leads",
      "Integración con redes sociales",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "website-start",
    name: "Website Start",
    category: "Website",
    price: "$349.990",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su presencia digital.",
    sectionsOrPages: "Hasta 5 páginas",
    integrations: "Hasta 3 integraciones",
    seo: "Optimización básica SEO para Google",
    support: "No publicado",
    extras: [
      "Dominio .cl o .com",
      "Hosting profesional (12 meses)",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "website-pro",
    name: "Website Pro",
    category: "Website",
    price: "$549.990",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su presencia digital.",
    sectionsOrPages: "Hasta 10 páginas",
    integrations: "Hasta 4 integraciones",
    seo: "Optimización básica SEO para Google",
    support: "Servicio técnico y mantención anual",
    extras: [
      "Dominio .cl o .com",
      "Hosting profesional (12 meses)",
      "Correos corporativos",
      "Landing Page estratégica",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "website-max",
    name: "Website Max",
    category: "Website",
    price: "$849.990",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su presencia digital.",
    sectionsOrPages: "Hasta 15 páginas",
    integrations: "Hasta 6 integraciones",
    seo: "Optimización básica SEO para Google",
    support: "Servicio técnico y mantención anual",
    extras: [
      "Dominio .cl o .com",
      "Hosting profesional (12 meses)",
      "Correos corporativos",
      "Landing Page estratégica",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "website-elite",
    name: "Website Elite",
    category: "Website",
    price: "$1.249.990",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su presencia digital.",
    sectionsOrPages: "Hasta 20 páginas",
    integrations: "Hasta 8 integraciones",
    seo: "Optimización básica SEO para Google",
    support: "Servicio técnico y mantención anual",
    extras: [
      "Dominio .cl o .com",
      "Hosting profesional (12 meses)",
      "Correos corporativos",
      "Landing Page estratégica",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "website-corp",
    name: "Website Corporativo",
    category: "Website",
    price: "$1.349.990",
    pricePrefix: "desde",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Proyectos corporativos con alcance personalizado según cotización.",
    sectionsOrPages: "Desde 21 páginas",
    integrations: "Hasta 10 integraciones",
    seo: "Optimización básica SEO para Google",
    support: "Servicio técnico y mantención anual",
    extras: [
      "Dominio .cl o .com",
      "Hosting profesional (12 meses)",
      "Correos corporativos",
      "Landing Page estratégica",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "ecom-start",
    name: "E-commerce Start",
    category: "E-commerce",
    price: "$349.990",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su tienda online.",
    sectionsOrPages: "Hasta 3 páginas o vistas",
    integrations: "Hasta 3 integraciones",
    seo: "No publicado",
    support: "No publicado",
    extras: [
      "Carga inicial: 20 productos",
      "Capacidad hasta 30 productos",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
      "Carro de compras",
      "Pasarela de pagos",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "ecom-pro",
    name: "E-commerce Pro",
    category: "E-commerce",
    price: "$590.000",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su tienda online.",
    sectionsOrPages: "Hasta 4 páginas o vistas",
    integrations: "Hasta 4 integraciones",
    seo: "No publicado",
    support: "No publicado",
    extras: [
      "Carga inicial: 25 productos",
      "Hasta 60 productos",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
      "Carro de compras",
      "Pasarela de pagos",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "ecom-max",
    name: "E-commerce Max",
    category: "E-commerce",
    price: "$890.000",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su tienda online.",
    sectionsOrPages: "Hasta 5 páginas o vistas",
    integrations: "Hasta 6 integraciones",
    seo: "No publicado",
    support: "No publicado",
    extras: [
      "Carga inicial: 30 productos",
      "Hasta 90 productos",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
      "Carro de compras",
      "Pasarela de pagos",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "ecom-elite",
    name: "E-commerce Elite",
    category: "E-commerce",
    price: "$1.290.000",
    pricePrefix: "",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Ideal para emprendimientos que inician su tienda online.",
    sectionsOrPages: "Hasta 6 páginas o vistas",
    integrations: "Hasta 8 integraciones",
    seo: "No publicado",
    support: "No publicado",
    extras: [
      "Carga inicial: 40 productos",
      "Hasta 100 productos",
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
      "Carro de compras",
      "Pasarela de pagos",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
  {
    id: "ecom-corp",
    name: "E-commerce Corporativo",
    category: "E-commerce",
    price: "$1.390.000",
    pricePrefix: "desde",
    tax: "+ IVA",
    highlighted: false,
    badge: null,
    note: "Límites de páginas, productos e integraciones configurables según cotización.",
    sectionsOrPages: "Según cotización",
    integrations: "Según cotización",
    seo: "No publicado",
    support: "No publicado",
    extras: [
      "Diseño 100% personalizado",
      "Botones a RRSS y WhatsApp",
      "Formulario de contacto integrado",
      "Carro de compras",
      "Pasarela de pagos",
    ],
    responsive: UNPUBLISHED_RESPONSIVE,
    delivery: UNPUBLISHED_DELIVERY,
  },
];

export const SOLUTIONS = [
  {
    id: "landing",
    name: "Landing Page",
    recommended: true,
    description:
      "Una página enfocada en presentar una oferta y convertir visitas en consultas. Ideal para campañas, lanzamientos o un servicio específico.",
    benefits: [
      "Hasta 5 o 10 secciones según el plan",
      "Formulario de contacto y botones a redes",
      "Optimización básica de conversión",
    ],
    priceFrom: "$199.990",
    tax: "+ IVA",
    condition: "Landing Page Start. Landing Page Pro: $299.990 + IVA.",
    cta: "Ver planes de landing",
    href: "/#soluciones",
  },
  {
    id: "website",
    name: "Sitio Web Corporativo",
    recommended: false,
    description:
      "Un sitio con varias páginas para presentar tu empresa, organizar tus servicios y facilitar que tus clientes te contacten.",
    benefits: [
      "Desde 5 páginas. Corporativo desde 21 páginas",
      "Dominio y hosting profesional por 12 meses",
      "SEO básico y formulario de contacto",
    ],
    priceFrom: "$349.990",
    tax: "+ IVA",
    condition: "Website Start. Website Corporativo desde $1.349.990 + IVA.",
    cta: "Ver planes de sitio",
    href: "/#soluciones",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    recommended: false,
    description:
      "Tienda online con catálogo, carro de compras y pasarela de pagos para vender con una experiencia clara y responsiva.",
    benefits: [
      "Carro de compras y pasarela de pagos",
      "Carga inicial de productos según plan",
      "Diseño 100% personalizado",
    ],
    priceFrom: "$349.990",
    tax: "+ IVA",
    condition: "E-commerce Start. Corporativo desde $1.390.000 + IVA.",
    cta: "Ver planes de tienda",
    href: "/#soluciones",
  },
] as const;

export const PORTFOLIO = [
  {
    id: "tu-promesa",
    name: "Tu Promesa",
    category: "Landing Page",
    description:
      "Landing para visibilizar incumplimientos inmobiliarios y denunciar casos. Next.js, SEO y formularios de alta conversión.",
    image: "/images/portfolio/tu-promesa.png",
    url: "https://www.tupromesa.cl",
  },
  {
    id: "hotel-casa-paraiso",
    name: "Hotel Casa Paraíso",
    category: "Sitio web corporativo",
    description:
      "Sitio hotelero con sedes, habitaciones y consulta de reservas. Next.js, SEO local y diseño responsivo orientado a conversión.",
    image: "/images/portfolio/hotel-casa-paraiso.png",
    url: "https://casaparaisohotel.cl",
  },
  {
    id: "realstock",
    name: "RealStock",
    category: "E-commerce",
    description:
      "E-commerce de catálogo para gestionar y vender productos en línea. Next.js, Prisma y experiencia de compra responsiva.",
    image: "/images/portfolio/real-stock.png",
    url: "https://www.realstock.cl",
  },
  {
    id: "experto-en-salud",
    name: "Experto en Salud",
    category: "Servicios profesionales",
    description:
      "Landing de asesoría en Isapres con cotización y agendamiento. Next.js, SEO y experiencia mobile-first para convertir consultas.",
    image: "/images/portfolio/experto-en-salud.png",
    url: "https://expertoensalud.cl",
  },
] as const;

export const HERO = {
  image: "/images/hero/hero-desktop.webp",
  imageAlt: "",
} as const;

export function getWhatsAppUrl(message?: string) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message ?? CONTACT.whatsappMessage)}`;
}

export function formatPlanPrice(plan: WebPlan) {
  return plan.pricePrefix ? `${plan.pricePrefix} ${plan.price}` : plan.price;
}
