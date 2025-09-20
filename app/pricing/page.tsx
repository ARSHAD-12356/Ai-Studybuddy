"use client";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingPlan } from "@/types/pricing";
import { useRouter } from "next/navigation";

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0/mo",
    features: [
      "Upload 1 PDF",
      "Limited Q&A",
      "No analytics",
    ],
    ctaLabel: "Get Started",
  },
  {
    name: "Pro",
    price: "$5/mo",
    features: [
      "Unlimited uploads",
      "AI Q&A",
      "Progress tracking",
      "Flashcards",
    ],
    recommended: true,
    ctaLabel: "Go Pro",
  },
  {
    name: "Premium",
    price: "$10/mo",
    features: [
      "All Pro features",
      "Group study mode",
      "AI video generator",
    ],
    ctaLabel: "Go Premium",
  },
];

export default function PricingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-pink-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-2">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">Upgrade to unlock unlimited learning power</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            onClick={() => router.push("/auth/signup?plan=" + plan.name.toLowerCase())}
          />
        ))}
      </div>
    </div>
  );
}
