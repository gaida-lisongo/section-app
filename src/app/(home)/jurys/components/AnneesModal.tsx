import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import agentService from '@/api/agentService';
import { toast } from 'react-hot-toast';

interface Annee {
  _id: string;
  debut: string;
  fin: string;
}

interface AnneesModalProps {
  isOpen: boolean;
  onClose: () => void;
  jury: any;
  onSave: (annees: string[]) => Promise<void>;
}

export default function AnneesModal({ isOpen, onClose, jury, onSave }: AnneesModalProps) {
  const [annees, setAnnees] = useState<Annee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnees, setSelectedAnnees] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchAnnees();
      setSelectedAnnees(jury.annees || []);
    }
  }, [isOpen, jury]);

  const fetchAnnees = async () => {
    try {
      const response = await agentService.getAllAnnees();
      if (response.success) {
        setAnnees(response.data);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des années académiques");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAnnee = (anneeId: string) => {
    setSelectedAnnees(prev => {
      if (prev.includes(anneeId)) {
        return prev.filter(id => id !== anneeId);
      }
      return [...prev, anneeId];
    });
  };

  const handleSave = async () => {
    try {
      await onSave(selectedAnnees);
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const filteredAnnees = annees.filter(annee =>
    `${annee.debut}-${annee.fin}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="p-6">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarDays} className="text-primary" />
              Gestion des années académiques
            </Dialog.Title>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Rechercher une année académique..."
                className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liste des années disponibles */}
              <div className="space-y-4">
                <h3 className="font-medium">Années disponibles</h3>
                <div className="h-[400px] overflow-y-auto space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary" />
                    </div>
                  ) : (
                    filteredAnnees
                      .filter(a => !selectedAnnees.includes(a._id))
                      .map(annee => (
                        <div
                          key={annee._id}
                          onClick={() => handleToggleAnnee(annee._id)}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 
                                   dark:hover:bg-gray-600 cursor-pointer transition-all"
                        >
                          <span className="font-medium">{annee.debut}-{annee.fin}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Années sélectionnées */}
              <div className="space-y-4">
                <h3 className="font-medium">Années assignées</h3>
                <div className="h-[400px] overflow-y-auto space-y-2">
                  {filteredAnnees
                    .filter(a => selectedAnnees.includes(a._id))
                    .map(annee => (
                      <div
                        key={annee._id}
                        className="p-4 bg-primary/5 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{annee.debut}-{annee.fin}</span>
                          <button
                            onClick={() => handleToggleAnnee(annee._id)}
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