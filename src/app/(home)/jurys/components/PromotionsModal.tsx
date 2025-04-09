import { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { usePromotionStore } from '@/store/usePromotionStore';
import { useSectionStore } from '@/store/useSectionStore';
import { toast } from 'react-hot-toast';

interface Promotion {
  _id: string;
  description: string;
  niveau: string;
  mention?: string;
  orientation?: string;
  statut: 'ACTIF' | 'INACTIF';
}

interface PromotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jury: any;
  onSave: (promotions: string[]) => Promise<void>;
}

export default function PromotionsModal({ isOpen, onClose, jury, onSave }: PromotionsModalProps) {
  const { promotions, loading, fetchPromotions } = usePromotionStore();
  const { activeSectionId } = useSectionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);
  const [data, setData] = useState<Promotion[]>([]);

  const fetchPromotionsCallback = useCallback(() => {
    if (activeSectionId) {
      fetchPromotions(activeSectionId);
    }
  }, [activeSectionId, fetchPromotions]);

  useEffect(() => {
    if (isOpen) {
      fetchPromotionsCallback();
    }
  }, [isOpen, fetchPromotionsCallback]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPromotions(jury.promotions || []);
    }
  }, [isOpen, jury]);

  useEffect(() => {
    const selectedData = filteredPromotions.filter(promotion => 
      selectedPromotions.includes(promotion._id)
    );
    setData(selectedData);
  }, [selectedPromotions, promotions, searchQuery]);

  const handleTogglePromotion = (promotionId: string) => {
    setSelectedPromotions(prev => {
      if (prev.includes(promotionId)) {
        return prev.filter(id => id !== promotionId);
      }
      return [...prev, promotionId];
    });
  };

  const handleSave = async () => {
    try {
      await onSave(selectedPromotions);
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const filteredPromotions = promotions.filter(promotion =>
    promotion.niveau.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="p-6">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faUserGraduate} className="text-primary" />
              Gestion des promotions
            </Dialog.Title>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Rechercher une promotion..."
                className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liste des promotions disponibles */}
              <div className="space-y-4">
                <h3 className="font-medium">Promotions disponibles</h3>
                <div className="h-[400px] overflow-y-auto space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary" />
                    </div>
                  ) : (
                    filteredPromotions
                      .filter(p => !selectedPromotions.includes(p._id))
                      .map(promotion => (
                        <div
                          key={promotion._id}
                          onClick={() => handleTogglePromotion(promotion._id)}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 
                                   dark:hover:bg-gray-600 cursor-pointer transition-all"
                        >
                          <p className="font-medium">{promotion.description}</p>
                          <p className="text-sm text-gray-500">{promotion.niveau}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Promotions sélectionnées */}
              <div className="space-y-4">
                <h3 className="font-medium">Promotions assignées</h3>
                <div className="h-[400px] overflow-y-auto space-y-2">
                  {data.map((promotion: Promotion) => (
                    <div
                      key={promotion._id}
                      className="p-4 bg-primary/5 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{promotion.description}</p>
                          <p className="text-sm text-gray-500">{promotion.niveau}</p>
                        </div>
                        <button
                          onClick={() => handleTogglePromotion(promotion._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}