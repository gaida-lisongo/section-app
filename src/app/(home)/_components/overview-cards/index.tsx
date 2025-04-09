"use client";
import { useEffect, useState } from "react";
import { compactFormat } from "@/lib/format-number";
import * as icons from "./icons";
import { usePromotionStore } from "@/store/usePromotionStore";
import { useSectionStore } from "@/store/useSectionStore";
import { OverviewCard } from "./card";

export function OverviewCardsGroup() {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });
  
  const { promotions, fetchPromotions } = usePromotionStore();
  const [metrics, setMetrics] = useState({
    totalPromotions: 0,
    activePromotions: 0,
    totalUnites: 0,
    totalMatieres: 0,
  });

  useEffect(() => {
    if (activeSection?._id) {
      fetchPromotions(activeSection._id);
    }
  }, [activeSection]);

  useEffect(() => {
    const calculateMetrics = () => {
      const activePromotions = promotions.filter(p => p.statut === 'ACTIF').length;
      const totalUnites = promotions.reduce((acc, p) => acc + (p.unites?.length || 0), 0);
      const totalMatieres = promotions.reduce((acc, p) => {
        return acc + (p.unites ?? []).reduce((sum, u) => sum + (u.matieres?.length || 0), 0);
      }, 0);

      setMetrics({
        totalPromotions: promotions.length,
        activePromotions,
        totalUnites,
        totalMatieres,
      });
    };

    calculateMetrics();
  }, [promotions]);
  console.log("Metrics: ", metrics);
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Promotions"
        data={{
          value: compactFormat(metrics.totalPromotions),
          growthRate: 0,
          trending: "up",
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Promotions Actives"
        data={{
          value: compactFormat(metrics.activePromotions),
          growthRate: (metrics.activePromotions / metrics.totalPromotions) * 100,
          trending: "up",
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Total Unités"
        data={{
          value: compactFormat(metrics.totalUnites),
          growthRate: 0,
          trending: "up",
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Matières"
        data={{
          value: compactFormat(metrics.totalMatieres),
          growthRate: (metrics.totalMatieres / metrics.totalUnites) || 0,
          trending: "up",
        }}
        Icon={icons.Profit}
      />
    </div>
  );
}
