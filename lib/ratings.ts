import type { RatingBreakdown, RatingDimension } from "@/lib/types";

export const ratingLabels: Record<RatingDimension, string> = {
  transparency: "Transparency",
  financialHealth: "Financial health",
  accountability: "Governance and accountability",
  impactEvidence: "Impact evidence",
  communityTrust: "Community trust",
};

export const ratingDescriptions: Record<RatingDimension, string> = {
  transparency: "Public reporting, leadership visibility, and clear program information.",
  financialHealth: "Responsible use of funding and basic sustainability signals.",
  accountability: "Board oversight, policies, and operational discipline.",
  impactEvidence: "Evidence that programs produce measurable outcomes.",
  communityTrust: "Local reputation, consistency, and beneficiary trust.",
};

export function calculateOverallScore(rating: RatingBreakdown) {
  const values = Object.values(rating);
  return Math.round(values.reduce((total, score) => total + score, 0) / values.length);
}

export function getRatingLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Promising";
  if (score >= 60) return "Developing";
  return "Needs review";
}

export function getRatingTone(score: number) {
  if (score >= 85) return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (score >= 70) return "bg-sky-100 text-sky-800 ring-sky-200";
  if (score >= 60) return "bg-amber-100 text-amber-800 ring-amber-200";
  return "bg-rose-100 text-rose-800 ring-rose-200";
}
