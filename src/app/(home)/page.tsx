import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { RegionLabels } from "./_components/region-labels";
import { UnitDistribution } from "@/components/Charts/unit-distribution";
import { CommandesList } from "@/components/Tables/commandes-list";
import { RetraitsCard } from "./_components/chats-card";
import { OverviewCardsGroup } from "./_components/overview-cards";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <UnitDistribution
          className="col-span-12 xl:col-span-12"
        />


        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <CommandesList className="col-span-12" />
          </Suspense>
        </div>

        {/* <Suspense fallback={null}>
          <ChatsCard />
        </Suspense> */}

        <Suspense fallback={null}>
          <RetraitsCard />
        </Suspense>
      </div>
    </>
  );
}
