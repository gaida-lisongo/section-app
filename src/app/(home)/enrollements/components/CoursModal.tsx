import { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import sectionService from '@/api/sectionService';
import { toast } from 'react-hot-toast';
import enrollementService from '@/api/enrollementService';
import type { GetMatieresByPromotionResponse } from '@/types/responses';

interface Cours {
  _id: string;
  designation: string;
  unite: {
    _id: string;
    designation: string;
  };
}

interface CoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollement: any;
  onSave: (cours: string[]) => Promise<void>;
}

export default function CoursModal({ isOpen, onClose, enrollement, onSave }: CoursModalProps) {
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCours, setSelectedCours] = useState<string[]>([]);
    console.log("Enrollement:", enrollement);

  const fetchCours = useCallback(async () => {
    try {
      const response = await enrollementService.getMatieresByPromotion(enrollement.promotionId._id) as GetMatieresByPromotionResponse;
      
      if (response.success && response.data.success) {
        const allMatieres = response.data.data.unites.flatMap(unite => {
          const firstSemMatieres = unite.semestres.Premier || [];
          const secondSemMatieres = unite.semestres.Second || [];
          return [...firstSemMatieres, ...secondSemMatieres].map(matiere => ({
            _id: matiere._id,
            designation: matiere.designation,
            unite: {
              _id: unite.code,
              designation: unite.designation
            }
          }));
        });
        setCours(allMatieres);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  }, [enrollement.promotionId._id]);

  useEffect(() => {
    if (isOpen) {
      fetchCours();
      setSelectedCours(enrollement.cours || []);
    }
  }, [isOpen, enrollement, fetchCours]);

  const handleToggleCours = (coursId: string) => {
    setSelectedCours(prev => {
      if (prev.includes(coursId)) {
        return prev.filter(id => id !== coursId);
      }
      return [...prev, coursId];
    });
  };

  const handleSave = async () => {
    try {
      await onSave(selectedCours);
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const filteredCours = cours.filter(c =>
    c.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.unite.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="p-6">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faBook} className="text-primary" />
              Gestion des cours
            </Dialog.Title>

            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 
                           dark:bg-gray-700"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liste des cours */}
              <div className="space-y-4">
                <h3 className="font-medium">Cours disponibles</h3>
                <div className="h-[400px] overflow-y-auto space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary" />
                    </div>
                  ) : (
                    filteredCours
                      .filter(c => !selectedCours.includes(c._id))
                      .map(cours => (
                        <div
                          key={cours._id}
                          onClick={() => handleToggleCours(cours._id)}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 
                                   dark:hover:bg-gray-600 cursor-pointer"
                        >
                          <p className="font-medium">{cours.designation}</p>
                          <p className="text-sm text-gray-500">{cours.unite.designation}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Cours sélectionnés */}
              <div className="space-y-4">
                <h3 className="font-medium">Cours affectés</h3>
                <div className="h-[400px] overflow-y-auto space-y-2">
                  {filteredCours
                    .filter(c => selectedCours.includes(c._id))
                    .map(cours => (
                      <div
                        key={cours._id}
                        className="p-4 bg-primary/5 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{cours.designation}</p>
                            <p className="text-sm text-gray-500">{cours.unite.designation}</p>
                          </div>
                          <button
                            onClick={() => handleToggleCours(cours._id)}
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