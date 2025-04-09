"use client";
import { useSectionStore } from '@/store/useSectionStore';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

export default function PromotionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find((s) => s._id === activeSectionId);
  });

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Promotions" />

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-dark dark:text-white">
              {activeSection?.titre}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gérez les promotions, les unités d'enseignement et les matières de votre section
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}