import { useEffect } from 'react';
import { usePromotionStore } from '@/store/usePromotionStore';
import { useSectionStore } from '@/store/useSectionStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner';

interface PromotionSelectorProps {
  onSelectPromotion: (promotionId: string) => void;
  selectedPromotionId: string | null;
}

export default function PromotionSelector({ onSelectPromotion, selectedPromotionId }: PromotionSelectorProps) {
  const { promotions, loading, fetchPromotions } = usePromotionStore();
  const { activeSectionId } = useSectionStore();

  useEffect(() => {
    if (activeSectionId) {
      fetchPromotions(activeSectionId);
    }
  }, [activeSectionId, fetchPromotions]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faGraduationCap} className="text-primary" />
        Sélectionner une promotion
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promotion) => (
          <button
            key={promotion._id}
            onClick={() => onSelectPromotion(promotion._id)}
            className={`p-4 rounded-lg transition-all ${
              selectedPromotionId === promotion._id
                ? 'bg-primary text-white'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <p className="font-medium">{promotion.description}</p>
            <p className="text-sm opacity-75">{promotion.niveau}</p>
          </button>
        ))}
      </div>
    </div>
  );
}