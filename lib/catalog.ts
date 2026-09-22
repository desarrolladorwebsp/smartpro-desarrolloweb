/**
 * Traducción del catálogo de SmartPro al contenido que muestra este sitio.
 *
 * SmartPro entrega cada plan con una lista plana de prestaciones. Las tarjetas
 * de este sitio muestran cuatro de ellas en una ficha comparativa (secciones,
 * SEO, integraciones y soporte) y el resto como lista de beneficios, así que
 * aquí se reparten por su texto.
 *
 * Nada de esto inventa datos: si SmartPro no publica una prestación, la ficha
 * dice "No publicado" en lugar de rellenar con supuestos.
 */

import type { ApiPlan, ApiPortfolioProject, ApiService } from "@/lib/smartpro";

export const SERVICE_SLUG = "desarrollo-web";

const NOT_PUBLISHED = "No publicado";
const QUOTED = "Según cotización";

export type WebPlan = {
  /// Identificador del plan en SmartPro. Es lo que se envía al iniciar el pago.
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  /// Precio neto ya formateado, tal como lo publica SmartPro.
  price: string;
  pricePrefix: string;
  tax: string;
  /// Monto bruto que se cobra realmente en la pasarela.
  totalAmount: number;
  totalFormatted: string;
  highlighted: boolean;
  badge: string | null;
  note: string;
  sectionsOrPages: string;
  integrations: string;
  seo: string;
  support: string;
  extras: string[];
  /// `false` en los planes que se cotizan o que publican un precio "desde":
  /// su alcance se define conversando, no se cobran en línea.
  purchasable: boolean;
};

export type WebSolution = {
  id: string;
  name: string;
  recommended: boolean;
  description: string;
  priceFrom: string;
  tax: string;
  plans: WebPlan[];
};

export type WebProject = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  url: string;
};

/// Texto editorial de cada categoría. El precio y los planes salen del
/// catálogo; esto es solo cómo le contamos la solución al visitante.
/// Una categoría de SmartPro sin texto aquí no se muestra como solución.
const SOLUTION_COPY: Record<string, { name: string; recommended: boolean; description: string }> = {
  "landing-page": {
    name: "Landing Page",
    recommended: true,
    description:
      "Una página enfocada en presentar una oferta y convertir visitas en consultas. Ideal para campañas, lanzamientos o un servicio específico.",
  },
  website: {
    name: "Sitio Web Corporativo",
    recommended: false,
    description:
      "Un sitio con varias páginas para presentar tu empresa, organizar tus servicios y facilitar que tus clientes te contacten.",
  },
  "e-commerce": {
    name: "E-commerce",
    recommended: false,
    description:
      "Tienda online con catálogo, carro de compras y pasarela de pagos para vender con una experiencia clara y responsiva.",
  },
};

const SPEC_PATTERNS = {
  sectionsOrPages: /secciones|p[áa]ginas|vistas/i,
  integrations: /integraciones/i,
  seo: /\bseo\b/i,
  support: /soporte|mantenci[óo]n|servicio t[ée]cnico/i,
} as const;

export function mapPlan(plan: ApiPlan, category: { name: string; slug: string }): WebPlan {
  const remaining = [...plan.features];
  const byQuote = plan.price.quoteOnly || Boolean(plan.price.pricePrefix);
  /// En los planes de alcance abierto el dato no falta: se define al cotizar.
  const missing = byQuote ? QUOTED : NOT_PUBLISHED;

  const take = (pattern: RegExp): string => {
    const index = remaining.findIndex((feature) => pattern.test(feature));

    if (index === -1) {
      return missing;
    }

    return remaining.splice(index, 1)[0];
  };

  const sectionsOrPages = take(SPEC_PATTERNS.sectionsOrPages);
  const integrations = take(SPEC_PATTERNS.integrations);
  const seo = take(SPEC_PATTERNS.seo);
  const support = take(SPEC_PATTERNS.support);

  return {
    id: plan.id,
    name: plan.name,
    category: category.name,
    categorySlug: category.slug,
    price: plan.price.net.formatted,
    pricePrefix: plan.price.pricePrefix,
    tax: plan.price.taxLabel,
    totalAmount: plan.price.gross.amount,
    totalFormatted: plan.price.gross.formatted,
    highlighted: plan.highlighted,
    badge: plan.badge ? normalizeBadge(plan.badge) : null,
    note: plan.note,
    sectionsOrPages,
    integrations,
    seo,
    support,
    extras: remaining,
    purchasable: !byQuote && plan.price.gross.amount > 0,
  };
}

/// SmartPro publica los destacados con adornos ("★ MÁS CONTRATADO") que en este
/// sitio se ven fuera de lugar dentro de la píldora de la tarjeta.
function normalizeBadge(badge: string): string {
  const clean = badge.replace(/[★⭐🔥]/g, "").trim();

  if (!clean) {
    return badge.trim();
  }

  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

export function mapSolutions(services: ApiService[]): WebSolution[] {
  const service = services.find((item) => item.slug === SERVICE_SLUG) ?? services[0];

  if (!service) {
    return [];
  }

  return service.categories
    .map((category) => {
      const copy = SOLUTION_COPY[category.slug];
      const plans = category.plans.map((plan) => mapPlan(plan, category));

      if (!copy || plans.length === 0) {
        return null;
      }

      const cheapest = plans.reduce((lowest, plan) => (plan.totalAmount < lowest.totalAmount ? plan : lowest));

      return {
        id: category.slug,
        name: copy.name,
        recommended: copy.recommended,
        description: copy.description,
        priceFrom: cheapest.price,
        tax: cheapest.tax,
        plans,
      } satisfies WebSolution;
    })
    .filter((solution): solution is WebSolution => solution !== null);
}

export function mapProjects(projects: ApiPortfolioProject[]): WebProject[] {
  return projects.map((project) => ({
    id: project.id,
    name: project.title,
    category: project.category.name || project.service.name,
    description: project.summary,
    image: project.image,
    url: project.url,
  }));
}

export function formatPlanPrice(plan: WebPlan): string {
  return plan.pricePrefix ? `${plan.pricePrefix} ${plan.price}` : plan.price;
}

export function findPlan(solutions: WebSolution[], planId: string): WebPlan | null {
  for (const solution of solutions) {
    const plan = solution.plans.find((item) => item.id === planId);

    if (plan) {
      return plan;
    }
  }

  return null;
}
