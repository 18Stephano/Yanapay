import { buildYanapayRating } from "@/lib/ratings";
import type { RatingDimension, YanapayRating } from "@/lib/types";

const sampleEvidence = (
  slug: string,
  dimension: RatingDimension,
  finding: string,
  sourceTitle: string,
) => ({
  dimension,
  sourceTitle,
  sourceUrl: `https://example.org/${slug}/evidence`,
  finding,
  confidence: "medium" as const,
});

export const charityRatingsBySlug: Record<string, YanapayRating> = {
  "kuska-educa": buildYanapayRating({
    breakdown: {
      legalidadRegistro: 13,
      transparenciaFinanciera: 20,
      gobernanzaRendicion: 16,
      impactoEfectividad: 21,
      culturaReputacion: 13,
    },
    confidence: "high",
    summary:
      "Organización con buena transparencia operativa y señales sólidas de impacto educativo en comunidades rurales.",
    reviewedAt: "2026-05-01",
    missingInformation: ["Auditoría externa completa no encontrada en fuentes públicas"],
    evidence: [
      sampleEvidence(
        "kuska-educa",
        "legalidadRegistro",
        "Perfil institucional y datos de contacto verificables en sitio web.",
        "Sitio web de la ONG",
      ),
      sampleEvidence(
        "kuska-educa",
        "impactoEfectividad",
        "Reporta mejoras en asistencia y rendimiento académico de estudiantes.",
        "Informe de actividades",
      ),
    ],
  }),
  "salud-en-ruta": buildYanapayRating({
    breakdown: {
      legalidadRegistro: 12,
      transparenciaFinanciera: 17,
      gobernanzaRendicion: 14,
      impactoEfectividad: 19,
      culturaReputacion: 12,
    },
    confidence: "medium",
    summary:
      "Buen desempeño en salud comunitaria, con oportunidades de mayor transparencia financiera pública.",
    reviewedAt: "2026-04-15",
    missingInformation: [
      "Estados financieros auditados no publicados",
      "Lista de directorio no visible en web",
    ],
    evidence: [
      sampleEvidence(
        "salud-en-ruta",
        "impactoEfectividad",
        "Reporta miles de tamizajes y seguimiento de pacientes de alto riesgo.",
        "Memoria de programas",
      ),
    ],
  }),
  "amazonia-viva": buildYanapayRating({
    breakdown: {
      legalidadRegistro: 10,
      transparenciaFinanciera: 14,
      gobernanzaRendicion: 11,
      impactoEfectividad: 17,
      culturaReputacion: 11,
    },
    confidence: "low",
    summary:
      "Impacto ambiental prometedor, pero con brechas importantes en verificación financiera y gobernanza pública.",
    reviewedAt: "2026-03-20",
    redFlags: ["Información financiera externa aún en revisión"],
    missingInformation: [
      "Verificación APCI pendiente en perfil público",
      "Auditoría externa no disponible",
    ],
    evidence: [
      sampleEvidence(
        "amazonia-viva",
        "impactoEfectividad",
        "Monitoreo comunitario de hectáreas forestales reportado.",
        "Informe de conservación",
      ),
    ],
  }),
  "manos-que-alimentan": buildYanapayRating({
    breakdown: {
      legalidadRegistro: 13,
      transparenciaFinanciera: 19,
      gobernanzaRendicion: 15,
      impactoEfectividad: 16,
      culturaReputacion: 14,
    },
    confidence: "medium",
    summary:
      "Fuerte operación en seguridad alimentaria con buena transparencia operativa; impacto nutricional aún en medición.",
    reviewedAt: "2026-05-10",
    missingInformation: ["Métricas de outcomes nutricionales en progreso"],
    evidence: [
      sampleEvidence(
        "manos-que-alimentan",
        "transparenciaFinanciera",
        "Publica totales mensuales de comidas distribuidas.",
        "Reporte operativo",
      ),
    ],
  }),
};
