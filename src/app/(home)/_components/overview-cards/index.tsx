"use client";
import { useState, useEffect } from "react";
import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { usePromotionStore } from "@/store/usePromotionStore";
import { useSectionStore } from "@/store/useSectionStore";
import type { Promotion, Unite } from "@/types/promotion";

interface Metrics {
  promotions: number;
  unites: number;
  matieres: number;
}

export function OverviewCards() {
  const [metrics, setMetrics] = useState<Metrics>({
    promotions: 0,
    unites: 0,
    matieres: 0,
  });

  const promotions = usePromotionStore((state) => state.promotions);

  useEffect(() => {
    if (!promotions.length) return;

    // Calcul du nombre total d'unités avec null check
    const totalUnites = promotions.reduce(
      (acc, promotion) => acc + (promotion.unites?.length || 0),
      0
    );

    // Calcul du nombre total de matières avec null checks à chaque niveau
    const totalMatieres = promotions.reduce((acc, promotion) => {
      const uniteMatieres =
        promotion.unites?.reduce((sum, unite) => {
          const matieresCount = unite.matieres?.length || 0;
          return sum + matieresCount;
        }, 0) || 0;
      return acc + uniteMatieres;
    }, 0);

    setMetrics({
      promotions: promotions.length,
      unites: totalUnites,
      matieres: totalMatieres,
    });
  }, [promotions]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Promotions"
        data={{
          value: compactFormat(metrics.promotions),
          growthRate: 0,
          trending: "up",
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Unités"
        data={{
          value: compactFormat(metrics.unites),
          growthRate: 0,
          trending: "up",
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Matières"
        data={{
          value: compactFormat(metrics.matieres),
          growthRate: (metrics.matieres / metrics.unites) || 0,
          trending: "up",
        }}
        Icon={icons.Profit}
      />
    </div>
  );
}
