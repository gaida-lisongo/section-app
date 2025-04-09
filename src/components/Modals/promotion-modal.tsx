"use client";
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PromotionInput, Promotion } from '@/types/promotion';
import { useSectionStore } from '@/store/useSectionStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromotionInput) => Promise<void>;
  promotion: Promotion | null; // Changed from undefined to null
}

export function PromotionModal({ isOpen, onClose, onSubmit, promotion }: Props) {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });

  const [form, setForm] = useState<PromotionInput>({
    sectionId: activeSection?._id || '',
    niveau: '',
    mention: '',
    orientation: '',
    description: '' // Ajout du champ description
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promotion) {
      setForm({
        sectionId: promotion.sectionId,
        niveau: promotion.niveau,
        mention: promotion.mention || '',
        orientation: promotion.orientation || '',
        description: promotion.description || ''
      });
    } else {
      setForm({
        sectionId: activeSection?._id || '',
        niveau: '',
        mention: '',
        orientation: '',
        description: ''
      });
    }
  }, [promotion, activeSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {promotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Niveau
              </label>
              <input
                type="text"
                value={form.niveau}
                onChange={e => setForm(prev => ({ ...prev, niveau: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mention
              </label>
              <input
                type="text"
                value={form.mention}
                onChange={e => setForm(prev => ({ ...prev, mention: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Orientation
              </label>
              <input
                type="text"
                value={form.orientation}
                onChange={e => setForm(prev => ({ ...prev, orientation: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            {/* Ajout du champ description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3 min-h-[100px] resize-y"
                placeholder="Description de la promotion..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-70 hover:bg-primary/90"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : promotion ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}