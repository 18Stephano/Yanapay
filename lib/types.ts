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
