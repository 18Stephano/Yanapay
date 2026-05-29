export type RatingDimension =
  | "legalidadRegistro"
  | "transparenciaFinanciera"
  | "gobernanzaRendicion"
  | "impactoEfectividad"
  | "culturaReputacion";

export type ConfidenceLevel = "high" | "medium" | "low";

export type RatingStatus = "draft" | "reviewed" | "published";

export type DimensionScore = {
  score: number;
  maxScore: number;
  summary: string;
  confidence: ConfidenceLevel;
};

export type RatingBreakdown = Record<RatingDimension, number>;

export type RatingEvidence = {
  dimension: RatingDimension;
  sourceTitle: string;
  sourceUrl: string;
  finding: string;
  confidence: ConfidenceLevel;
};

export type YanapayRating = {
  overallScore: number;
  confidence: ConfidenceLevel;
  summary: string;
  status: RatingStatus;
  dimensions: Record<RatingDimension, DimensionScore>;
  evidence: RatingEvidence[];
  missingInformation: string[];
  redFlags: string[];
  reviewedAt?: string;
};

export type Charity = {
  slug: string;
  name: string;
  tagline: string;
  mission: string;
  location: string;
  region: string;
  categories: string[];
  founded: number;
  website: string;
  supportUrl: string;
  contactEmail: string;
  verified: boolean;
  rating: YanapayRating;
  highlights: string[];
  evidence: string[];
};

export type ProjectMilestone = {
  title: string;
  status: "completed" | "in_progress" | "planned";
};

export type EntrepreneurshipProject = {
  slug: string;
  title: string;
  tagline: string;
  story: string;
  founder: string;
  team: string;
  region: string;
  location: string;
  categories: string[];
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  status: "active" | "funded" | "coming_soon";
  milestones: ProjectMilestone[];
  supportUrl: string;
};

export type CharityResearchRequest = {
  id: string;
  charityName: string;
  website?: string;
  ruc?: string;
  notes?: string;
  status: "pending" | "running" | "complete" | "failed";
  createdAt: string;
};

export type DraftCharity = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  mission: string;
  location: string;
  region: string;
  categories: string[];
  founded: number;
  website: string;
  supportUrl: string;
  contactEmail: string;
  verified: boolean;
  highlights: string[];
  evidence: string[];
  researchRequestId?: string;
  status: "draft" | "approved" | "rejected";
};
