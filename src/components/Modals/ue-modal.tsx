"use client";
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

interface UE {
  _id: string;
  code: string;
  designation: string;
  categorie: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<UE, '_id'>) => Promise<void>;
  ue?: UE | null;
  promotionId: string;
}

export function UEModal({ isOpen, onClose, onSubmit, ue, promotionId }: Props) {
  const [form, setForm] = useState({
    code: '',
    designation: '',
    categorie: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ue) {
      setForm({
        code: ue.code,
        designation: ue.designation,
        categorie: ue.categorie
      });
    } else {
      setForm({
        code: '',
        designation: '',
        categorie: ''
      });
    }
  }, [ue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // S'assurer que tous les champs sont présents
      const submitData = {
        code: form.code.trim(),
        designation: form.designation.trim(),
        categorie: form.categorie
      };

      // Vérifier que tous les champs requis sont remplis
      if (!submitData.code || !submitData.designation || !submitData.categorie) {
        throw new Error('Tous les champs sont obligatoires');
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
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
            {ue ? 'Modifier l\'unité d\'enseignement' : 'Nouvelle unité d\'enseignement'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code
              </label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Désignation
              </label>
              <input
                type="text"
                value={form.designation}
                onChange={e => setForm(prev => ({ ...prev, designation: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                value={form.categorie}
                onChange={e => setForm(prev => ({ ...prev, categorie: e.target.value }))}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="A">Fondamentale</option>
                <option value="B">Complémentaire</option>
                <option value="C">Méthodologie</option>
                <option value="D">Transversale</option>
              </select>
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
                ) : ue ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}