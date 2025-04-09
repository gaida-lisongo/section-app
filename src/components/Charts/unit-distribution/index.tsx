"use client";
import { cn } from "@/lib/utils";
import { standardFormat, formatWithDecimals } from "@/lib/utils";
import { usePromotionStore } from "@/store/usePromotionStore";
import { UnitDistributionChart } from "./chart";
import { useEffect } from "react";
import { useSectionStore } from "@/store/useSectionStore";
import type { Promotion } from '@/types/promotion';

type PropsType = {
  className?: string;
};

export function UnitDistribution({ className }: PropsType) {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });
  
  const { promotions, fetchPromotions } = usePromotionStore();

  useEffect(() => {
    if (activeSection?._id) {
      fetchPromotions(activeSection._id);
    }
  }, [activeSection, fetchPromotions]);

  const chartData = {
    categories: promotions.map(p => p.niveau),
    series: [
      {
        name: "Unités d'enseignement",
        data: promotions.map(p => p.unites?.length || 0)
      }
    ]
  };

  const totalUnites = promotions.reduce((acc, p) => acc + (p.unites?.length || 0), 0);
  const averageUnites = totalUnites / promotions.length || 0;

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Distribution des Unités
        </h2>
      </div>

      <UnitDistributionChart promotions={promotions} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {standardFormat(totalUnites)}
          </dt>
          <dd className="font-medium dark:text-dark-6">Total des Unités</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            {formatWithDecimals(averageUnites, 1)}
          </dt>
          <dd className="font-medium dark:text-dark-6">Moyenne par Promotion</dd>
        </div>
      </dl>
    </div>
  );
}