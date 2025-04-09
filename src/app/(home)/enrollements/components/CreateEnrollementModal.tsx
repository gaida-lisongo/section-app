import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { usePromotionStore } from '@/store/usePromotionStore';
import { useSectionStore } from '@/store/useSectionStore';
import { toast } from 'react-hot-toast';

interface CreateEnrollementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function CreateEnrollementModal({
  isOpen,
  onClose,
  onSave
}: CreateEnrollementModalProps) {
  const { promotions, fetchPromotions } = usePromotionStore();
  const { activeSectionId } = useSectionStore();
  console.log("Active section ID:", activeSectionId);
  const [formData, setFormData] = useState({
    promotionId: '',
    designation: '',
    montant: 0,
    description: '',
    date_fin: ''
  });

  useEffect(() => {
    if (isOpen && activeSectionId) {
      fetchPromotions(activeSectionId);
    }
  }, [isOpen, activeSectionId, fetchPromotions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSectionId) {
      toast.error("Aucune section active sélectionnée");
      return;
    }

    try {
      await onSave({
        ...formData,
        sectionId: activeSectionId
      });
      setFormData({
        promotionId: '',
        designation: '',
        montant: 0,
        description: '',
        date_fin: ''
      });
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la création de l'enrollement");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="p-6">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faGraduationCap} className="text-primary" />
              Nouvel Enrollement
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Promotion
                </label>
                <select
                  value={formData.promotionId}
                  onChange={(e) => setFormData(prev => ({ ...prev, promotionId: e.target.value }))}
                  className="mt-1 block w-full rounded-md border dark:border-gray-600 py-2 px-3"
                  required
                >
                  <option value="">Sélectionnez une promotion</option>
                  {promotions.map(promotion => (
                    <option key={promotion._id} value={promotion._id}>
                      {promotion.niveau} - {promotion.mention}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Désignation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className="mt-1 block w-full rounded-md border dark:border-gray-600 py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Montant
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.montant}
                  onChange={(e) => setFormData(prev => ({ ...prev, montant: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border dark:border-gray-600 py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.date_fin}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_fin: e.target.value }))}
                  className="mt-1 block w-full rounded-md border dark:border-gray-600 py-2 px-3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border dark:border-gray-600 py-2 px-3"
                  rows={3}
                />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}