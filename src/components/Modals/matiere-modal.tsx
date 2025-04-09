"use client";

import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import sectionService from '@/api/sectionService';

interface Matiere {
  _id: string;
  designation: string;
  code: string;
  credit: number;
  semestre: "Premier" | "Second";
  codeUnite: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  matiere?: Matiere | null;
  uniteCode: string;
  onSuccess: (matiere: Matiere) => void;
}

export function MatiereModal({ isOpen, onClose, matiere, uniteCode, onSuccess }: Props) {
  const [form, setForm] = useState({
    designation: '',
    code: '',
    credit: '1',
    semestre: '',
    codeUnite: uniteCode
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (matiere) {
      setForm({
        designation: matiere.designation,
        code: matiere.code || '',
        credit: matiere.credit.toString(),
        semestre: matiere.semestre,
        codeUnite: matiere.codeUnite
      });
    } else {
      setForm({
        designation: '',
        code: '',
        credit: '1',
        semestre: '',
        codeUnite: uniteCode
      });
    }
  }, [matiere, uniteCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.designation || !form.credit || !form.semestre) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...form,
        credit: parseInt(form.credit),
        codeUnite: uniteCode
      };

      const response = await (matiere 
        ? sectionService.updateMatiere(matiere._id, data)
        : sectionService.createMatiere(uniteCode, data)
      );

      if (response.success) {
        toast.success(matiere ? 'Matière modifiée avec succès' : 'Matière créée avec succès');
        onSuccess(response.data); // Passer la matière créée/modifiée au parent
      } else {
        throw new Error(response.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {matiere ? 'Modifier la matière' : 'Nouvelle matière'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                  placeholder="Code de la matière"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Désignation *
                </label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={e => setForm(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Crédits *
                  </label>
                  <input
                    type="number"
                    value={form.credit}
                    onChange={e => setForm(prev => ({ ...prev, credit: e.target.value }))}
                    min="1"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Semestre *
                  </label>
                  <select
                    value={form.semestre}
                    onChange={e => setForm(prev => ({ ...prev, semestre: e.target.value }))}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 focus:border-primary dark:border-dark-3"
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Premier">Premier</option>
                    <option value="Second">Second</option>
                  </select>
                </div>
              </div>
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-70 hover:bg-primary/90"
              >
                {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                {matiere ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}