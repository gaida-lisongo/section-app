"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface BannerProps {
  count: number;
  onAdd: () => void;
}

export function PromotionsBanner({ count, onAdd }: BannerProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("/images/banner/promotions-banner.jpg")',
          filter: 'brightness(0.7)'
        }}
      />
      
      <div className="relative z-10 px-6 py-8 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Promotions
            </h1>
            <p className="mt-1 text-lg text-gray-200">
              {count} promotion{count > 1 ? 's' : ''} active{count > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nouvelle Promotion
          </button>
        </div>
      </div>
    </div>
  );
}