"use client";

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useJuryStore } from '@/store/useJuryStore';
import { toast } from 'react-hot-toast';
import SearchInput from './components/SearchInput';
import LoadingSpinner from './components/LoadingSpinner';
import BureauModal from './components/BureauModal';
import PromotionsModal from './components/PromotionsModal';
import AnneesModal from './components/AnneesModal';

// Importez les types depuis le store
interface Bureau {
  agentId: string;
  grade: string;
}

interface Jury {
  _id: string;
  titre: string;
  description?: string;
  bureaux: Bureau[];
  promotions: string[];
  annees: string[];
}

export default function JurysPage() {
  const { jurys, loading, fetchJurys, saveCurrentConfig, setSelectedJury } = useJuryStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour les modales avec typage correct
  const [selectedJuryData, setSelectedJuryData] = useState<Jury | null>(null);
  const [isBureauModalOpen, setBureauModalOpen] = useState(false);
  const [isPromotionsModalOpen, setPromotionsModalOpen] = useState(false);
  const [isAnneesModalOpen, setAnneesModalOpen] = useState(false);

  useEffect(() => {
    fetchJurys();
  }, [fetchJurys]);

  // Gestionnaires pour les modales avec typage correct
  const handleOpenBureauModal = (jury: Jury) => {
    setSelectedJuryData(jury);
    setSelectedJury(jury._id);
    setBureauModalOpen(true);
  };

  const handleOpenPromotionsModal = (jury: Jury) => {
    setSelectedJuryData(jury);
    setSelectedJury(jury._id);
    setPromotionsModalOpen(true);
  };

  const handleOpenAnneesModal = (jury: Jury) => {
    setSelectedJuryData(jury);
    setSelectedJury(jury._id);
    setAnneesModalOpen(true);
  };

  // Gestionnaires de sauvegarde avec typage correct
  const handleSaveBureau = async (bureaux: Bureau[]) => {
    try {
      await saveCurrentConfig();
      toast.success("Bureau mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du bureau");
    }
  };

  const handleSavePromotions = async (promotions: string[]) => {
    try {
      await saveCurrentConfig();
      toast.success("Promotions mises à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des promotions");
    }
  };

  const handleSaveAnnees = async (annees: string[]) => {
    try {
      await saveCurrentConfig();
      toast.success("Années académiques mises à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des années");
    }
  };

  const filteredJurys = jurys.filter(jury => 
    jury.titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Jurys</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchInput 
            placeholder="Rechercher un jury..." 
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJurys.map(jury => (
          <div key={jury._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{jury.titre}</h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleOpenBureauModal(jury)}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 
                         rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span>Bureau</span>
                <span className="text-sm text-gray-500">{jury.bureaux.length} membres</span>
              </button>

              <button
                onClick={() => handleOpenPromotionsModal(jury)}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 
                         rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span>Promotions</span>
                <span className="text-sm text-gray-500">{jury.promotions.length} promotions</span>
              </button>

              <button
                onClick={() => handleOpenAnneesModal(jury)}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 
                         rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span>Années académiques</span>
                <span className="text-sm text-gray-500">{jury.annees.length} années</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      {selectedJuryData && (
        <>
          <BureauModal
            isOpen={isBureauModalOpen}
            onClose={() => setBureauModalOpen(false)}
            jury={selectedJuryData}
            onSave={handleSaveBureau}
          />

          <PromotionsModal
            isOpen={isPromotionsModalOpen}
            onClose={() => setPromotionsModalOpen(false)}
            jury={selectedJuryData}
            onSave={handleSavePromotions}
          />

          <AnneesModal
            isOpen={isAnneesModalOpen}
            onClose={() => setAnneesModalOpen(false)}
            jury={selectedJuryData}
            onSave={handleSaveAnnees}
          />
        </>
      )}
    </div>
  );
}