/**
 * Carga del catálogo para las páginas públicas.
 *
 * Si SmartPro no responde, la página no debe caerse: se registra el problema y
 * la sección afectada queda vacía. Un sitio sin planes es malo; un sitio con
 * error 500 es peor, y el resto del contenido sigue sirviendo para convertir.
 *
 * El checkout NO usa estas funciones: ahí un fallo debe verse como fallo, no
 * como "el plan no existe".
 */

import { mapProjects, mapSolutions, type WebProject, type WebSolution } from "@/lib/catalog";
import { getCatalog, listPortfolio } from "@/lib/smartpro";

export async function loadSolutions(): Promise<WebSolution[]> {
  try {
    return mapSolutions(await getCatalog());
  } catch (error) {
    console.error("[smartpro] No se pudo cargar el catálogo:", error);
    return [];
  }
}

export async function loadPortfolio(): Promise<WebProject[]> {
  try {
    return mapProjects(await listPortfolio());
  } catch (error) {
    console.error("[smartpro] No se pudo cargar el portafolio:", error);
    return [];
  }
}
