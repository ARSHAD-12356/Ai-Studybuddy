import React from "react";
import { PricingPlan } from "@/types/pricing";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface PricingCardProps {
  plan: PricingPlan;
  onClick?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onClick }) => {
  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-2xl border bg-card shadow-lg p-8 transition-transform hover:-translate-y-1 hover:shadow-2xl duration-200",
        plan.recommended && "border-2 border-primary scale-105 z-10"
      )}
    >
      {plan.recommended && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
          Recommended
        </span>
      )}
      <h3 className="text-xl font-bold mb-2 text-center">{plan.name}</h3>
      <div className="text-4xl font-extrabold text-center mb-4">{plan.price}</div>
      <ul className="mb-6 space-y-2">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-base">
            <Check className="w-4 h-4 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-pink-500 text-white font-semibold text-lg shadow hover:from-pink-500 hover:to-primary transition-colors duration-200"
        onClick={onClick}
      >
        {plan.ctaLabel}
      </Button>
    </div>
  );
};
