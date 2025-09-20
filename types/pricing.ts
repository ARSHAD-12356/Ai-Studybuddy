export type PricingPlan = {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
  ctaLabel: string;
};
