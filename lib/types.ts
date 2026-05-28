export type RatingDimension =
  | "transparency"
  | "financialHealth"
  | "accountability"
  | "impactEvidence"
  | "communityTrust";

export type RatingBreakdown = Record<RatingDimension, number>;

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
  rating: RatingBreakdown;
  highlights: string[];
  evidence: string[];
};
